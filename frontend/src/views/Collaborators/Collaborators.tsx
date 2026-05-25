import { PageTemplate } from "../../components/PageTemplate/PageTemplate";
import { useCollaborators } from "../../hooks/useCollaborators";
import type { Collaborator } from "../../types/collaborator.types";
import "./Collaborators.css";

function formatBirthDate(value: string) {
    const parsedDate = new Date(value);

    if (Number.isNaN(parsedDate.getTime())) {
        return value.includes("T") ? value.split("T")[0] : value;
    }

    return new Intl.DateTimeFormat("pt-BR", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
    }).format(parsedDate);
}

function formatRole(role: string) {
    return role === "admin" ? "Administrador" : "Colaborador";
}

function formatStatus(isActive: boolean) {
    return isActive ? "Ativo" : "Inativo";
}

export function Collaborators() {
    const {
        collaborators,
        loading,
        error,
        loadCollaborators,
    } = useCollaborators();

    return (
        <PageTemplate title="Colaboradores">
            <section className="collaborators-view">
                <section className="collaborators-hero">
                    <div>
                        <p className="collaborators-hero__eyebrow">Diretório da equipe</p>
                        <h2>Colaboradores</h2>
                        <p>
                            Consulte os dados pessoais dos usuários cadastrados na empresa.
                        </p>
                    </div>
                </section>

                {error ? (
                    <section className="collaborators-feedback collaborators-feedback--error">
                        <div>
                            <strong>Falha ao carregar colaboradores.</strong>
                            <p>{error}</p>
                        </div>

                        <button
                            type="button"
                            className="collaborators-feedback__button"
                            onClick={() => void loadCollaborators()}
                        >
                            Tentar novamente
                        </button>
                    </section>
                ) : null}

                <section className="collaborators-panel">
                    <div className="collaborators-panel__header">
                        <div>
                            <h3>Equipe cadastrada</h3>
                            <p>
                                Visualize nome, contato, documento, data de nascimento,
                                perfil e status.
                            </p>
                        </div>
                    </div>

                    {loading ? (
                        <p className="collaborators-empty">Carregando colaboradores...</p>
                    ) : collaborators.length === 0 ? (
                        <p className="collaborators-empty">Nenhum colaborador encontrado.</p>
                    ) : (
                        <div className="collaborators-grid">
                            {collaborators.map((collaborator: Collaborator) => (
                                <article key={collaborator.id} className="collaborators-card">
                                    <header className="collaborators-card__header">
                                        <div>
                                            <strong>{collaborator.name}</strong>
                                            <span>{collaborator.email}</span>
                                        </div>

                                        <div className="collaborators-card__badges">
                                            <span
                                                className={
                                                    collaborator.is_active
                                                        ? "collaborators-badge collaborators-badge--active"
                                                        : "collaborators-badge collaborators-badge--inactive"
                                                }
                                            >
                                                {formatStatus(collaborator.is_active)}
                                            </span>

                                            <span className="collaborators-badge collaborators-badge--role">
                                                {formatRole(collaborator.role)}
                                            </span>
                                        </div>
                                    </header>

                                    <div className="collaborators-card__details">
                                        <div className="collaborators-card__detail">
                                            <span>CPF</span>
                                            <strong>{collaborator.cpf}</strong>
                                        </div>

                                        <div className="collaborators-card__detail">
                                            <span>Telefone</span>
                                            <strong>{collaborator.number || "Nao informado"}</strong>
                                        </div>

                                        <div className="collaborators-card__detail">
                                            <span>Nascimento</span>
                                            <strong>{formatBirthDate(collaborator.birth)}</strong>
                                        </div>

                                        <div className="collaborators-card__detail">
                                            <span>ID</span>
                                            <strong>#{collaborator.id}</strong>
                                        </div>
                                    </div>
                                </article>
                            ))}
                        </div>
                    )}
                </section>
            </section>
        </PageTemplate>
    );
}