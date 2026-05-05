import { describe, expect, it } from "vitest";

import { TimeEntriesRepository } from "../../src/repositories/timeEntry";
import { User, UsersRepository } from "../../src/repositories/user";
import { GetTodayPointSummaryUseCase } from "../../src/useCases/ponto/getTodayPointSummary";
import { TimeEntryRecord } from "../../src/useCases/ponto/contracts/ponto.types";

class FakeUsersRepository implements Pick<UsersRepository, "findById"> {
    constructor(private user: User | null) { }

    async findById(id: number): Promise<User | null> {
        if (this.user?.id === id) {
            return this.user;
        }

        return null;
    }
}

class FakeTimeEntriesRepository implements Pick<TimeEntriesRepository, "findTodayByUserId"> {
    constructor(private entries: TimeEntryRecord[]) { }

    async findTodayByUserId(): Promise<TimeEntryRecord[]> {
        return this.entries;
    }
}

describe("GetTodayPointSummaryUseCase", () => {
    it("deve retornar resumo vazio quando ainda nao houver batidas no dia", async () => {
        const useCase = new GetTodayPointSummaryUseCase(
            new FakeUsersRepository({
                id: 7,
                name: "Ana Souza",
                email: "ana.souza@example.com",
                password: "123456",
                cpf: "12345678901",
                number: "48999990002",
                birth: "1998-03-12",
                role: "employee",
                is_active: true,
            }),
            new FakeTimeEntriesRepository([])
        );

        const summary = await useCase.execute({
            userId: 7,
            now: new Date("2026-05-05T09:15:00"),
        });

        expect(summary.employeeName).toBe("Ana Souza");
        expect(summary.status).toBe("aguardando-entrada");
        expect(summary.availableActions).toEqual(["clock-in"]);
        expect(summary.workedTime).toBe("00:00");
        expect(summary.records).toEqual([]);
    });

    it("deve consolidar o total trabalhado e as proximas acoes disponiveis", async () => {
        const useCase = new GetTodayPointSummaryUseCase(
            new FakeUsersRepository({
                id: 2,
                name: "Bruno Lima",
                email: "bruno.lima@example.com",
                password: "123456",
                cpf: "12345678902",
                number: "48999990003",
                birth: "1997-07-25",
                role: "employee",
                is_active: true,
            }),
            new FakeTimeEntriesRepository([
                {
                    id: 1,
                    user_id: 2,
                    action: "entrada",
                    created_at: new Date("2026-05-05T08:00:00"),
                },
                {
                    id: 2,
                    user_id: 2,
                    action: "saida_almoco",
                    created_at: new Date("2026-05-05T12:00:00"),
                },
                {
                    id: 3,
                    user_id: 2,
                    action: "entrada_almoco",
                    created_at: new Date("2026-05-05T13:00:00"),
                },
            ])
        );

        const summary = await useCase.execute({
            userId: 2,
            now: new Date("2026-05-05T15:30:00"),
        });

        expect(summary.status).toBe("em-jornada");
        expect(summary.availableActions).toEqual(["clock-out"]);
        expect(summary.workedTime).toBe("06:30");
        expect(summary.records).toEqual([
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
        ]);
    });
});