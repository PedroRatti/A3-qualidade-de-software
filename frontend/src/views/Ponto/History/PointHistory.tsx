import type { PointHistoryDay } from "../../../types/ponto.types";

type PointHistoryProps = {
    history: PointHistoryDay[];
    loading: boolean;
};

export function PointHistory({ history, loading }: PointHistoryProps) {
    if (loading) {
        return (
            <section className="ponto-panel">
                <div className="ponto-panel__header">
                    <div>
                        <h3>Histórico de pontos</h3>
                    </div>
                </div>
                <p className="ponto-history__empty">Carregando histórico...</p>
            </section>
        );
    }

    if (history.length === 0) {
        return (
            <section className="ponto-panel">
                <div className="ponto-panel__header">
                    <div>
                        <h3>Histórico de pontos</h3>
                    </div>
                </div>
                <p className="ponto-history__empty">Nenhum histórico encontrado.</p>
            </section>
        );
    }

    return (
        <section className="ponto-panel">
            <div className="ponto-panel__header">
                <div>
                    <h3>Histórico de pontos</h3>
                </div>
            </div>

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
                                        <span className={`ponto-record__kind ponto-record__kind--${record.kind}`}>
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
        </section>
    );
}