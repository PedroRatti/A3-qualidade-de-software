import { TimeEntriesRepository, type TeamTimeEntryRecord } from "../../repositories/timeEntry";
import { UsersRepository } from "../../repositories/user";
import type { TimeEntryRecord } from "./contracts/ponto.types";
import { formatDuration, formatTime, mapActionLabel } from "../../utils/ponto/ponto.formatter";

type TeamPointHistoryRecord = {
    id: number;
    label: string;
    timestamp: string;
    kind: "entrada" | "pausa" | "retorno" | "saida";
};

type TeamPointHistoryDay = {
    date: string;
    dayLabel: string;
    workedTime: string;
    records: TeamPointHistoryRecord[];
};

export type TeamPointHistoryEmployee = {
    userId: number;
    employeeName: string;
    employeeEmail: string;
    isActive: boolean;
    history: TeamPointHistoryDay[];
};

type GetTeamPointHistoryRequest = {
    requesterUserId: number;
    daysBack?: number;
};

function normalizeDaysBack(daysBack = 30) {
    if (!Number.isInteger(daysBack) || daysBack < 1 || daysBack > 90) {
        throw new Error("Período de consulta inválido.");
    }

    return daysBack;
}

function formatDayLabel(dateKey: string) {
    const date = new Date(`${dateKey}T00:00:00`);

    return new Intl.DateTimeFormat("pt-BR", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
    }).format(date);
}

function toDateKey(date: Date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
}

function calculateWorkedMinutes(entries: TimeEntryRecord[]) {
    const orderedEntries = [...entries].sort((a, b) => a.created_at.getTime() - b.created_at.getTime());

    let totalMinutes = 0;
    let openWorkStart: Date | null = null;

    for (const entry of orderedEntries) {
        if (entry.action === "entrada" || entry.action === "entrada_almoco") {
            openWorkStart = entry.created_at;
            continue;
        }

        if ((entry.action === "saida_almoco" || entry.action === "saida") && openWorkStart) {
            totalMinutes += Math.max(
                0,
                Math.floor((entry.created_at.getTime() - openWorkStart.getTime()) / 60000)
            );
            openWorkStart = null;
        }
    }

    return totalMinutes;
}

function toBaseEntry(entry: TeamTimeEntryRecord): TimeEntryRecord {
    return {
        id: entry.id,
        user_id: entry.user_id,
        action: entry.action,
        created_at: entry.created_at,
    };
}

function buildHistory(entries: TeamTimeEntryRecord[]): TeamPointHistoryDay[] {
    const groupedByDate = new Map<string, TimeEntryRecord[]>();

    for (const entry of entries) {
        const dateKey = toDateKey(entry.created_at);
        const current = groupedByDate.get(dateKey) ?? [];

        current.push(toBaseEntry(entry));
        groupedByDate.set(dateKey, current);
    }

    return Array.from(groupedByDate.entries())
        .sort(([dateA], [dateB]) => dateA < dateB ? 1 : -1)
        .map(([date, dayEntries]) => {
            const orderedEntries = [...dayEntries].sort(
                (a, b) => a.created_at.getTime() - b.created_at.getTime()
            );

            return {
                date,
                dayLabel: formatDayLabel(date),
                workedTime: formatDuration(calculateWorkedMinutes(orderedEntries)),
                records: orderedEntries.map((entry) => {
                    const mapped = mapActionLabel(entry.action);

                    return {
                        id: entry.id,
                        label: mapped.label,
                        timestamp: formatTime(entry.created_at),
                        kind: mapped.kind,
                    };
                }),
            };
        });
}

export class GetTeamPointHistoryUseCase {
    constructor(
        private usersRepository: Pick<UsersRepository, "findById">,
        private timeEntriesRepository: Pick<TimeEntriesRepository, "findTeamHistory">
    ) { }

    async execute({
        requesterUserId,
        daysBack,
    }: GetTeamPointHistoryRequest): Promise<TeamPointHistoryEmployee[]> {
        const requester = await this.usersRepository.findById(requesterUserId);

        if (!requester) {
            throw new Error("Usuário não encontrado.");
        }

        if (!requester.is_active) {
            throw new Error("Usuário inativo.");
        }

        if (requester.role !== "admin") {
            throw new Error("Acesso negado.");
        }

        const entries = await this.timeEntriesRepository.findTeamHistory(
            normalizeDaysBack(daysBack)
        );

        const groupedByUser = new Map<number, TeamTimeEntryRecord[]>();

        for (const entry of entries) {
            const current = groupedByUser.get(entry.user_id) ?? [];
            current.push(entry);
            groupedByUser.set(entry.user_id, current);
        }

        return Array.from(groupedByUser.values()).map((userEntries) => {
            const firstEntry = userEntries[0];

            return {
                userId: firstEntry.user_id,
                employeeName: firstEntry.user_name,
                employeeEmail: firstEntry.user_email,
                isActive: firstEntry.user_is_active,
                history: buildHistory(userEntries),
            };
        });
    }
}