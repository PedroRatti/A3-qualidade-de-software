import { useState } from "react";

type LoginPayload = {
    email: string;
    password: string;
};

type LoginResponse = {
    message: string;
    token: string;
    user: {
        id: number;
        name: string;
        email: string;
        cpf: string;
        number: string | null;
        birth: string;
        role: string;
        is_active: boolean;
    };
};

export function useAuth() {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const API_BASE_URL = import.meta.env.VITE_API_URL;

    const login = async ({ email, password }: LoginPayload) => {
        try {
            setLoading(true);
            setError("");

            const response = await fetch(`${API_BASE_URL}/auth/login`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    email,
                    password,
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || "Erro ao fazer login.");
            }

            localStorage.setItem("token", data.token);
            localStorage.setItem("user", JSON.stringify(data.user));
            return data as LoginResponse;
        } catch (requestError) {
            const message =
                requestError instanceof TypeError
                    ? "Nao foi possivel conectar ao servidor"
                    : requestError instanceof Error
                        ? requestError.message
                        : "Erro ao autenticar usuario";

            setError(message);
            throw requestError;
        } finally {
            setLoading(false);
        }
    };

    const logout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
    };

    return {
        login,
        logout,
        loading,
        error,
    };
}