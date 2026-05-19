import { FaBell, FaUser } from "react-icons/fa6";
import "./Header.css";

type AppHeaderProps = {
    title: string;
};

export function AppHeader({ title }: AppHeaderProps) {
    return (
        <header className="app-header">
            <div className="app-headerbrand">
                <span className="app-headerproject-name">EquipeHub</span>
            </div>

            <div className="app-headertitle-wrap">
                <h1 className="app-headertitle">{title}</h1>
            </div>

            <div className="app-headeractions">
                <button
                    type="button"
                    className="app-headericon-button"
                    aria-label="Notificações"
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