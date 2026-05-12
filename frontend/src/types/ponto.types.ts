export type PointStatus =
    | "aguardando-entrada"
    | "em-jornada"
    | "em-pausa"
    | "jornada-encerrada";

export type PointActionKey =
    | "clock-in"
    | "start-break"
    | "end-break"
    | "clock-out";

export type PointRecordKind = "entrada" | "pausa" | "retorno" | "saida";

export type PointRecord = {
    id: number;
    label: string;
    timestamp: string;
    kind: PointRecordKind;
};

export type PointSummary = {
    employeeName: string;
    status: PointStatus;
    shiftLabel: string;
    workedTime: string;
    currentDay: string;
    currentTime: string;
    availableActions: PointActionKey[];
    records: PointRecord[];
};

export type PointActionDefinition = {
    key: PointActionKey;
    label: string;
    tone: "primary" | "neutral";
};