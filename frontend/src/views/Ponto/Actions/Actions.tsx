import type { PointActionKey } from "../../../types/ponto.types";
import { actionDefinitions, pointActionIcons } from "../Constants/Constants";

type ActionsProps = {
    availableActions: PointActionKey[];
    loading: boolean;
    submittingAction: PointActionKey | null;
    onActionClick: (action: PointActionKey) => Promise<void>;
};

export function Actions({ availableActions, loading, submittingAction, onActionClick }: ActionsProps) {
    return (
        <section className="ponto-panel">
            <div className="ponto-panel__header">
                <div>
                    <h3>Ações de ponto</h3>
                    <p>As ações disponíveis mudam conforme a última batida registrada.</p>
                </div>
            </div>

            <div className="ponto-actions">
                {actionDefinitions.map((action) => {
                    const Icon = pointActionIcons[action.key];
                    const isAvailable = availableActions.includes(action.key);
                    const isSubmittingCurrentAction = submittingAction === action.key;

                    return (
                        <button
                            key={action.key}
                            type="button"
                            className={`ponto-action ponto-action--${action.tone}`}
                            disabled={!isAvailable || loading || submittingAction !== null}
                            onClick={() => void onActionClick(action.key)}
                        >
                            <Icon size={16} />
                            <span>{isSubmittingCurrentAction ? "Registrando..." : action.label}</span>
                        </button>
                    );
                })}
            </div>
        </section>
    );
}