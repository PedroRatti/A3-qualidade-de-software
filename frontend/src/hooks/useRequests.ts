import { useState } from "react";
import { apiRequest } from "./apiClient";
import type {
    CreateRequestPayload,
    RequestHistoryItem,
    SupervisorOption,
} from "../types/request.types";

type CreateRequestResponse = {
    message: string;
    request: RequestHistoryItem;
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
    const [supervisors, setSupervisors] = useState<SupervisorOption[]>([]);
    const [loadingHistory, setLoadingHistory] = useState(false);
    const [loadingSupervisors, setLoadingSupervisors] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [historyError, setHistoryError] = useState("");
    const [submitError, setSubmitError] = useState("");

    const clearErrors = () => {
        setHistoryError("");
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

            return response.request;
        } catch (requestError) {
            const message = toErrorMessage(requestError, "Erro ao enviar a solicitação.");
            setSubmitError(message);
            throw requestError;
        } finally {
            setSubmitting(false);
        }
    };const loadHistory = async () => {
        try {
            setLoadingHistory(true);
            setHistoryError("");

            const response = await apiRequest<RequestHistoryItem[]>("/solicitacoes/history", {
                method: "GET",
                auth: true,
            });

            setHistory(response);
        } catch (requestError) {
            setHistoryError(toErrorMessage(requestError, "Erro ao carregar o histórico."));
        } finally {
            setLoadingHistory(false);
        }
    };

    return {
        history,
        supervisors,
        loadingHistory,
        loadingSupervisors,
        submitting,
        historyError,
        submitError,
        clearErrors,
        loadSupervisors,
        submitRequest,
        loadHistory,
    };
}