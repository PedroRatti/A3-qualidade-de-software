import { useNavigate } from "react-router-dom";
import "./LoginForm.css";
import React, { useState } from "react";
import { useAuth } from "../../hooks/useAuth";

export function LoginForm() {
    const navigate = useNavigate();
    const { login, loading } = useAuth();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const [emailError, setEmailError] = useState("");
    const [passwordError, setPasswordError] = useState("");

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        setEmailError("");
        setPasswordError("");

        let hasError = false;

        if (!email.trim()) {
            setEmailError("Email é um campo obrigatório.");
            hasError = true;
        }

        if (!password.trim()) {
            setPasswordError("Senha é um campo obrigatório.");
            hasError = true;
        }

        if (hasError) {
            return;
        }

        try {
            await login({ email, password });
            navigate("/overview");
        } catch { }
    };


    return (
        <form
            className="login-form"
            onSubmit={handleSubmit}
        >
            <div className="login-form__eyebrow">Acesso ao sistema</div>

            <div className="login-form__content">
                <h1>Entrar na plataforma</h1>
            </div>

            <label className="login-form__field">
                <span>Email</span>
                <input
                    className={emailError ? "login-form_input login-forminput--error" : "login-form_input"}
                    type="email"
                    name="email"
                    placeholder="Seu Email"
                    value={email}
                    onChange={(e) => {
                        setEmail(e.target.value);
                        setEmailError("");
                    }}
                />
                {emailError && <p className="login-form__field-error">{emailError}</p>}
            </label>

            <label className="login-form__field">
                <span>Senha</span>
                <input
                    className={passwordError ? "login-form_input login-forminput--error" : "login-form_input"}
                    type="password"
                    name="password"
                    placeholder="Digite sua senha"
                    value={password}
                    onChange={(e) => {
                        setPassword(e.target.value);
                        setPasswordError("");
                    }}
                />
                {passwordError && <p className="login-form__field-error">{passwordError}</p>}
            </label>

            <button type="submit" className="login-form__submit" disabled={loading}>
                {loading ? "Entrando..." : "Entrar"}
            </button>
        </form>
    );
}