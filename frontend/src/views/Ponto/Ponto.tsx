import { PageTemplate } from "../../components/PageTemplate/PageTemplate.tsx";
import { usePonto } from "../../hooks/usePonto.ts";
import type { PointActionKey } from "../../types/ponto.types.ts";
import { Actions } from "./Actions/Actions.tsx";
import { createPointPreview } from "./Constants/Constants.ts";
import { PontoHero } from "./Hero/PontoHero.tsx";
import "./Ponto.css";
import { Records } from "./Records/Records.tsx";
import { PontoSummaryCards } from "./Summary/PontoSummary.tsx";

export function Ponto() {
    const { summary, loading, submittingAction, error, refreshSummary, registerAction } = usePonto();
    const pointData = summary ?? createPointPreview();

    const handleActionClick = async (action: PointActionKey) => {
        try {
            await registerAction(action);
        } catch {
            return;
        }
    };

    return (
        <PageTemplate title="Overview">
            <section className="ponto-view">
                <PontoHero
                    status={pointData.status}
                    currentDay={pointData.currentDay}
                    loading={loading}
                />

                {error ? (
                    <section className="ponto-feedback ponto-feedback--error">
                        <div>
                            <strong>Falha ao carregar ou registrar o ponto.</strong>
                            <p>{error}</p>
                        </div>
                        <button
                            type="button"
                            className="ponto-feedback__button"
                            onClick={() => void refreshSummary()}
                        >
                            Tentar novamente
                        </button>
                    </section>
                ) : null}

                <PontoSummaryCards summary={pointData} />

                <Actions
                    availableActions={pointData.availableActions}
                    loading={loading}
                    submittingAction={submittingAction}
                    onActionClick={handleActionClick}
                />

                <Records records={pointData.records} />
            </section>
        </PageTemplate>
    );
}