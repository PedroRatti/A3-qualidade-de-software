import { FaArrowRightFromBracket, FaClock, FaFileLines } from "react-icons/fa6";
import "./AppSidebar.css";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";

export function AppSidebar() {
    const navigate = useNavigate();
    const { logout } = useAuth();

    const handleLogout = () => {
        logout();
        navigate("/");
    };

    return (
        <aside className="app-sidebar" aria-label="Navegacao lateral">
            <nav className="app-sidebar__nav">
                <button
                    type="button"
                    className="app-sidebar__item"
                    onClick={() => navigate("/overview")}
                >
                    <FaClock size={18} color="#ffffff" />
                    <span className="app-sidebar__label">Ponto</span>
                </button>

                <button
                    type="button"
                    className="app-sidebar__item"
                    onClick={() => navigate("/requests")}
                >
                    <FaFileLines size={18} color="#ffffff" />
                    <span className="app-sidebar__label">Solicitacoes</span>
                </button>

                <button
                    type="button"
                    className="app-sidebar__item app-sidebar__item--logout"
                    onClick={handleLogout}
                >
                    <FaArrowRightFromBracket size={18} color="#ffffff" />
                    <span className="app-sidebar__label">Logout</span>
                </button>
            </nav>
        </aside>
    );
}