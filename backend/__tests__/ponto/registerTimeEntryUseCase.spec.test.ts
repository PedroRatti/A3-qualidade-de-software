import { beforeEach, describe, expect, it } from "vitest";

import { TimeEntriesRepository } from "../../src/repositories/timeEntry";
import { User, UsersRepository } from "../../src/repositories/user";
import { RegisterTimeEntryUseCase } from "../../src/useCases/ponto/registerTimeEntry";
import { TimeEntryAction, TimeEntryRecord } from "../../src/useCases/ponto/contracts/ponto.types";

class FakeUsersRepository implements Pick<UsersRepository, "findById"> {
    constructor(private user: User | null) { }

    async findById(id: number): Promise<User | null> {
        if (this.user?.id === id) {
            return this.user;
        }

        return null;
    }
}

class FakeTimeEntriesRepository implements Pick<TimeEntriesRepository, "findTodayByUserId" | "create"> {
    private entries: TimeEntryRecord[];

    constructor(initialEntries: TimeEntryRecord[]) {
        this.entries = [...initialEntries];
    }

    async findTodayByUserId(): Promise<TimeEntryRecord[]> {
        return this.entries;
    }

    async create(input: { userId: number; action: TimeEntryAction }): Promise<TimeEntryRecord> {
        const created: TimeEntryRecord = {
            id: this.entries.length + 1,
            user_id: input.userId,
            action: input.action,
            created_at: new Date("2026-05-05T08:00:00"),
        };

        this.entries.push(created);

        return created;
    }
}

describe("RegisterTimeEntryUseCase", () => {
    let user: User;

    beforeEach(() => {
        user = {
            id: 9,
            name: "Carla Mendes",
            email: "carla.mendes@example.com",
            password: "123456",
            cpf: "12345678903",
            number: "48999990004",
            birth: "1999-11-02",
            role: "employee",
            is_active: true,
        };
    });

    it("deve registrar a entrada quando não houver batidas anteriores no dia", async () => {
        const timeEntriesRepository = new FakeTimeEntriesRepository([]);
        const useCase = new RegisterTimeEntryUseCase(
            new FakeUsersRepository(user),
            timeEntriesRepository as TimeEntriesRepository
        );

        const summary = await useCase.execute({
            userId: 9,
            action: "clock-in",
            now: new Date("2026-05-05T08:05:00"),
        });

        expect(summary.status).toBe("em-jornada");
        expect(summary.availableActions).toEqual(["start-break", "clock-out"]);
        expect(summary.records).toHaveLength(1);
        expect(summary.records[0]).toMatchObject({
            label: "Entrada",
            kind: "entrada",
        });
    });

    it("deve impedir uma ação fora da sequência esperada", async () => {
        const timeEntriesRepository = new FakeTimeEntriesRepository([]);
        const useCase = new RegisterTimeEntryUseCase(
            new FakeUsersRepository(user),
            timeEntriesRepository as TimeEntriesRepository
        );

        await expect(
            useCase.execute({
                userId: 9,
                action: "clock-out",
            })
        ).rejects.toThrow("Ação de ponto não permitida para o momento atual.");
    });

    it("deve rejeitar uma ação desconhecida", async () => {
        const timeEntriesRepository = new FakeTimeEntriesRepository([]);
        const useCase = new RegisterTimeEntryUseCase(
            new FakeUsersRepository(user),
            timeEntriesRepository as TimeEntriesRepository
        );

        await expect(
            useCase.execute({
                userId: 9,
                action: "invalid-action",
            })
        ).rejects.toThrow("Ação de ponto inválida.");
    });
});