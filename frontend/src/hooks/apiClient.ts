import { getToken, redirectToLogin } from "../utils/auth";

type ApiRequestOptions = Omit<RequestInit, "headers" | "body"> & {
    auth?: boolean;
    body?: unknown;
    headers?: HeadersInit;
};

type ApiErrorResponse = {
    message?: string;
};

const API_BASE_URL = import.meta.env.VITE_API_URL;

function isFormDataBody(body: unknown): body is FormData {
    return body instanceof FormData;
}

function buildHeaders(options: ApiRequestOptions): HeadersInit {
    const headers = new Headers(options.headers);

    if (
        options.body !== undefined &&
        !isFormDataBody(options.body) &&
        !headers.has("Content-Type")
    ) {
        headers.set("Content-Type", "application/json");
    }

    if (options.auth) {
        const token = getToken();

        if (!token) {
            redirectToLogin();
            throw new Error("Sessão expirada. Faça login novamente.");
        }

        headers.set("Authorization", `Bearer ${token}`);
    }

    return headers;
}

export async function apiRequest<T>(path: string, options: ApiRequestOptions = {}) {
    const response = await fetch(`${API_BASE_URL}${path}`, {
        ...options,
        headers: buildHeaders(options),
        body:
            options.body === undefined
                ? undefined
                : isFormDataBody(options.body)
                    ? options.body
                    : JSON.stringify(options.body),
    });

    const contentType = response.headers.get("content-type") ?? "";
    const isJson = contentType.includes("application/json");
    const data = isJson ? ((await response.json()) as T | ApiErrorResponse) : null;

    if (options.auth && response.status === 401) {
        redirectToLogin();
        throw new Error("Sessão expirada. Faça login novamente.");
    }

    if (!response.ok) {
        const message =
            data && typeof data === "object" && "message" in data && typeof data.message === "string"
                ? data.message
                : "Erro na requisição.";

        throw new Error(message);
    }

    return data as T;
}