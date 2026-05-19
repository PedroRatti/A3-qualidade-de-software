import { useEffect, useState } from "react";
import type { PointActionKey, PointHistoryDay, PointSummary } from "../types/ponto.types";
import { apiRequest } from "./apiClient";

type RegisterPointResponse = {
    message: string;
    summary: PointSummary;
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

export function usePonto() {
    const [summary, setSummary] = useState<PointSummary | null>(null);
    const [loading, setLoading] = useState(true);
    const [submittingAction, setSubmittingAction] = useState<PointActionKey | null>(null);
    const [error, setError] = useState("");
    const [history, setHistory] = useState<PointHistoryDay[]>([]);
    const [historyLoading, setHistoryLoading] = useState(false);

    const refreshSummary = async () => {
        try {
            setLoading(true);
            setError("");

            const nextSummary = await apiRequest<PointSummary>("/ponto/today", {
                method: "GET",
                auth: true,
            });

            setSummary(nextSummary);
        } catch (requestError) {
            setError(toErrorMessage(requestError, "Erro ao carregar os dados do ponto."));
        } finally {
            setLoading(false);
        }
    };

    const registerAction = async (action: PointActionKey) => {
        try {
            setSubmittingAction(action);
            setError("");

            const response = await apiRequest<RegisterPointResponse>("/ponto/register", {
                method: "POST",
                auth: true,
                body: { action },
            });

            setSummary(response.summary);
        } catch (requestError) {
            const message = toErrorMessage(requestError, "Erro ao registrar o ponto.");
            setError(message);
            throw requestError;
        } finally {
            setSubmittingAction(null);
        }
    };

    const loadHistory = async () => {
        try {
            setHistoryLoading(true);
            setError("");

            const nextHistory = await apiRequest<PointHistoryDay[]>("/ponto/history", {
                method: "GET",
                auth: true,
            });

            setHistory(nextHistory);
        } catch (requestError) {
            setError(toErrorMessage(requestError, "Erro ao carregar o histórico de ponto."));
        } finally {
            setHistoryLoading(false);
        }
    };

    useEffect(() => {
        void refreshSummary();
    }, []);

    return {
        summary,
        loading,
        submittingAction,
        error,
        refreshSummary,
        registerAction,
        history,
        historyLoading,
        loadHistory,
    };
}