type PontoTab = "registro" | "historico" | "colaboradores";

type PontoTabsProps = {
    activeTab: PontoTab;
    onChange: (tab: PontoTab) => void | Promise<void>;
    isAdmin: boolean;
};

export function PontoTabs({ activeTab, onChange, isAdmin }: PontoTabsProps) {
    return (
        <section className="ponto-tabs">
            <button
                type="button"
                className={
                    activeTab === "registro"
                        ? "ponto-tabs__button ponto-tabs__button--active"
                        : "ponto-tabs__button"
                }
                onClick={() => void onChange("registro")}
            >
                Bater ponto
            </button>

            <button
                type="button"
                className={
                    activeTab === "historico"
                        ? "ponto-tabs__button ponto-tabs__button--active"
                        : "ponto-tabs__button"
                }
                onClick={() => void onChange("historico")}
            >
                Histórico
            </button>

            {isAdmin ? (
                <button
                    type="button"
                    className={
                        activeTab === "colaboradores"
                            ? "ponto-tabs__button ponto-tabs__button--active"
                            : "ponto-tabs__button"
                    }
                    onClick={() => void onChange("colaboradores")}
                >
                    Histórico de Colaboradores
                </button>
            ) : null}
        </section>
    );
}