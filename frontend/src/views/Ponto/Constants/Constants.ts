import type { IconType } from "react-icons";
import { FaArrowLeft, FaArrowRight, FaPause, FaPlay } from "react-icons/fa6";
import type { PointActionDefinition, PointActionKey, PointStatus, PointSummary } from "../../../types/ponto.types";

export const statusLabels: Record<PointStatus, string> = {
    "aguardando-entrada": "Aguardando entrada",
    "em-jornada": "Em jornada",
    "em-pausa": "Em pausa",
    "jornada-encerrada": "Jornada encerrada",
};

export const pointActionIcons: Record<PointActionKey, IconType> = {
    "clock-in": FaArrowRight,
    "start-break": FaPause,
    "end-break": FaPlay,
    "clock-out": FaArrowLeft,
};

export const actionDefinitions: PointActionDefinition[] = [
    { key: "clock-in", label: "Registrar entrada", tone: "primary" },
    { key: "start-break", label: "Iniciar pausa", tone: "neutral" },
    { key: "end-break", label: "Encerrar pausa", tone: "neutral" },
    { key: "clock-out", label: "Registrar saída", tone: "neutral" },
];

export function createPointPreview(): PointSummary {
    const now = new Date();

    return {
        employeeName: "Colaborador",
        status: "aguardando-entrada",
        shiftLabel: "Jornada prevista: 08:00 - 17:00",
        workedTime: "00:00",
        currentDay: new Intl.DateTimeFormat("pt-BR", {
            weekday: "long",
            day: "2-digit",
            month: "long",
            year: "numeric",
        }).format(now),
        currentTime: new Intl.DateTimeFormat("pt-BR", {
            hour: "2-digit",
            minute: "2-digit",
        }).format(now),
        availableActions: ["clock-in"],
        records: [
            { id: 1, label: "Entrada", timestamp: "--:--", kind: "entrada" },
            { id: 2, label: "Início da pausa", timestamp: "--:--", kind: "pausa" },
            { id: 3, label: "Fim da pausa", timestamp: "--:--", kind: "retorno" },
            { id: 4, label: "Saída", timestamp: "--:--", kind: "saida" },
        ],
    };
}