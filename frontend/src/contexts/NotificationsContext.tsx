import {
    createContext,
    useContext,
    useEffect,
    useMemo,
    useRef,
    useState,
    type ReactNode,
} from "react";
import { useLocation } from "react-router-dom";
import { apiRequest } from "../hooks/apiClient";
import type {
    RequestHistoryItem,
    SupervisorRequestItem,
} from "../types/request.types";
import { getCurrentUser, getToken } from "../utils/auth";

type NotificationItem = {
    id: string;
    message: string;
    createdAtLabel: string;
    read: boolean;
    targetPath: string;
};

type NotificationsContextValue = {
    notifications: NotificationItem[];
    unreadCount: number;
    panelOpen: boolean;
    togglePanel: () => void;
    closePanel: () => void;
    removeNotification: (notificationId: string) => void;
};

const POLLING_INTERVAL_MS = 20000;
const MAX_NOTIFICATIONS = 20;

const NotificationsContext = createContext<NotificationsContextValue | null>(null);

function formatNotificationTime(date: Date) {
    return new Intl.DateTimeFormat("pt-BR", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
    }).format(date);
}

function toHistoryMap(items: RequestHistoryItem[]) {
    return new Map(items.map((item) => [item.id, item]));
}

function toAssignedMap(items: SupervisorRequestItem[]) {
    return new Map(items.map((item) => [item.id, item]));
}

function buildAdminNotifications(
    previousMap: Map<number, SupervisorRequestItem>,
    nextItems: SupervisorRequestItem[]
) {
    const notifications: NotificationItem[] = [];

    for (const item of nextItems) {
        if (!previousMap.has(item.id) && item.status === "pendente") {
            notifications.push({
                id: `assigned-${item.id}-${Date.now()}`,
                message: `${item.requesterName} abriu uma nova solicitação`,
                createdAtLabel: formatNotificationTime(new Date()),
                read: false,
                targetPath: "/requests?tab=gerenciar",
            });
        }
    }

    return notifications;
}

function buildEmployeeNotifications(
    previousMap: Map<number, RequestHistoryItem>,
    nextItems: RequestHistoryItem[]
) {
    const notifications: NotificationItem[] = [];

    for (const item of nextItems) {
        const previous = previousMap.get(item.id);

        if (
            previous &&
            previous.status === "pendente" &&
            item.status !== "pendente"
        ) {
            notifications.push({
                id: `history-${item.id}-${item.status}-${Date.now()}`,
                message: `O revisor ${item.supervisorName} respondeu à sua solicitação`,
                createdAtLabel: formatNotificationTime(new Date()),
                read: false,
                targetPath: "/requests?tab=historico",
            });
        }
    }

    return notifications;
}

export function NotificationsProvider({ children }: { children: ReactNode }) {
    const location = useLocation();
    const currentUser = getCurrentUser();
    const token = getToken();
    const authKey = currentUser
        ? `${currentUser.id}:${currentUser.role}:${currentUser.name}`
        : "guest";

    const [notifications, setNotifications] = useState<NotificationItem[]>([]);
    const [panelOpen, setPanelOpen] = useState(false);

    const historySnapshotRef = useRef<Map<number, RequestHistoryItem>>(new Map());
    const assignedSnapshotRef = useRef<Map<number, SupervisorRequestItem>>(new Map());
    const pollingRef = useRef(false);

    const isAuthenticatedRoute = location.pathname !== "/";
    const shouldPoll = Boolean(token && currentUser && isAuthenticatedRoute);

    useEffect(() => {
        setNotifications([]);
        setPanelOpen(false);
        historySnapshotRef.current = new Map();
        assignedSnapshotRef.current = new Map();
    }, [authKey]);

    useEffect(() => {
        if (!shouldPoll || !currentUser) {
            return;
        }

        let cancelled = false;
        let intervalId: number | undefined;

        const syncBaseline = async () => {
            try {
                if (currentUser.role === "admin") {
                    const response = await apiRequest<SupervisorRequestItem[]>(
                        "/solicitacoes/assigned",
                        {
                            method: "GET",
                            auth: true,
                        }
                    );

                    if (cancelled) {
                        return;
                    }

                    assignedSnapshotRef.current = toAssignedMap(response);
                    historySnapshotRef.current = new Map();
                } else {
                    const response = await apiRequest<RequestHistoryItem[]>(
                        "/solicitacoes/history",
                        {
                            method: "GET",
                            auth: true,
                        }
                    );

                    if (cancelled) {
                        return;
                    }

                    historySnapshotRef.current = toHistoryMap(response);
                    assignedSnapshotRef.current = new Map();
                }
            } catch {
                return;
            }

            intervalId = window.setInterval(async () => {
                if (document.hidden || pollingRef.current || cancelled) {
                    return;
                }

                pollingRef.current = true;

                try {
                    if (currentUser.role === "admin") {
                        const response = await apiRequest<SupervisorRequestItem[]>(
                            "/solicitacoes/assigned",
                            {
                                method: "GET",
                                auth: true,
                            }
                        );

                        if (cancelled) {
                            return;
                        }

                        const nextNotifications = buildAdminNotifications(
                            assignedSnapshotRef.current,
                            response
                        );

                        assignedSnapshotRef.current = toAssignedMap(response);

                        if (nextNotifications.length > 0) {
                            setNotifications((current) =>
                                [...nextNotifications, ...current].slice(0, MAX_NOTIFICATIONS)
                            );
                        }
                    } else {
                        const response = await apiRequest<RequestHistoryItem[]>(
                            "/solicitacoes/history",
                            {
                                method: "GET",
                                auth: true,
                            }
                        );

                        if (cancelled) {
                            return;
                        }

                        const nextNotifications = buildEmployeeNotifications(
                            historySnapshotRef.current,
                            response
                        );

                        historySnapshotRef.current = toHistoryMap(response);

                        if (nextNotifications.length > 0) {
                            setNotifications((current) =>
                                [...nextNotifications, ...current].slice(0, MAX_NOTIFICATIONS)
                            );
                        }
                    }
                } catch {
                    return;
                } finally {
                    pollingRef.current = false;
                }
            }, POLLING_INTERVAL_MS);
        };

        void syncBaseline();

        return () => {
            cancelled = true;

            if (intervalId !== undefined) {
                window.clearInterval(intervalId);
            }
        };
    }, [authKey, shouldPoll]);

    const unreadCount = useMemo(
        () => notifications.filter((item) => !item.read).length,
        [notifications]
    );

    const closePanel = () => {
        setPanelOpen(false);
    };

    const removeNotification = (notificationId: string) => {
        setNotifications((current) =>
            current.filter((item) => item.id !== notificationId)
        );
    };

    const togglePanel = () => {
        setPanelOpen((current) => {
            const next = !current;

            if (next) {
                setNotifications((items) =>
                    items.map((item) => ({
                        ...item,
                        read: true,
                    }))
                );
            }

            return next;
        });
    };

    const value = useMemo(
        () => ({
            notifications,
            unreadCount,
            panelOpen,
            togglePanel,
            closePanel,
            removeNotification,
        }),
        [notifications, unreadCount, panelOpen]
    );

    return (
        <NotificationsContext.Provider value={value}>
            {children}
        </NotificationsContext.Provider>
    );
}

export function useNotifications() {
    const context = useContext(NotificationsContext);

    if (!context) {
        throw new Error("useNotifications deve ser usado dentro de NotificationsProvider.");
    }

    return context;
}