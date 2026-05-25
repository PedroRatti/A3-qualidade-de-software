import {
    FaArrowRightFromBracket,
    FaClock,
    FaFileLines,
    FaUsers,
} from "react-icons/fa6";
import "./Navbar.css";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { isAdmin } from "../../utils/auth";

export function AppSidebar() {
    const navigate = useNavigate();
    const { logout } = useAuth();
    const admin = isAdmin();

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
                    <span className="app-sidebar__label">Solicitações</span>
                </button>

                {admin ? (
                    <button
                        type="button"
                        className="app-sidebar__item"
                        onClick={() => navigate("/collaborators")}
                    >
                        <FaUsers size={18} color="#ffffff" />
                        <span className="app-sidebar__label">Colaboradores</span>
                    </button>
                ) : null}

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