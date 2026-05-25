export type RequestType = "ferias" | "abono_falta" | "outro";
export type RequestStatus = "pendente" | "aprovada" | "rejeitada";
export type ReviewRequestStatus = "aprovada" | "rejeitada";

export type RequestRecord = {
    id: number;
    user_id: number;
    supervisor_id: number;
    supervisor_name: string;
    type: RequestType;
    start_date: string | Date;
    end_date: string | Date;
    reason: string;
    attachment_url: string | null;
    status: RequestStatus;
    created_at: Date;
    updated_at: Date;
};

export type SupervisorRequestRecord = RequestRecord & {
    requester_name: string;
    requester_email: string;
};