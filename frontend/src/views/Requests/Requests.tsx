import { useEffect, useMemo, useState, type FormEvent } from "react";
import { useLocation, useSearchParams } from "react-router-dom";
import { PageTemplate } from "../../components/PageTemplate/PageTemplate";
import { useRequests } from "../../hooks/useRequests";
import { isAdmin } from "../../utils/auth";
import type {
    CreateRequestPayload,
    RequestReviewStatusInput,
    RequestType,
} from "../../types/request.types";
import "./Requests.css";
import { RequestsTabs } from "./Tabs/RequestsTabs";
import { RequestsForm } from "./Form/RequestsForm";
import { RequestsHistory } from "./History/RequestsHistory";
import { SupervisorRequests } from "./Management/SupervisorRequests";

type RequestsTab = "nova" | "historico" | "gerenciar";

const initialForm: CreateRequestPayload = {
    supervisorId: "",
    type: "ferias",
    startDate: "",
    endDate: "",
    reason: "",
    attachment: null,
};

function resolveRequestsTab(value: string | null, admin: boolean): RequestsTab {
    if (value === "historico") {
        return "historico";
    }

    if (value === "gerenciar" && admin) {
        return "gerenciar";
    }

    return "nova";
}

export function Requests() {
    const location = useLocation();
    const [searchParams, setSearchParams] = useSearchParams();
    const admin = isAdmin();
    const requestedTab = useMemo(
        () => resolveRequestsTab(new URLSearchParams(location.search).get("tab"), admin),
        [location.search, admin]

    );

    const [activeTab, setActiveTab] = useState<RequestsTab>(requestedTab);
    const [form, setForm] = useState<CreateRequestPayload>(initialForm);
    const API_BASE_URL = import.meta.env.VITE_API_URL;

    const {
        history,
        assignedRequests,
        supervisors,
        loadingHistory,
        loadingAssignedRequests,
        loadingSupervisors,
        submitting,
        reviewingRequestId,
        historyLoaded,
        assignedRequestsLoaded,
        historyError,
        assignedRequestsError,
        submitError,
        clearErrors,
        loadSupervisors,
        submitRequest,
        loadHistory,
        loadAssignedRequests,
        reviewRequest,
    } = useRequests();

    useEffect(() => {
        void loadSupervisors();
    }, []);

    useEffect(() => {
        setActiveTab(requestedTab);

        if (requestedTab === "historico" && !historyLoaded) {
            void loadHistory();
        }

        if (requestedTab === "gerenciar" && !assignedRequestsLoaded) {
            void loadAssignedRequests();
        }
    }, [requestedTab, historyLoaded, assignedRequestsLoaded]);

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
            setSearchParams({ tab: "historico" });
            await loadHistory();
        } catch {
            return;
        }
    };

    const handleReview = async (
        requestId: number,
        status: RequestReviewStatusInput
    ) => {
        try {
            await reviewRequest(requestId, status);
        } catch {
            return;
        }
    };

    const handleTabChange = async (tab: RequestsTab) => {
        if (tab === "gerenciar" && !admin) {
            return;
        }

        clearErrors();

        if (tab === "nova") {
            setSearchParams({});
            return;
        }

        setSearchParams({ tab });
    };

    function getAttachmentHref(path: string) {
        if (path.startsWith("http://") || path.startsWith("https://")) {
            return path;
        }

        return `${API_BASE_URL}${path}`;
    }

    return (
        <PageTemplate title="Solicitações">
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

                <RequestsTabs
                    activeTab={activeTab}
                    onChange={handleTabChange}
                    isAdmin={admin}
                />

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
                ) : activeTab === "historico" ? (
                    <RequestsHistory
                        history={history}
                        loadingHistory={loadingHistory}
                        historyError={historyError}
                        getAttachmentHref={getAttachmentHref}
                    />
                ) : (
                    <SupervisorRequests
                        requests={assignedRequests}
                        loading={loadingAssignedRequests}
                        error={assignedRequestsError}
                        reviewingRequestId={reviewingRequestId}
                        getAttachmentHref={getAttachmentHref}
                        onReview={handleReview}
                    />
                )}
            </section>
        </PageTemplate>
    );
}
