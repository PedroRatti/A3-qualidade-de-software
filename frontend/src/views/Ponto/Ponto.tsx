import { useState } from "react";
import { PageTemplate } from "../../components/PageTemplate/PageTemplate.tsx";
import { usePonto } from "../../hooks/usePonto.ts";
import type { PointActionKey } from "../../types/ponto.types.ts";
import { Actions } from "./Actions/Actions.tsx";
import { createPointPreview } from "./Constants/Constants.ts";
import { PontoHero } from "./Hero/PontoHero.tsx";
import "./Ponto.css";
import { Records } from "./Records/Records.tsx";
import { PontoSummaryCards } from "./Summary/PontoSummary.tsx";
import { PointHistory } from "./History/PointHistory.tsx";

export function Ponto() {
    const [activeTab, setActiveTab] = useState<"registro" | "historico">("registro");
    const {
        summary,
        loading,
        submittingAction,
        error,
        refreshSummary,
        registerAction,
        history,
        historyLoading,
        loadHistory,
    } = usePonto();

    const pointData = summary ?? createPointPreview();

    const handleActionClick = async (action: PointActionKey) => {
        try {
            await registerAction(action);
        } catch {
            return;
        }
    };

    const handleTabChange = async (tab: "registro" | "historico") => {
        setActiveTab(tab);

        if (tab === "historico" && history.length === 0) {
            await loadHistory();
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

                <section className="ponto-tabs">
                    <button
                        type="button"
                        className={activeTab === "registro" ? "ponto-tabs__button ponto-tabs__button--active" : "ponto-tabs__button"}
                        onClick={() => void handleTabChange("registro")}
                    >
                        Bater ponto
                    </button>

                    <button
                        type="button"
                        className={activeTab === "historico" ? "ponto-tabs__button ponto-tabs__button--active" : "ponto-tabs__button"}
                        onClick={() => void handleTabChange("historico")}
                    >
                        HistÃ³rico
                    </button>
                </section>

                {activeTab === "registro" ? (
                    <>
                        <PontoSummaryCards summary={pointData} />

                        <Actions
                            availableActions={pointData.availableActions}
                            loading={loading}
                            submittingAction={submittingAction}
                            onActionClick={handleActionClick}
                        />

                        <Records records={pointData.records} />
                    </>
                ) : (
                    <PointHistory history={history} loading={historyLoading} />
                )}
            </section>
        </PageTemplate>
    );
}