import { useEffect, useState } from "react";
import { apiRequest } from "./apiClient";
import type { Collaborator } from "../types/collaborator.types";

function toErrorMessage(error: unknown, fallback: string) {
    if (error instanceof TypeError) {
        return "Nao foi possivel conectar ao servidor.";
    }

    if (error instanceof Error) {
        return error.message;
    }

    return fallback;
}

export function useCollaborators() {
    const [collaborators, setCollaborators] = useState<Collaborator[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const loadCollaborators = async () => {
        try {
            setLoading(true);
            setError("");

            const response = await apiRequest<Collaborator[]>("/colaboradores", {
                method: "GET",
                auth: true,
            });

            setCollaborators(response);
        } catch (requestError) {
            setError(toErrorMessage(requestError, "Erro ao carregar colaboradores."));
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        void loadCollaborators();
    }, []);

    return {
        collaborators,
        loading,
        error,
        loadCollaborators,
    };
}