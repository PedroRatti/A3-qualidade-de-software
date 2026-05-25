import { describe, expect, it } from "vitest";

import type {
    TeamTimeEntryRecord,
    TimeEntriesRepository,
} from "../../src/repositories/timeEntry";
import { User, UsersRepository } from "../../src/repositories/user";
import { GetTeamPointHistoryUseCase } from "../../src/useCases/ponto/getTeamPointHistory";

class FakeUsersRepository implements Pick<UsersRepository, "findById"> {
    constructor(private user: User | null) { }

    async findById(id: number): Promise<User | null> {
        if (this.user?.id === id) {
            return this.user;
        }

        return null;
    }
}

class FakeTimeEntriesRepository implements Pick<TimeEntriesRepository, "findTeamHistory"> {
    constructor(private entries: TeamTimeEntryRecord[]) { }

    async findTeamHistory(): Promise<TeamTimeEntryRecord[]> {
        return this.entries;
    }
}

describe("GetTeamPointHistoryUseCase", () => {
    it("deve retornar o histórico agrupado por colaborador e por dia para um admin", async () => {
        const adminUser: User = {
            id: 1,
            name: "Pedro Admin",
            email: "pedro.admin@example.com",
            password: "123456",
            cpf: "12345678900",
            number: "48999990001",
            birth: "1995-05-17",
            role: "admin",
            is_active: true,
        };

        const entries: TeamTimeEntryRecord[] = [
            {
                id: 4,
                user_id: 7,
                action: "saida",
                created_at: new Date("2026-05-05T17:00:00"),
                user_name: "Ana Souza",
                user_email: "ana.souza@example.com",
                user_is_active: true,
            },
            {
                id: 3,
                user_id: 7,
                action: "entrada_almoco",
                created_at: new Date("2026-05-05T13:00:00"),
                user_name: "Ana Souza",
                user_email: "ana.souza@example.com",
                user_is_active: true,
            },
            {
                id: 2,
                user_id: 7,
                action: "saida_almoco",
                created_at: new Date("2026-05-05T12:00:00"),
                user_name: "Ana Souza",
                user_email: "ana.souza@example.com",
                user_is_active: true,
            },
            {
                id: 1,
                user_id: 7,
                action: "entrada",
                created_at: new Date("2026-05-05T08:00:00"),
                user_name: "Ana Souza",
                user_email: "ana.souza@example.com",
                user_is_active: true,
            },
            {
                id: 6,
                user_id: 8,
                action: "saida",
                created_at: new Date("2026-05-04T18:00:00"),
                user_name: "Bruno Lima",
                user_email: "bruno.lima@example.com",
                user_is_active: true,
            },
            {
                id: 5,
                user_id: 8,
                action: "entrada",
                created_at: new Date("2026-05-04T09:00:00"),
                user_name: "Bruno Lima",
                user_email: "bruno.lima@example.com",
                user_is_active: true,
            },
        ];

        const useCase = new GetTeamPointHistoryUseCase(
            new FakeUsersRepository(adminUser),
            new FakeTimeEntriesRepository(entries)
        );

        const result = await useCase.execute({
            requesterUserId: 1,
            daysBack: 30,
        });

        expect(result).toHaveLength(2);
        expect(result[0].employeeName).toBe("Ana Souza");
        expect(result[0].history[0]).toMatchObject({
            date: "2026-05-05",
            workedTime: "08:00",
        });
        expect(result[0].history[0].records).toEqual([
            {
                id: 1,
                label: "Entrada",
                timestamp: "08:00",
                kind: "entrada",
            },
            {
                id: 2,
                label: "Inicio da pausa",
                timestamp: "12:00",
                kind: "pausa",
            },
            {
                id: 3,
                label: "Fim da pausa",
                timestamp: "13:00",
                kind: "retorno",
            },
            {
                id: 4,
                label: "Saida",
                timestamp: "17:00",
                kind: "saida",
            },
        ]);
    });

    it("deve impedir acesso de usuário que não seja admin", async () => {
        const employeeUser: User = {
            id: 7,
            name: "Ana Souza",
            email: "ana.souza@example.com",
            password: "123456",
            cpf: "12345678901",
            number: "48999990002",
            birth: "1998-03-12",
            role: "employee",
            is_active: true,
        };

        const useCase = new GetTeamPointHistoryUseCase(
            new FakeUsersRepository(employeeUser),
            new FakeTimeEntriesRepository([])
        );

        await expect(
            useCase.execute({
                requesterUserId: 7,
                daysBack: 30,
            })
        ).rejects.toThrow("Acesso negado.");
    });

    it("deve rejeitar um período inválido", async () => {
        const adminUser: User = {
            id: 1,
            name: "Pedro Admin",
            email: "pedro.admin@example.com",
            password: "123456",
            cpf: "12345678900",
            number: "48999990001",
            birth: "1995-05-17",
            role: "admin",
            is_active: true,
        };

        const useCase = new GetTeamPointHistoryUseCase(
            new FakeUsersRepository(adminUser),
            new FakeTimeEntriesRepository([])
        );

        await expect(
            useCase.execute({
                requesterUserId: 1,
                daysBack: 0,
            })
        ).rejects.toThrow("Período de consulta inválido.");
    });
});