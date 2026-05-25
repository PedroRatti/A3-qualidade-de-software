import { useState } from "react";
import { PageTemplate } from "../../components/PageTemplate/PageTemplate.tsx";
import { usePonto } from "../../hooks/usePonto.ts";
import { isAdmin } from "../../utils/auth";
import type { PointActionKey } from "../../types/ponto.types.ts";
import { Actions } from "./Actions/Actions.tsx";
import { createPointPreview } from "./Constants/Constants.ts";
import { PontoHero } from "./Hero/PontoHero.tsx";
import "./Ponto.css";
import { Records } from "./Records/Records.tsx";
import { PontoSummaryCards } from "./Summary/PontoSummary.tsx";
import { PointHistory } from "./History/PointHistory.tsx";
import { TeamPointHistory } from "./TeamHistory/TeamPointHistory.tsx";
import { PontoTabs } from "./Tabs/PontoTabs.tsx";

type PontoTab = "registro" | "historico" | "colaboradores";

export function Ponto() {
    const [activeTab, setActiveTab] = useState<PontoTab>("registro");
    const admin = isAdmin();

    const {
        summary,
        loading,
        submittingAction,
        summaryError,
        refreshSummary,
        registerAction,
        history,
        historyLoading,
        historyError,
        loadHistory,
        teamHistory,
        teamHistoryLoading,
        teamHistoryError,
        loadTeamHistory,
    } = usePonto();

    const pointData = summary ?? createPointPreview();

    const handleActionClick = async (action: PointActionKey) => {
        try {
            await registerAction(action);
        } catch {
            return;
        }
    };

    const handleTabChange = async (tab: PontoTab) => {
        if (tab === "colaboradores" && !admin) {
            return;
        }

        setActiveTab(tab);

        if (tab === "historico" && history.length === 0) {
            await loadHistory();
        }

        if (tab === "colaboradores" && teamHistory.length === 0) {
            await loadTeamHistory();
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

                {summaryError ? (
                    <section className="ponto-feedback ponto-feedback--error">
                        <div>
                            <strong>Falha ao carregar ou registrar o ponto.</strong>
                            <p>{summaryError}</p>
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

                <PontoTabs
                    activeTab={activeTab}
                    onChange={handleTabChange}
                    isAdmin={admin}
                />

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
                ) : activeTab === "historico" ? (
                    <PointHistory
                        history={history}
                        loading={historyLoading}
                        error={historyError}
                    />
                ) : (
                    <TeamPointHistory
                        employees={teamHistory}
                        loading={teamHistoryLoading}
                        error={teamHistoryError}
                    />
                )}
            </section>
        </PageTemplate>
    );
}