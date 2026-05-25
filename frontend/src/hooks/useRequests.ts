import { useState } from "react";
import { apiRequest } from "./apiClient";
import type {
    CreateRequestPayload,
    RequestHistoryItem,
    RequestReviewStatusInput,
    SupervisorOption,
    SupervisorRequestItem,
} from "../types/request.types";

type CreateRequestResponse = {
    message: string;
    request: RequestHistoryItem;
};

type ReviewRequestResponse = {
    message: string;
    request: SupervisorRequestItem;
};

function toErrorMessage(error: unknown, fallback: string) {
    if (error instanceof TypeError) {
        return "Não foi possível conectar ao servidor.";
    }

    if (error instanceof Error) {
        return error.message;
    }

    return fallback;
}

export function useRequests() {
    const [history, setHistory] = useState<RequestHistoryItem[]>([]);
    const [assignedRequests, setAssignedRequests] = useState<SupervisorRequestItem[]>([]);
    const [supervisors, setSupervisors] = useState<SupervisorOption[]>([]);
    const [loadingHistory, setLoadingHistory] = useState(false);
    const [loadingAssignedRequests, setLoadingAssignedRequests] = useState(false);
    const [loadingSupervisors, setLoadingSupervisors] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [reviewingRequestId, setReviewingRequestId] = useState<number | null>(null);
    const [historyLoaded, setHistoryLoaded] = useState(false);
    const [assignedRequestsLoaded, setAssignedRequestsLoaded] = useState(false);
    const [historyError, setHistoryError] = useState("");
    const [assignedRequestsError, setAssignedRequestsError] = useState("");
    const [submitError, setSubmitError] = useState("");

    const clearErrors = () => {
        setHistoryError("");
        setAssignedRequestsError("");
        setSubmitError("");
    };

    const loadSupervisors = async () => {
        try {
            setLoadingSupervisors(true);

            const response = await apiRequest<SupervisorOption[]>("/solicitacoes/supervisors", {
                method: "GET",
                auth: true,
            });

            setSupervisors(response);
        } catch (requestError) {
            setSubmitError(toErrorMessage(requestError, "Erro ao carregar supervisores."));
        } finally {
            setLoadingSupervisors(false);
        }
    };

    const submitRequest = async (payload: CreateRequestPayload) => {
        try {
            setSubmitting(true);
            setSubmitError("");

            const body = new FormData();
            body.append("supervisorId", payload.supervisorId);
            body.append("type", payload.type);
            body.append("startDate", payload.startDate);
            body.append("endDate", payload.endDate);
            body.append("reason", payload.reason);

            if (payload.attachment) {
                body.append("attachment", payload.attachment);
            }

            const response = await apiRequest<CreateRequestResponse>("/solicitacoes", {
                method: "POST",
                auth: true,
                body,
            });

            setHistory((current) => [response.request, ...current]);
            setHistoryLoaded(true);

            return response.request;
        } catch (requestError) {
            const message = toErrorMessage(requestError, "Erro ao enviar a solicitação.");
            setSubmitError(message);
            throw requestError;
        } finally {
            setSubmitting(false);
        }
    };

    const loadHistory = async () => {
        try {
            setLoadingHistory(true);
            setHistoryError("");

            const response = await apiRequest<RequestHistoryItem[]>("/solicitacoes/history", {
                method: "GET",
                auth: true,
            });

            setHistory(response);
            setHistoryLoaded(true);
        } catch (requestError) {
            setHistoryError(toErrorMessage(requestError, "Erro ao carregar o histórico."));
        } finally {
            setLoadingHistory(false);
        }
    };

    const loadAssignedRequests = async () => {
        try {
            setLoadingAssignedRequests(true);
            setAssignedRequestsError("");

            const response = await apiRequest<SupervisorRequestItem[]>("/solicitacoes/assigned", {
                method: "GET",
                auth: true,
            });

            setAssignedRequests(response);
            setAssignedRequestsLoaded(true);
        } catch (requestError) {
            setAssignedRequestsError(
                toErrorMessage(requestError, "Erro ao carregar solicitações do supervisor.")
            );
        } finally {
            setLoadingAssignedRequests(false);
        }
    };

    const reviewRequest = async (
        requestId: number,
        status: RequestReviewStatusInput
    ) => {
        try {
            setReviewingRequestId(requestId);
            setAssignedRequestsError("");

            const response = await apiRequest<ReviewRequestResponse>(
                `/solicitacoes/${requestId}/status`,
                {
                    method: "PATCH",
                    auth: true,
                    body: { status },
                }
            );

            setAssignedRequests((current) =>
                current.map((item) => (item.id === requestId ? response.request : item))
            );

            return response.request;
        } catch (requestError) {
            const message = toErrorMessage(
                requestError,
                "Erro ao atualizar a solicitação."
            );
            setAssignedRequestsError(message);
            throw requestError;
        } finally {
            setReviewingRequestId(null);
        }
    };

    return {
        history,
        assignedRequests,
        supervisors,
        loadingHistory,
        loadingAssignedRequests,
        loadingSupervisors,
        submitting,
        reviewingRequestId,
        historyLoaded,
        assignedRequestsLoaded,
        historyError,
        assignedRequestsError,
        submitError,
        clearErrors,
        loadSupervisors,
        submitRequest,
        loadHistory,
        loadAssignedRequests,
        reviewRequest,
    };
}