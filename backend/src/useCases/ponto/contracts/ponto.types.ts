export type PointActionKey =
    | "clock-in"
    | "start-break"
    | "end-break"
    | "clock-out";

export type TimeEntryAction =
    | "entrada"
    | "saida_almoco"
    | "entrada_almoco"
    | "saida";

export type PointStatus =
    | "aguardando-entrada"
    | "em-jornada"
    | "em-pausa"
    | "jornada-encerrada";

export type PointRecordKind = "entrada" | "pausa" | "retorno" | "saida";

export type TimeEntryRecord = {
    id: number;
    user_id: number;
    action: TimeEntryAction;
    created_at: Date;
};

export type PointSummary = {
    employeeName: string;
    status: PointStatus;
    shiftLabel: string;
    workedTime: string;
    currentDay: string;
    currentTime: string;
    availableActions: PointActionKey[];
    records: Array<{
        id: number;
        label: string;
        timestamp: string;
        kind: PointRecordKind;
    }>;
};