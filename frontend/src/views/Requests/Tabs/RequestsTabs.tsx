type RequestsTab = "nova" | "historico";

type RequestsTabsProps = {
    activeTab: RequestsTab;
    onChange: (tab: RequestsTab) => void | Promise<void>;
};

export function RequestsTabs({ activeTab, onChange }: RequestsTabsProps) {
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
        </section>
    );
}