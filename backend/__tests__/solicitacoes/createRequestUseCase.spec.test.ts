import { Buffer } from "node:buffer";
import { Readable } from "node:stream";
import { describe, expect, it, vi } from "vitest";
import { RequestsRepository } from "../../src/repositories/request";
import { User, UsersRepository } from "../../src/repositories/user";
import { CreateRequestUseCase } from "../../src/useCases/solicitacoes/createRequest";

type MockAttachment = {
    fieldname: string;
    originalname: string;
    encoding: string;
    mimetype: string;
    size: number;
    destination: string;
    filename: string;
    path: string;
    buffer: Buffer;
    stream: Readable;
};

function makeUser(overrides: Partial<User>): User {
    return {
        id: 1,
        name: "Ana Souza",
        email: "ana.souza@example.com",
        password: "123456",
        cpf: "12345678901",
        number: "48999990002",
        birth: "1998-03-12",
        role: "employee",
        is_active: true,
        ...overrides,
    };
}

function makeAttachment(overrides: Partial<MockAttachment> = {}): MockAttachment {
    return {
        fieldname: "attachment",
        originalname: "atestado.pdf",
        encoding: "7bit",
        mimetype: "application/pdf",
        size: 1024,
        destination: "uploads/requests",
        filename: "171555-atestado.pdf",
        path: "uploads/requests/171555-atestado.pdf",
        buffer: Buffer.from("fake"),
        stream: Readable.from(Buffer.from("fake")),
        ...overrides,
    };
}

describe("CreateRequestUseCase", () => {
    it("deve criar solicitação de férias com supervisor admin válido", async () => {
        const users = new Map<number, User>([
            [7, makeUser({ id: 7, name: "Ana Souza", role: "employee" })],
            [1, makeUser({ id: 1, name: "Pedro Admin", role: "admin" })],
        ]);

        const usersRepository: Pick<UsersRepository, "findById"> = {
            findById: async (id: number) => users.get(id) ?? null,
        };

        const createMock = vi.fn(async (input: {
            userId: number;
            supervisorId: number;
            type: "ferias" | "abono_falta" | "outro";
            startDate: string;
            endDate: string;
            reason: string;
            attachmentUrl: string | null;
        }) => ({
            id: 100,
            user_id: input.userId,
            supervisor_id: input.supervisorId,
            supervisor_name: "Pedro Admin",
            type: input.type,
            start_date: input.startDate,
            end_date: input.endDate,
            reason: input.reason,
            attachment_url: input.attachmentUrl,
            status: "pendente" as const,
            created_at: new Date("2026-05-12T10:00:00"),
            updated_at: new Date("2026-05-12T10:00:00"),
        }));

        const requestsRepository: Pick<RequestsRepository, "create"> = {
            create: createMock,
        };

        const useCase = new CreateRequestUseCase(usersRepository, requestsRepository);

        const result = await useCase.execute({
            userId: 7,
            supervisorId: 1,
            type: "ferias",
            startDate: "2026-06-10",
            endDate: "2026-06-20",
            reason: "Férias programadas",
        });

        expect(createMock).toHaveBeenCalledWith({
            userId: 7,
            supervisorId: 1,
            type: "ferias",
            startDate: "2026-06-10",
            endDate: "2026-06-20",
            reason: "Férias programadas",
            attachmentUrl: null,
        });expect(result.type).toBe("ferias");
        expect(result.typeLabel).toBe("Férias");
        expect(result.supervisorId).toBe(1);
        expect(result.supervisorName).toBe("Pedro Admin");
        expect(result.status).toBe("pendente");
        expect(result.attachmentUrl).toBeNull();
    });

    it("deve criar solicitação de abono de falta com anexo", async () => {
        const usersRepository: Pick<UsersRepository, "findById"> = {
            findById: async (id: number) => {
                if (id === 7) {
                    return makeUser({ id: 7, role: "employee", name: "Ana Souza" });
                }

                if (id === 1) {
                    return makeUser({ id: 1, role: "admin", name: "Pedro Admin" });
                }

                return null;
            },
        };

        const requestsRepository: Pick<RequestsRepository, "create"> = {
            create: async (input) => ({
                id: 101,
                user_id: input.userId,
                supervisor_id: input.supervisorId,
                supervisor_name: "Pedro Admin",
                type: input.type,
                start_date: input.startDate,
                end_date: input.endDate,
                reason: input.reason,
                attachment_url: input.attachmentUrl,
                status: "pendente",
                created_at: new Date("2026-05-12T11:00:00"),
                updated_at: new Date("2026-05-12T11:00:00"),
            }),
        };

        const useCase = new CreateRequestUseCase(usersRepository, requestsRepository);

        const result = await useCase.execute({
            userId: 7,
            supervisorId: 1,
            type: "abono_falta",
            startDate: "2026-05-12",
            endDate: "2026-05-12",
            reason: "Consulta medica",
            attachment: makeAttachment(),
        });

        expect(result.type).toBe("abono_falta");
        expect(result.attachmentUrl).toBe("/uploads/requests/171555-atestado.pdf");
    });

    it("deve falhar quando abono de falta for enviado sem anexo", async () => {
        const usersRepository: Pick<UsersRepository, "findById"> = {
            findById: async (id: number) => {
                if (id === 7) {
                    return makeUser({ id: 7, role: "employee" });
                }

                if (id === 1) {
                    return makeUser({ id: 1, role: "admin", name: "Pedro Admin" });
                }

                return null;
            },
        };

        const requestsRepository: Pick<RequestsRepository, "create"> = {
            create: async () => {
                throw new Error("nao deveria criar");
            },
        };

        const useCase = new CreateRequestUseCase(usersRepository, requestsRepository);await expect(
            useCase.execute({
                userId: 7,
                supervisorId: 1,
                type: "abono_falta",
                startDate: "2026-05-12",
                endDate: "2026-05-12",
                reason: "Consulta medica",
            })
        ).rejects.toThrow("É necessário anexar o atestado para abono de falta.");
    });

    it("deve falhar quando o supervisor não for admin", async () => {
        const usersRepository: Pick<UsersRepository, "findById"> = {
            findById: async (id: number) => {
                if (id === 7) {
                    return makeUser({ id: 7, role: "employee" });
                }

                if (id === 2) {
                    return makeUser({ id: 2, role: "employee", name: "Bruno Lima" });
                }

                return null;
            },
        };

        const requestsRepository: Pick<RequestsRepository, "create"> = {
            create: async () => {
                throw new Error("não deveria criar");
            },
        };

        const useCase = new CreateRequestUseCase(usersRepository, requestsRepository);

        await expect(
            useCase.execute({
                userId: 7,
                supervisorId: 2,
                type: "ferias",
                startDate: "2026-06-10",
                endDate: "2026-06-20",
                reason: "Férias programadas",
            })
        ).rejects.toThrow("Supervisor inválido.");
    });

    it("deve falhar quando a data inicial for maior que a final", async () => {
        const usersRepository: Pick<UsersRepository, "findById"> = {
            findById: async () => makeUser({ id: 7 }),
        };

        const requestsRepository: Pick<RequestsRepository, "create"> = {
            create: async () => {
                throw new Error("não deveria criar");
            },
        };

        const useCase = new CreateRequestUseCase(usersRepository, requestsRepository);

        await expect(
            useCase.execute({
                userId: 7,
                supervisorId: 1,
                type: "ferias",
                startDate: "2026-06-20",
                endDate: "2026-06-10",
                reason: "Férias programadas",
            })
        ).rejects.toThrow("A data inicial não pode ser maior que a data final.");
    });
});
