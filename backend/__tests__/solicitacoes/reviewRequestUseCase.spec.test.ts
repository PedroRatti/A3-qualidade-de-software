import { describe, expect, it, vi } from "vitest";
import { RequestsRepository } from "../../src/repositories/request";
import { User, UsersRepository } from "../../src/repositories/user";
import {
    RequestStatus,
    SupervisorRequestRecord,
} from "../../src/useCases/solicitacoes/contracts/request.types";
import { ReviewRequestUseCase } from "../../src/useCases/solicitacoes/reviewRequest";

function makeUser(overrides: Partial<User>): User {
    return {
        id: 1,
        name: "Pedro Admin",
        email: "pedro.admin@example.com",
        password: "123456",
        cpf: "12345678900",
        number: "48999990001",
        birth: "1995-05-17",
        role: "admin",
        is_active: true,
        ...overrides,
    };
}

function makeRequest(overrides: Partial<SupervisorRequestRecord> = {}): SupervisorRequestRecord {
    return {
        id: 100,
        user_id: 7,
        requester_name: "Ana Souza",
        requester_email: "ana.souza@example.com",
        supervisor_id: 1,
        supervisor_name: "Pedro Admin",
        type: "ferias",
        start_date: "2026-06-10",
        end_date: "2026-06-20",
        reason: "Férias programadas",
        attachment_url: null,
        status: "pendente",
        created_at: new Date("2026-05-12T10:00:00"),
        updated_at: new Date("2026-05-12T10:00:00"),
        ...overrides,
    };
}

describe("ReviewRequestUseCase", () => {
    it("deve aprovar a solicitação do supervisor logado", async () => {
        const usersRepository: Pick<UsersRepository, "findById"> = {
            findById: async () => makeUser({ id: 1, role: "admin" }),
        };

        const updateStatusMock = vi.fn(async (input: {
            requestId: number;
            status: RequestStatus;
        }) =>
            makeRequest({
                id: input.requestId,
                status: input.status,
                updated_at: new Date("2026-05-12T11:30:00"),
            })
        );

        const requestsRepository: Pick<RequestsRepository, "findById" | "updateStatus"> = {
            findById: async () => makeRequest(),
            updateStatus: updateStatusMock,
        };

        const useCase = new ReviewRequestUseCase(usersRepository, requestsRepository);

        const result = await useCase.execute({
            userId: 1,
            requestId: 100,
            status: "aprovado",
        });

        expect(updateStatusMock).toHaveBeenCalledWith({
            requestId: 100,
            status: "aprovada",
        });
        expect(result.status).toBe("aprovada");
        expect(result.statusLabel).toBe("Aprovada");
    });

    it("deve impedir revisão de solicitação de outro supervisor", async () => {
        const usersRepository: Pick<UsersRepository, "findById"> = {
            findById: async () => makeUser({ id: 1, role: "admin" }),
        };

        const requestsRepository: Pick<RequestsRepository, "findById" | "updateStatus"> = {
            findById: async () => makeRequest({ supervisor_id: 2 }),
            updateStatus: async () => {
                throw new Error("não deveria atualizar");
            },
        };

        const useCase = new ReviewRequestUseCase(usersRepository, requestsRepository);

        await expect(
            useCase.execute({
                userId: 1,
                requestId: 100,
                status: "rejeitado",
            })
        ).rejects.toThrow("Solicitação não pertence ao supervisor informado.");
    });

    it("deve impedir revisão de solicitação já analisada", async () => {
        const usersRepository: Pick<UsersRepository, "findById"> = {
            findById: async () => makeUser({ id: 1, role: "admin" }),
        };

        const requestsRepository: Pick<RequestsRepository, "findById" | "updateStatus"> = {
            findById: async () => makeRequest({ status: "aprovada" }),
            updateStatus: async () => {
                throw new Error("não deveria atualizar");
            },
        };

        const useCase = new ReviewRequestUseCase(usersRepository, requestsRepository);

        await expect(
            useCase.execute({
                userId: 1,
                requestId: 100,
                status: "rejeitada",
            })
        ).rejects.toThrow("Solicitação já analisada.");
    });
});