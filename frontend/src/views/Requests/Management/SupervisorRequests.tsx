import type {
    RequestReviewStatusInput,
    SupervisorRequestItem,
} from "../../../types/request.types";

type SupervisorRequestsProps = {
    requests: SupervisorRequestItem[];
    loading: boolean;
    error: string;
    reviewingRequestId: number | null;
    getAttachmentHref: (path: string) => string;
    onReview: (
        requestId: number,
        status: RequestReviewStatusInput
    ) => void | Promise<void>;
};

export function SupervisorRequests({
    requests,
    loading,
    error,
    reviewingRequestId,
    getAttachmentHref,
    onReview,
}: SupervisorRequestsProps) {
    return (
        <section className="requests-panel">
            <div className="requests-panel__header">
                <div>
                    <h3>Gerenciar Solicitações</h3>
                    <p>
                        Revise as solicitações em que você é o supervisor responsável.
                    </p>
                </div>
            </div>

            {error ? (
                <section className="requests-feedback requests-feedback--error">
                    <strong>Ocorreu um erro ao carregar ou atualizar as solicitações.</strong>
                    <p>{error}</p>
                </section>
            ) : null}

            {loading ? (
                <p className="requests-empty">Carregando solicitações...</p>
            ) : requests.length === 0 && !error ? (
                <p className="requests-empty">Nenhuma solicitação atribuída ao seu usuário.</p>
            ) : (
                <div className="requests-manage">
                    {requests.map((item) => {
                        const isPending = item.status === "pendente";
                        const isReviewing = reviewingRequestId === item.id;

                        return (
                            <article key={item.id} className="requests-manage__item">
                                <header className="requests-manage__item-header">
                                    <div className="requests-manage__identity">
                                        <strong>{item.requesterName}</strong>
                                        <span>{item.requesterEmail}</span>
                                    </div>

                                    <span className={`requests-status requests-status--${item.status}`}>
                                        {item.statusLabel}
                                    </span>
                                </header>

                                <div className="requests-manage__details">
                                    <div className="requests-manage__detail">
                                        <span className="requests-manage__label">Tipo</span>
                                        <strong>{item.typeLabel}</strong>
                                    </div>

                                    <div className="requests-manage__detail">
                                        <span className="requests-manage__label">Período</span>
                                        <strong>{item.periodLabel}</strong>
                                    </div>

                                    <div className="requests-manage__detail">
                                        <span className="requests-manage__label">Enviado em</span>
                                        <strong>{item.createdAtLabel}</strong>
                                    </div>

                                    <div className="requests-manage__detail">
                                        <span className="requests-manage__label">Atualizado em</span>
                                        <strong>{item.updatedAtLabel}</strong>
                                    </div>
                                </div>

                                <p className="requests-manage__reason">{item.reason}</p>

                                <footer className="requests-manage__footer">
                                    <div className="requests-manage__links">
                                        {item.attachmentUrl ? (
                                            <a
                                                className="requests-manage__link"
                                                href={getAttachmentHref(item.attachmentUrl)}
                                                target="_blank"
                                                rel="noreferrer"
                                            >
                                                Ver anexo
                                            </a>
                                        ) : (
                                            <span className="requests-manage__link requests-manage__link--muted">
                                                Sem anexo
                                            </span>
                                        )}
                                    </div>

                                    {isPending ? (
                                        <div className="requests-manage__actions">
                                            <button
                                                type="button"
                                                className="requests-manage__button requests-manage__button--approve"
                                                disabled={isReviewing}
                                                onClick={() => void onReview(item.id, "aprovado")}
                                            >
                                                {isReviewing ? "Processando..." : "Aprovar"}
                                            </button>

                                            <button
                                                type="button"
                                                className="requests-manage__button requests-manage__button--reject"
                                                disabled={isReviewing}
                                                onClick={() => void onReview(item.id, "rejeitado")}
                                            >
                                                {isReviewing ? "Processando..." : "Rejeitar"}
                                            </button>
                                        </div>
                                    ) : (
                                        <span className="requests-manage__done">
                                            Solicitação já analisada.
                                        </span>
                                    )}
                                </footer>
                            </article>
                        );
                    })}
                </div>
            )}
        </section>
    );
}