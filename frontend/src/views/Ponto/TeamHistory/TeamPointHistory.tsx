import type { TeamPointHistoryEmployee } from "../../../types/ponto.types";

type TeamPointHistoryProps = {
    employees: TeamPointHistoryEmployee[];
    loading: boolean;
    error: string;
};

export function TeamPointHistory({
    employees,
    loading,
    error,
}: TeamPointHistoryProps) {
    return (
        <section className="ponto-panel">
            <div className="ponto-panel__header">
                <div>
                    <h3>Histórico de Colaboradores</h3>
                    <p>
                        Consulte os registros recentes da equipe agrupados por colaborador.
                    </p>
                </div>
            </div>

            {error ? (
                <section className="ponto-feedback ponto-feedback--error">
                    <div>
                        <strong>Ocorreu um erro ao carregar o histórico da equipe.</strong>
                        <p>{error}</p>
                    </div>
                </section>
            ) : null}

            {loading ? (
                <p className="ponto-history__empty">Carregando histórico da equipe...</p>
            ) : employees.length === 0 && !error ? (
                <p className="ponto-history__empty">
                    Nenhum histórico de colaboradores encontrado.
                </p>
            ) : (
                <div className="ponto-team-history">
                    {employees.map((employee, index) => (
                        <details
                            key={employee.userId}
                            className="ponto-team-history__employee"
                            open={index === 0}
                        >
                            <summary className="ponto-team-history__summary">
                                <div className="ponto-team-history__summary-main">
                                    <div className="ponto-team-history__identity">
                                        <strong>{employee.employeeName}</strong>
                                        <span>{employee.employeeEmail}</span>
                                    </div>

                                    <div className="ponto-team-history__summary-meta">
                                        <span
                                            className={
                                                employee.isActive
                                                    ? "ponto-team-history__status ponto-team-history__status--active"
                                                    : "ponto-team-history__status ponto-team-history__status--inactive"
                                            }
                                        >
                                            {employee.isActive ? "Ativo" : "Inativo"}
                                        </span>

                                        <span className="ponto-team-history__count">
                                            {employee.history.length} dia(s)
                                        </span>
                                    </div>
                                </div>

                                <span
                                    aria-hidden="true"
                                    className="ponto-team-history__chevron"
                                >
                                    ▾
                                </span>
                            </summary>

                            <div className="ponto-team-history__content">
                                {employee.history.length === 0 ? (
                                    <p className="ponto-history__empty">
                                        Nenhum registro encontrado para este colaborador.
                                    </p>
                                ) : (
                                    <div className="ponto-team-history__days">
                                        {employee.history.map((day) => (
                                            <article key={day.date} className="ponto-history__day">
                                                <header className="ponto-history__day-header">
                                                    <div>
                                                        <strong>{day.dayLabel}</strong>
                                                    </div>
                                                    <span>{day.workedTime}</span>
                                                </header>

                                                <div className="ponto-records">
                                                    {day.records.map((record) => (
                                                        <article
                                                            key={record.id}
                                                            className="ponto-record"
                                                        >
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
                            </div>
                        </details>
                    ))}
                </div>
            )}
        </section>
    );
}