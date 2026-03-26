import { useNavigate } from "react-router-dom";
import "./LoginForm.css";

export function LoginForm() {
    const navigate = useNavigate();

    return (
        <form
            className="login-form"
            onSubmit={(event) => {
                event.preventDefault();
                navigate("/overview");
            }}
        >
            <div className="login-form__eyebrow">Acesso ao sistema</div>

            <div className="login-form__content">
                <h1>Entrar na plataforma</h1>
            </div>

            <label className="login-form__field">
                <span>CPF</span>
                <input type="text" name="cpf" placeholder="Seu CPF" />
            </label>

            <label className="login-form__field">
                <span>Senha</span>
                <input type="password" name="password" placeholder="Digite sua senha" />
            </label>

            <button type="submit" className="login-form__submit">
                Entrar
            </button>
        </form>
    );
}