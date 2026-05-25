import { describe, expect, it } from "vitest";
import { RequestsRepository } from "../../src/repositories/request";
import { User, UsersRepository } from "../../src/repositories/user";
import { SupervisorRequestRecord } from "../../src/useCases/solicitacoes/contracts/request.types";
import { GetSupervisorRequestsUseCase } from "../../src/useCases/solicitacoes/getSupervisorRequests";

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

describe("GetSupervisorRequestsUseCase", () => {
    it("deve listar as solicitações atribuídas ao supervisor logado", async () => {
        const usersRepository: Pick<UsersRepository, "findById"> = {
            findById: async (id: number) => {
                if (id === 1) {
                    return makeUser({ id: 1, role: "admin" });
                }

                return null;
            },
        };

        const requestsRepository: Pick<RequestsRepository, "findHistoryBySupervisorId"> = {
            findHistoryBySupervisorId: async () => [
                makeRequest(),
                makeRequest({
                    id: 101,
                    user_id: 8,
                    requester_name: "Bruno Lima",
                    requester_email: "bruno.lima@example.com",
                    status: "rejeitada",
                }),
            ],
        };

        const useCase = new GetSupervisorRequestsUseCase(usersRepository, requestsRepository);

        const result = await useCase.execute({ userId: 1 });

        expect(result).toHaveLength(2);
        expect(result[0].requesterName).toBe("Ana Souza");
        expect(result[0].requesterEmail).toBe("ana.souza@example.com");
        expect(result[0].supervisorName).toBe("Pedro Admin");
    });

    it("deve impedir acesso de usuário que não seja admin", async () => {
        const usersRepository: Pick<UsersRepository, "findById"> = {
            findById: async () => makeUser({ id: 7, role: "employee" }),
        };

        const requestsRepository: Pick<RequestsRepository, "findHistoryBySupervisorId"> = {
            findHistoryBySupervisorId: async () => [],
        };

        const useCase = new GetSupervisorRequestsUseCase(usersRepository, requestsRepository);

        await expect(useCase.execute({ userId: 7 })).rejects.toThrow("Acesso negado.");
    });
});