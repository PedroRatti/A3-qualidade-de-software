import { FaRegClock } from "react-icons/fa6";
import type { PointStatus } from "../../../types/ponto.types";
import { statusLabels } from "../Constants/Constants";

type PontoHeroProps = {
    status: PointStatus;
    currentDay: string;
    loading: boolean;
};

export function PontoHero({ status, currentDay, loading }: PontoHeroProps) {
    return (
        <header className="ponto-view__hero">
            <div>
                <p className="ponto-view__eyebrow">Controle de jornada</p>
                <h2>Bater ponto</h2>
                <p className="ponto-view__description">
                    Consulte o resumo do dia e registre entrada, pausa e saída em tempo real.
                </p>
            </div>

            <div className="ponto-view__hero-meta">
                <span className="ponto-view__badge">
                    <FaRegClock size={14} />
                    {loading ? "Carregando..." : statusLabels[status]}
                </span>
                <strong>{currentDay}</strong>
            </div>
        </header>
    );
}