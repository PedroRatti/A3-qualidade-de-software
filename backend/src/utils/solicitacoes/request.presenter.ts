import type { RequestRecord, RequestStatus, RequestType } from "../../useCases/solicitacoes/contracts/request.types";

export type RequestHistoryItem = {
    id: number;
    type: RequestType;
    typeLabel: string;
    startDate: string;
    endDate: string;
    periodLabel: string;
    reason: string;
    supervisorId: number;
    supervisorName: string;
    attachmentUrl: string | null;
    status: RequestStatus;
    statusLabel: string;
    createdAtLabel: string;
};

const typeLabels: Record<RequestType, string> = {
    ferias: "Ferias",
    abono_falta: "Abono de falta",
    outro: "Outro",
};

const statusLabels: Record<RequestStatus, string> = {
    pendente: "Pendente",
    aprovada: "Aprovada",
    rejeitada: "Rejeitada",
};

export function parseRequestType(value: string): RequestType | null {
    if (value === "ferias" || value === "abono_falta" || value === "outro") {
        return value;
    }

    return null;
}

function normalizeDateInput(value: string | Date) {
    if (value instanceof Date) {
        return value;
    }

    if (/^\d{4}-\d{2}-\d{2}$/.test(value)) {
        return new Date(`${value}T00:00:00`);
    }

    return new Date(value);
}

function toIsoDate(value: string | Date) {
    const parsedDate = normalizeDateInput(value);

    if (Number.isNaN(parsedDate.getTime())) {
        throw new Error(`Data inválida recebida no presenter: ${String(value)}`);
    }

    const year = parsedDate.getFullYear();
    const month = String(parsedDate.getMonth() + 1).padStart(2, "0");
    const day = String(parsedDate.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
}

function formatDate(date: string | Date) {
    const parsedDate = normalizeDateInput(date);

    if (Number.isNaN(parsedDate.getTime())) {
        throw new Error(`Data inválida recebida no presenter: ${String(date)}`);
    }

    return new Intl.DateTimeFormat("pt-BR", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
    }).format(parsedDate);
}

function formatDateTime(date: Date) {
    return new Intl.DateTimeFormat("pt-BR", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
    }).format(date);
}

export function formatRequest(record: RequestRecord): RequestHistoryItem {
    const normalizedStartDate = toIsoDate(record.start_date);
    const normalizedEndDate = toIsoDate(record.end_date);
    const sameDay = normalizedStartDate === normalizedEndDate;

    return {
        id: record.id,
        type: record.type,
        typeLabel: typeLabels[record.type],
        startDate: normalizedStartDate,
        endDate: normalizedEndDate,
        periodLabel: sameDay
            ? formatDate(record.start_date)
            : `${formatDate(record.start_date)} ate ${formatDate(record.end_date)}`,
        reason: record.reason,
        supervisorId: record.supervisor_id,
        supervisorName: record.supervisor_name,
        attachmentUrl: record.attachment_url,
        status: record.status,
        statusLabel: statusLabels[record.status],
        createdAtLabel: formatDateTime(record.created_at),
    };
}