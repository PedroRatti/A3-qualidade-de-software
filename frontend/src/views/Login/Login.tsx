import { Navigate } from "react-router-dom";
import { LoginForm } from "../../components/LoginForm/LoginForm.tsx";
import { ProjectLogo } from "../../components/ProjectLogo/ProjectLogo.tsx";
import "./Login.css";

const metrics = [
    { value: "24/7", label: "Monitoramento" },
    { value: "100%", label: "Visibilidade" },
    { value: "+1", label: "Plataforma única" },
];

export function Login() {
    const token = localStorage.getItem("token");

    if (token) {
        return <Navigate to="/overview" replace />;
    }

    return (
        <main className="login-view">
            <section className="login-view__brand-panel">
                <div className="login-view__brand-content">
                    <div className="login-view__logo-wrap">
                        <ProjectLogo />
                    </div>

                    <h2>Ambiente central para governança, rastreabilidade e colaboração.</h2>

                    <p className="login-view__description">
                        Uma entrada clara para o time iniciar o dia com contexto,
                        foco e visão do que importa.
                    </p>

                    <div className="login-view__metrics">
                        {metrics.map((metric) => (
                            <article key={metric.value} className="login-view__metric-card">
                                <strong>{metric.value}</strong>
                                <span>{metric.label}</span>
                            </article>
                        ))}
                    </div>
                </div>
            </section>

            <section className="login-view__form-panel">
                <div className="login-view__form-wrapper">
                    <LoginForm />
                </div>
            </section>
        </main>
    );
}