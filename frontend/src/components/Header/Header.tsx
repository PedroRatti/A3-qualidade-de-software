import { FaBell, FaUser } from "react-icons/fa6";
import "./AppHeader.css";

type AppHeaderProps = {
    title: string;
};

export function AppHeader({ title }: AppHeaderProps) {
    return (
        <header className="app-header">
            <div className="app-header__brand">
                <span className="app-header__project-name">EquipeHub</span>
            </div>

            <div className="app-header__title-wrap">
                <h1 className="app-header__title">{title}</h1>
            </div>

            <div className="app-header__actions">
                <button
                    type="button"
                    className="app-header__icon-button"
                    aria-label="Notificacoes"
                >
                    <FaBell size={18} color="#ffffff" />
                </button>

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
