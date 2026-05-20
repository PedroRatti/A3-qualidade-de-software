import { useEffect, useState, type FormEvent } from "react";
import { PageTemplate } from "../../components/PageTemplate/PageTemplate";
import { useRequests } from "../../hooks/useRequests";
import type { CreateRequestPayload, RequestType } from "../../types/request.types";
import "./Requests.css";
import { RequestsTabs } from "./Tabs/RequestsTabs";
import { RequestsForm } from "./Form/RequestsForm";
import { RequestsHistory } from "./History/RequestsHistory";

const initialForm: CreateRequestPayload = {
    supervisorId: "",
    type: "ferias",
    startDate: "",
    endDate: "",
    reason: "",
    attachment: null,
};

export function Requests() {
    const [activeTab, setActiveTab] = useState<"nova" | "historico">("nova");
    const [form, setForm] = useState<CreateRequestPayload>(initialForm);
    const API_BASE_URL = import.meta.env.VITE_API_URL;

    const {
        history,
        supervisors,
        loadingHistory,
        loadingSupervisors,
        submitting,
        historyError,
        submitError,
        clearErrors,
        loadSupervisors,
        submitRequest,
        loadHistory,
    } = useRequests();

    useEffect(() => {
        void loadSupervisors();
    }, []);

    const handleFieldChange = <K extends keyof CreateRequestPayload>(
        field: K,
        value: CreateRequestPayload[K]
    ) => {
        setForm((current) => ({ ...current, [field]: value }));
    };

    const handleTypeChange = (type: RequestType) => {
        setForm((current) => ({
            ...current,
            type,
            attachment: type === "abono_falta" ? current.attachment : null,
        }));
    };

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        try {
            await submitRequest(form);

            setForm(initialForm);
            clearErrors();
            setActiveTab("historico");
            await loadHistory();
        } catch {
            return;
        }
    };

    const handleTabChange = async (tab: "nova" | "historico") => {
        clearErrors();
        setActiveTab(tab);

        if (tab === "historico" && history.length === 0) {
            await loadHistory();
        }
    };

    function getAttachmentHref(path: string) {
        if (path.startsWith("http://") || path.startsWith("https://")) {
            return path;
        }

        return `${API_BASE_URL}${path}`;
    }

    return (
        <PageTemplate title="Solicitacoes">
            <section className="requests-view">
                <section className="requests-hero">
                    <div>
                        <p className="requests-hero__eyebrow">Portal do colaborador</p>
                        <h2>Solicitações</h2>
                        <p>
                            Envie pedidos de férias, abono de falta e outras demandas
                            administrativas em um único fluxo.
                        </p>
                    </div>
                </section>

                <RequestsTabs activeTab={activeTab} onChange={handleTabChange} />

                {activeTab === "nova" ? (
                    <RequestsForm
                        form={form}
                        supervisors={supervisors}
                        loadingSupervisors={loadingSupervisors}
                        submitting={submitting}
                        submitError={submitError}
                        onFieldChange={handleFieldChange}
                        onTypeChange={handleTypeChange}
                        onSubmit={handleSubmit}
                    />
                ) : (
                    <RequestsHistory
                        history={history}
                        loadingHistory={loadingHistory}
                        historyError={historyError}
                        getAttachmentHref={getAttachmentHref}
                    />
                )}
            </section>
        </PageTemplate>
    );
}