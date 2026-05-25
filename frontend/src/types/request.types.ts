export type RequestType = "ferias" | "abono_falta" | "outro";
export type RequestStatus = "pendente" | "aprovada" | "rejeitada";
export type RequestReviewStatusInput = "aprovado" | "rejeitado";

export type SupervisorOption = {
    id: number;
    name: string;
    email: string;
};

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

export type SupervisorRequestItem = RequestHistoryItem & {
    requesterId: number;
    requesterName: string;
    requesterEmail: string;
    updatedAtLabel: string;
};

export type CreateRequestPayload = {
    supervisorId: string;
    type: RequestType;
    startDate: string;
    endDate: string;
    reason: string;
    attachment: File | null;
};