import { Navigate } from "react-router-dom";
import { LoginForm } from "../../components/LoginForm/LoginForm.tsx";
import { ProjectLogo } from "../../components/ProjectLogo/ProjectLogo.tsx";
import "./Login.css";

const metrics = [
    { value: "24/7", label: "Monitoramento" },
    { value: "100%", label: "Visibilidade" },
];

export function Login() {
    const token = localStorage.getItem("token");
    if (token) {
        return <Navigate to="/overview" replace />;
    }

    return (
        <main className="login-view">
            <section className="login-viewbrand-panel">
                <div className="login-viewbrand-content">

                    <div className="login-viewlogo-wrap">
                        <ProjectLogo />
                    </div>

                    <h2>Ambiente central para governança, rastreabilidade e colaboração.</h2>

                    <p className="login-viewdescription">
                        Uma entrada clara para o time iniciar o dia com contexto e foco.
                    </p>

                    <div className="login-viewmetrics">
                        {metrics.map((metric) => (
                            <article key={metric.value} className="login-viewmetric-card">
                                <strong>{metric.value}</strong>
                                <span>{metric.label}</span>
                            </article>
                        ))}
                    </div>
                </div>
            </section>

            <section className="login-viewform-panel">
                <div className="login-viewform-wrapper">
                    <LoginForm />
                </div>
            </section>
        </main>
    );
}