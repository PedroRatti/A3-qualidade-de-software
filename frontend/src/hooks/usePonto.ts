import { useEffect, useState } from "react";
import type {
    PointActionKey,
    PointHistoryDay,
    PointSummary,
    TeamPointHistoryEmployee,
} from "../types/ponto.types";
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
    const [summaryError, setSummaryError] = useState("");
    const [history, setHistory] = useState<PointHistoryDay[]>([]);
    const [historyLoading, setHistoryLoading] = useState(false);
    const [historyError, setHistoryError] = useState("");
    const [teamHistory, setTeamHistory] = useState<TeamPointHistoryEmployee[]>([]);
    const [teamHistoryLoading, setTeamHistoryLoading] = useState(false);
    const [teamHistoryError, setTeamHistoryError] = useState("");

    const refreshSummary = async () => {
        try {
            setLoading(true);
            setSummaryError("");

            const nextSummary = await apiRequest<PointSummary>("/ponto/today", {
                method: "GET",
                auth: true,
            });

            setSummary(nextSummary);
        } catch (requestError) {
            setSummaryError(toErrorMessage(requestError, "Erro ao carregar os dados do ponto."));
        } finally {
            setLoading(false);
        }
    };

    const registerAction = async (action: PointActionKey) => {
        try {
            setSubmittingAction(action);
            setSummaryError("");

            const response = await apiRequest<RegisterPointResponse>("/ponto/register", {
                method: "POST",
                auth: true,
                body: { action },
            });

            setSummary(response.summary);
        } catch (requestError) {
            const message = toErrorMessage(requestError, "Erro ao registrar o ponto.");
            setSummaryError(message);
            throw requestError;
        } finally {
            setSubmittingAction(null);
        }
    };

    const loadHistory = async () => {
        try {
            setHistoryLoading(true);
            setHistoryError("");

            const nextHistory = await apiRequest<PointHistoryDay[]>("/ponto/history", {
                method: "GET",
                auth: true,
            });

            setHistory(nextHistory);
        } catch (requestError) {
            setHistoryError(toErrorMessage(requestError, "Erro ao carregar o histórico de ponto."));
        } finally {
            setHistoryLoading(false);
        }
    };

    const loadTeamHistory = async (daysBack = 30) => {
        try {
            setTeamHistoryLoading(true);
            setTeamHistoryError("");

            const nextTeamHistory = await apiRequest<TeamPointHistoryEmployee[]>(
                `/ponto/team/history?daysBack=${daysBack}`,
                {
                    method: "GET",
                    auth: true,
                }
            );

            setTeamHistory(nextTeamHistory);
        } catch (requestError) {
            setTeamHistoryError(
                toErrorMessage(requestError, "Erro ao carregar o histórico da equipe.")
            );
        } finally {
            setTeamHistoryLoading(false);
        }
    };

    useEffect(() => {
        void refreshSummary();
    }, []);

    return {
        summary,
        loading,
        submittingAction,
        summaryError,
        refreshSummary,
        registerAction,
        history,
        historyLoading,
        historyError,
        loadHistory,
        teamHistory,
        teamHistoryLoading,
        teamHistoryError,
        loadTeamHistory,
    };
}