type RequestsTab = "nova" | "historico" | "gerenciar";

type RequestsTabsProps = {
    activeTab: RequestsTab;
    onChange: (tab: RequestsTab) => void | Promise<void>;
    isAdmin: boolean;
};

export function RequestsTabs({
    activeTab,
    onChange,
    isAdmin,
}: RequestsTabsProps) {
    return (
        <section className="requests-tabs">
            <button
                type="button"
                className={
                    activeTab === "nova"
                        ? "requests-tabs__button requests-tabs__button--active"
                        : "requests-tabs__button"
                }
                onClick={() => void onChange("nova")}
            >
                Nova solicitação
            </button>

            <button
                type="button"
                className={
                    activeTab === "historico"
                        ? "requests-tabs__button requests-tabs__button--active"
                        : "requests-tabs__button"
                }
                onClick={() => void onChange("historico")}
            >
                Histórico
            </button>

            {isAdmin ? (
                <button
                    type="button"
                    className={
                        activeTab === "gerenciar"
                            ? "requests-tabs__button requests-tabs__button--active"
                            : "requests-tabs__button"
                    }
                    onClick={() => void onChange("gerenciar")}
                >
                    Gerenciar Solicitações
                </button>
            ) : null}
        </section>
    );
}