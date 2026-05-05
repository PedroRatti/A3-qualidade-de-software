import { TimeEntryAction, TimeEntryRecord } from "../../useCases/ponto/contracts/ponto.types";

export function formatDay(now: Date) {
    return new Intl.DateTimeFormat("pt-BR", {
        weekday: "long",
        day: "2-digit",
        month: "long",
        year: "numeric",
    }).format(now);
}

export function formatTime(now: Date) {
    return new Intl.DateTimeFormat("pt-BR", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
    }).format(now);
}

export function formatDuration(totalMinutes: number) {
    const safeMinutes = Math.max(0, totalMinutes);
    const hours = Math.floor(safeMinutes / 60);
    const minutes = safeMinutes % 60;

    return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}`;
}

function differenceInMinutes(start: Date, end: Date) {
    return Math.max(0, Math.floor((end.getTime() - start.getTime()) / 60000));
}

export function calculateWorkedMinutes(entries: TimeEntryRecord[], now: Date) {
    let totalMinutes = 0;
    let openWorkStart: Date | null = null;

    for (const entry of entries) {
        if (entry.action === "entrada" || entry.action === "entrada_almoco") {
            openWorkStart = entry.created_at;
            continue;
        }

        if ((entry.action === "saida_almoco" || entry.action === "saida") && openWorkStart) {
            totalMinutes += differenceInMinutes(openWorkStart, entry.created_at);
            openWorkStart = null;
        }
    }

    if (openWorkStart) {
        totalMinutes += differenceInMinutes(openWorkStart, now);
    }

    return totalMinutes;
}

export function mapActionLabel(action: TimeEntryAction) {
    switch (action) {
        case "entrada":
            return { label: "Entrada", kind: "entrada" as const };
        case "saida_almoco":
            return { label: "Inicio da pausa", kind: "pausa" as const };
        case "entrada_almoco":
            return { label: "Fim da pausa", kind: "retorno" as const };
        case "saida":
            return { label: "Saida", kind: "saida" as const };
    }
}