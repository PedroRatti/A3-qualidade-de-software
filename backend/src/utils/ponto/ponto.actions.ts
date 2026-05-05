import { PointActionKey, PointStatus, TimeEntryAction } from "../../useCases/ponto/contracts/ponto.types";

function sanitizeActionValue(value: string) {
    return value
        .trim()
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/\s+/g, "_");
}

export function normalizeTimeEntryAction(action: string): TimeEntryAction {
    const normalized = sanitizeActionValue(action);

    if (normalized.startsWith("entrada") && normalized.includes("almo")) {
        return "entrada_almoco";
    }

    if (normalized.startsWith("entrada")) {
        return "entrada";
    }

    if ((normalized.startsWith("saida") || normalized.startsWith("sa")) && normalized.includes("almo")) {
        return "saida_almoco";
    }

    if (normalized.startsWith("saida") || normalized.startsWith("sa")) {
        return "saida";
    }

    throw new Error(`Acao de ponto desconhecida no banco: ${action}`);
}

export function mapPointActionKeyToTimeEntryAction(action: string): TimeEntryAction | null {
    switch (action) {
        case "clock-in":
            return "entrada";
        case "start-break":
            return "saida_almoco";
        case "end-break":
            return "entrada_almoco";
        case "clock-out":
            return "saida";
        default:
            return null;
    }
}

export function getAvailableActions(actions: TimeEntryAction[]): PointActionKey[] {
    const lastAction = actions.at(-1);

    if (!lastAction) {
        return ["clock-in"];
    }

    switch (lastAction) {
        case "entrada":
            return ["start-break", "clock-out"];
        case "saida_almoco":
            return ["end-break"];
        case "entrada_almoco":
            return ["clock-out"];
        case "saida":
            return [];
    }
}

export function getPointStatus(actions: TimeEntryAction[]): PointStatus {
    const lastAction = actions.at(-1);

    if (!lastAction) {
        return "aguardando-entrada";
    }

    switch (lastAction) {
        case "saida_almoco":
            return "em-pausa";
        case "saida":
            return "jornada-encerrada";
        case "entrada":
        case "entrada_almoco":
            return "em-jornada";
    }
}