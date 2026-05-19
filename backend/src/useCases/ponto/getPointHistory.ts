import { TimeEntriesRepository } from "../../repositories/timeEntry";
import { UsersRepository } from "../../repositories/user";
import type { TimeEntryRecord } from "./contracts/ponto.types";

type PointHistoryRecord = {
    id: number;
    label: string;
    timestamp: string;
    kind: "entrada" | "pausa" | "retorno" | "saida";
};

type PointHistoryDay = {
    date: string;
    dayLabel: string;
    workedTime: string;
    records: PointHistoryRecord[];
};

type GetPointHistoryRequest = {
    userId: number;
};

function formatTime(date: Date) {
    return new Intl.DateTimeFormat("pt-BR", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
    }).format(date);
}

function formatDayLabel(dateKey: string) {
    const date = new Date(`${dateKey}T00:00:00`);
    return new Intl.DateTimeFormat("pt-BR", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
    }).format(date);
}

function mapRecord(entry: TimeEntryRecord): PointHistoryRecord {
    switch (entry.action) {
        case "entrada":
            return { id: entry.id, label: "Entrada", timestamp: formatTime(entry.created_at), kind: "entrada" };
        case "saida_almoco":
            return { id: entry.id, label: "Início da pausa", timestamp: formatTime(entry.created_at), kind: "pausa" };
        case "entrada_almoco":
            return { id: entry.id, label: "Fim da pausa", timestamp: formatTime(entry.created_at), kind: "retorno" };
        case "saida":
            return { id: entry.id, label: "Saída", timestamp: formatTime(entry.created_at), kind: "saida" };
    }
}

function toDateKey(date: Date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
}

function calculateWorkedTime(entries: TimeEntryRecord[]) {
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

    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;

    return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}`;
}

export class GetPointHistoryUseCase {
    constructor(
        private usersRepository: Pick<UsersRepository, "findById">,
        private timeEntriesRepository: Pick<TimeEntriesRepository, "findHistoryByUserId">
    ) { }

    async execute({ userId }: GetPointHistoryRequest): Promise<PointHistoryDay[]> {
        const user = await this.usersRepository.findById(userId);

        if (!user) {
            throw new Error("Usuário não encontrado.");
        }

        if (!user.is_active) {
            throw new Error("Usuário inativo.");
        }

        const entries = await this.timeEntriesRepository.findHistoryByUserId(userId);
        const grouped = new Map<string, TimeEntryRecord[]>();

        for (const entry of entries) {
            const dateKey = toDateKey(entry.created_at);
            const current = grouped.get(dateKey) ?? [];
            current.push(entry);
            grouped.set(dateKey, current);
        }

        return Array.from(grouped.entries()).map(([date, dayEntries]) => ({
            date,
            dayLabel: formatDayLabel(date),
            workedTime: calculateWorkedTime(dayEntries),
            records: dayEntries
                .sort((a, b) => a.created_at.getTime() - b.created_at.getTime())
                .map(mapRecord),
        }));
    }
}