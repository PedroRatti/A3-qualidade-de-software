import { FaBell, FaUser } from "react-icons/fa6";
import { useNavigate } from "react-router-dom";
import { useNotifications } from "../../contexts/NotificationsContext";
import "./Header.css";

type AppHeaderProps = {
    title: string;
};

export function AppHeader({ title }: AppHeaderProps) {
    const navigate = useNavigate();
    const {
        notifications,
        unreadCount,
        panelOpen,
        togglePanel,
        closePanel,
        removeNotification,
    } = useNotifications();

    const handleNotificationClick = (
        notificationId: string,
        targetPath: string
    ) => {
        removeNotification(notificationId);
        closePanel();

        window.setTimeout(() => {
            navigate(targetPath);
        }, 0);
    };

    return (
        <header className="app-header">
            <div className="app-header__brand">
                <span className="app-header__project-name">EquipeHub</span>
            </div>

            <div className="app-header__title-wrap">
                <h1 className="app-header__title">{title}</h1>
            </div>

            <div className="app-header__actions">
                <div className="app-header__notifications">
                    <button
                        type="button"
                        className="app-header__icon-button"
                        aria-label="Notificações"
                        aria-expanded={panelOpen}
                        aria-haspopup="dialog"
                        onClick={togglePanel}
                    >
                        <FaBell size={18} color="#ffffff" />

                        {unreadCount > 0 ? (
                            <span className="app-header__notification-badge">
                                {unreadCount > 9 ? "9+" : unreadCount}
                            </span>
                        ) : null}
                    </button>

                    {panelOpen ? (
                        <section
                            className="app-header__notifications-panel"
                            aria-label="Painel de notificações"
                        >
                            <header className="app-header__notifications-header">
                                <strong>Notificações</strong>
                            </header>

                            {notifications.length === 0 ? (
                                <p className="app-header__notifications-empty">
                                    Nenhuma notificação no momento.
                                </p>
                            ) : (
                                <div className="app-header__notifications-list">
                                    {notifications.map((notification) => (
                                        <button
                                            key={notification.id}
                                            type="button"
                                            className={
                                                notification.read
                                                    ? "app-header__notification-item"
                                                    : "app-header__notification-item app-header__notification-item--unread"
                                            }
                                            onClick={() =>
                                                handleNotificationClick(
                                                    notification.id,
                                                    notification.targetPath
                                                )
                                            }
                                        >
                                            <p>{notification.message}</p>
                                            <span>{notification.createdAtLabel}</span>
                                        </button>
                                    ))}
                                </div>
                            )}
                        </section>
                    ) : null}
                </div>

                <button
                    type="button"
                    className="app-header__icon-button"
                    aria-label="Usuário"
                >
                    <FaUser size={18} color="#ffffff" />
                </button>
            </div>
        </header>
    );
}