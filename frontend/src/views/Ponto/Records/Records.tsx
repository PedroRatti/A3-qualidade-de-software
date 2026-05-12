import type { PointRecord } from "../../../types/ponto.types";

type RecordsProps = {
    records: PointRecord[];
};

export function Records({ records }: RecordsProps) {
    return (
        <section className="ponto-panel">
            <div className="ponto-panel__header">
                <div>
                    <h3>Últimos registros</h3>
                </div>
            </div>

            <div className="ponto-records">
                {records.length > 0 ? (
                    records.map((record) => (
                        <article key={record.id} className="ponto-record">
                            <div>
                                <strong>{record.label}</strong>
                                <span className={`ponto-record__kind ponto-record__kind--${record.kind}`}>
                                    {record.kind}
                                </span>
                            </div>
                            <time>{record.timestamp}</time>
                        </article>
                    ))
                ) : (
                    <article className="ponto-record ponto-record--empty">
                        <div>
                            <strong>Nenhuma batida registrada hoje.</strong>
                        </div>
                    </article>
                )}
            </div>
        </section>
    );
}