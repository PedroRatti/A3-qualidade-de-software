import type { PointHistoryDay } from "../../../types/ponto.types";

type PointHistoryProps = {
    history: PointHistoryDay[];
    loading: boolean;
    error: string;
};

export function PointHistory({ history, loading, error }: PointHistoryProps) {
    return (
        <section className="ponto-panel">
            <div className="ponto-panel__header">
                <div>
                    <h3>Histórico de pontos</h3>
                </div>
            </div>

            {error ? (
                <section className="ponto-feedback ponto-feedback--error">
                    <div>
                        <strong>Ocorreu um erro ao carregar o histórico.</strong>
                        <p>{error}</p>
                    </div>
                </section>
            ) : null}

            {loading ? (
                <p className="ponto-history__empty">Carregando histórico...</p>
            ) : history.length === 0 && !error ? (
                <p className="ponto-history__empty">Nenhum histórico encontrado.</p>
            ) : (
                <div className="ponto-history">
                    {history.map((day) => (
                        <article key={day.date} className="ponto-history__day">
                            <header className="ponto-history__day-header">
                                <div>
                                    <strong>{day.dayLabel}</strong>
                                </div>
                                <span>{day.workedTime}</span>
                            </header>

                            <div className="ponto-records">
                                {day.records.map((record) => (
                                    <article key={record.id} className="ponto-record">
                                        <div>
                                            <strong>{record.label}</strong>
                                            <span
                                                className={`ponto-record__kind ponto-record__kind--${record.kind}`}
                                            >
                                                {record.kind}
                                            </span>
                                        </div>
                                        <time>{record.timestamp}</time>
                                    </article>
                                ))}
                            </div>
                        </article>
                    ))}
                </div>
            )}
        </section>
    );
}