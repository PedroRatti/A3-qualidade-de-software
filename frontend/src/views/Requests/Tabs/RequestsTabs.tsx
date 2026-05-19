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
                        ? "requests-tabsbutton requests-tabsbutton--active"
                        : "requests-tabsbutton"
                }
                onClick={() => void onChange("nova")}
            >
                Nova solicitação
            </button>

            <button
                type="button"
                className={
                    activeTab === "historico"
                        ? "requests-tabsbutton requests-tabsbutton--active"
                        : "requests-tabsbutton"
                }
                onClick={() => void onChange("historico")}
            >
                Histórico
            </button>
        </section>
    );
}