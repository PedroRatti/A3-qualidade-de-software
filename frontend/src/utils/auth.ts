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

type JwtPayload = {
    exp?: number;
};

function decodeTokenPayload(token: string): JwtPayload | null {
    const [, payload] = token.split(".");

    if (!payload) {
        return null;
    }

    try {
        const normalizedPayload = payload.replace(/-/g, "+").replace(/_/g, "/");
        const paddedPayload = normalizedPayload.padEnd(
            normalizedPayload.length + ((4 - (normalizedPayload.length % 4)) % 4),
            "="
        );

        return JSON.parse(atob(paddedPayload)) as JwtPayload;
    } catch {
        return null;
    }
}

export function clearSession() {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
}

export function isTokenExpired(token: string) {
    const payload = decodeTokenPayload(token);

    if (!payload || typeof payload.exp !== "number") {
        return true;
    }

    return payload.exp * 1000 <= Date.now();
}

export function getToken() {
    const token = localStorage.getItem("token");

    if (!token) {
        return null;
    }

    if (isTokenExpired(token)) {
        clearSession();
        return null;
    }

    return token;
}

export function hasValidSession() {
    return Boolean(getToken());
}

export function redirectToLogin() {
    clearSession();
    window.location.replace("/");
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