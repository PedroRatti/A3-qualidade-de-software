import type { RequestHistoryItem } from "../../../types/request.types";

type RequestsHistoryProps = {
    history: RequestHistoryItem[];
    loadingHistory: boolean;
    historyError: string;
    getAttachmentHref: (path: string) => string;
};

export function RequestsHistory({
    history,
    loadingHistory,
    historyError,
    getAttachmentHref,
}: RequestsHistoryProps) {
    return (
        <section className="requests-panel">
            <div className="requests-panel__header">
                <div>
                    <h3>Histórico de solicitações</h3>
                </div>
            </div>

            {historyError ? (
                <section className="requests-feedback requests-feedback--error">
                    <strong>Ocorreu um erro ao buscar o histórico.</strong>
                    <p>{historyError}</p>
                </section>
            ) : null}

            {loadingHistory ? (
                <p className="requests-empty">Carregando histórico...</p>
            ) : history.length === 0 && !historyError ? (
                <p className="requests-empty">Nenhuma solicitação encontrada.</p>
            ) : (
                <div className="requests-history">
                    {history.map((item) => (
                        <article key={item.id} className="requests-history__item">
                            <header className="requests-history__item-header">
                                <div>
                                    <strong>{item.typeLabel}</strong>
                                    <span>{item.periodLabel}</span>
                                </div>

                                <span className={`requests-status requests-status--${item.status}`}>
                                    {item.statusLabel}
                                </span>
                            </header>

                            <p className="requests-history__supervisor">
                                Supervisor: {item.supervisorName}
                            </p>

                            <p>{item.reason}</p>

                            <footer className="requests-history__item-footer">
                                <span>Enviado em {item.createdAtLabel}</span>

                                {item.attachmentUrl ? (
                                    <a
                                        href={getAttachmentHref(item.attachmentUrl)}
                                        target="_blank"
                                        rel="noreferrer"
                                    >
                                        Ver anexo
                                    </a>
                                ) : null}
                            </footer>
                        </article>
                    ))}
                </div>
            )}
        </section>
    );
}