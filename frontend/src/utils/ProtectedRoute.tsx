import { Navigate } from "react-router-dom";
import type { ReactNode } from "react";
import { hasValidSession, isAdmin } from "./auth";

type ProtectedRouteProps = {
    children: ReactNode;
    requireAdmin?: boolean;
};

export function ProtectedRoute({ children, requireAdmin = false }: ProtectedRouteProps) {
    if (!hasValidSession()) {
        return <Navigate to="/" replace />;
    }

    if (requireAdmin && !isAdmin()) {
        return <Navigate to="/overview" replace />;
    }

    return <>{children}</>;
}