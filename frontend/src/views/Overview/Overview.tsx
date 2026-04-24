import { useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import "./Overview.css";

export function Overview() {
const navigate = useNavigate();
const { logout } = useAuth();

const handleLogout = () => {
logout();
navigate("/");
};

return (
<main className="overview-view">
<header className="overview-view__header">
<h1>Overview</h1>
<button
type="button"
className="overview-view__logout"
onClick={handleLogout}
>
Sair
</button>
</header>
</main>
);
}