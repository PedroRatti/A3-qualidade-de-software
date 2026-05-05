import type { PointSummary } from "../../../types/ponto.types";

type PontoSummaryCardsProps = {
    summary: PointSummary;
};

export function PontoSummaryCards({ summary }: PontoSummaryCardsProps) {
    return (
        <section className="ponto-view__grid">
            <article className="ponto-card ponto-card--highlight">
                <span className="ponto-card__label">Horário atual</span>
                <strong className="ponto-card__time">{summary.currentTime}</strong>
                <p className="ponto-card__support">{summary.shiftLabel}</p>
            </article>

            <article className="ponto-card">
                <span className="ponto-card__label">Colaborador</span>
                <strong className="ponto-card__value">{summary.employeeName}</strong>
            </article>

            <article className="ponto-card">
                <span className="ponto-card__label">Horas do dia</span>
                <strong className="ponto-card__value">{summary.workedTime}</strong>
                <p className="ponto-card__support">
                    Resumo calculado com base nos pontos batidos registrados no dia.
                </p>
            </article>
        </section>
    );
}