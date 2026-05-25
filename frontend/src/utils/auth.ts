type AuthUser = {
    id: number;
    name: string;
    email: string;
    cpf: string;
    number: string | null;
    birth: string;
    role: string;
    is_active: boolean;
};

export function getToken() {
    return localStorage.getItem("token");
}

export function getCurrentUser(): AuthUser | null {
    const rawUser = localStorage.getItem("user");

    if (!rawUser) {
        return null;
    }

    try {
        return JSON.parse(rawUser) as AuthUser;
    } catch {
        return null;
    }
}

export function isAdmin() {
    return getCurrentUser()?.role === "admin";
}

export function getAuthHeaders(): HeadersInit {
    const token = getToken();

    const headers: HeadersInit = {
        "Content-Type": "application/json",
    };

    if (token) {
        return {
            ...headers,
            Authorization: `Bearer ${token}`,
        };
    }

    return headers;
}