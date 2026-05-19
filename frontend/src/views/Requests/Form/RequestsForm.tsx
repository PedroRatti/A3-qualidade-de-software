import type { FormEvent } from "react";
import type {
    CreateRequestPayload,
    RequestType,
    SupervisorOption,
} from "../../../types/request.types";

type RequestsFormProps = {
    form: CreateRequestPayload;
    supervisors: SupervisorOption[];
    loadingSupervisors: boolean;
    submitting: boolean;
    submitError: string;
    onFieldChange: <K extends keyof CreateRequestPayload>(
        field: K,
        value: CreateRequestPayload[K]
    ) => void;
    onTypeChange: (type: RequestType) => void;
    onSubmit: (event: FormEvent<HTMLFormElement>) => void | Promise<void>;
};

export function RequestsForm({
    form,
    supervisors,
    loadingSupervisors,
    submitting,
    submitError,
    onFieldChange,
    onTypeChange,
    onSubmit,
}: RequestsFormProps) {
    return (
        <section className="requests-panel">
            <div className="requests-panel__header">
                <div>
                    <h3>Abrir nova solicitação</h3>
                    <p>
                        Escolha o supervisor responsável e anexe o documento
                        quando necessário.
                    </p>
                </div>
            </div>

            {submitError ? (
                <section className="requests-feedback requests-feedback--error">
                    <strong>Ocorreu um erro ao enviar a solicitação.</strong>
                    <p>{submitError}</p>
                </section>
            ) : null}

            <form className="requests-form" onSubmit={onSubmit}>
                <label className="requests-field requests-field--span-6">
                    <span>Supervisor</span>
                    <select
                        value={form.supervisorId}
                        onChange={(event) => onFieldChange("supervisorId", event.target.value)}
                        required
                        disabled={loadingSupervisors}
                    >
                        <option value="">
                            {loadingSupervisors
                                ? "Carregando supervisores..."
                                : "Selecione um supervisor"}
                        </option>

                        {supervisors.map((supervisor) => (
                            <option key={supervisor.id} value={String(supervisor.id)}>
                                {supervisor.name}
                            </option>
                        ))}
                    </select>
                </label>

                <label className="requests-field requests-field--span-6">
                    <span>Tipo</span>
                    <select
                        value={form.type}
                        onChange={(event) => onTypeChange(event.target.value as RequestType)}
                    >
                        <option value="ferias">Férias</option>
                        <option value="abono_falta">Abono de falta</option>
                        <option value="outro">Outro</option>
                    </select>
                </label>

                <label className="requests-field requests-field--span-6">
                    <span>Data inicial</span>
                    <input
                        type="date"
                        value={form.startDate}
                        onChange={(event) => onFieldChange("startDate", event.target.value)}
                        required
                    />
                </label>

                <label className="requests-field requests-field--span-6">
                    <span>Data final</span>
                    <input
                        type="date"
                        value={form.endDate}
                        onChange={(event) => onFieldChange("endDate", event.target.value)}
                        required
                    />
                </label>

                <label className="requests-field requests-field--span-12">
                    <span>{form.type === "abono_falta" ? "Atestado" : "Anexo"}</span>
                    <input
                        type="file"
                        accept=".pdf,.png,.jpg,.jpeg"
                        onChange={(event) =>
                            onFieldChange("attachment", event.target.files?.[0] ?? null)
                        }
                        required={form.type === "abono_falta"}
                    />
                </label>

                <label className="requests-field requests-field--span-12">
                    <span>Motivo</span>
                    <textarea
                        value={form.reason}
                        onChange={(event) => onFieldChange("reason", event.target.value)}
                        rows={5}
                        minLength={10}
                        required
                    />
                </label>

                <div className="requests-actions">
                    <button type="submit" className="requests-submit" disabled={submitting}>
                        {submitting ? "Enviando..." : "Enviar solicitação"}
                    </button>
                </div>
            </form>
        </section>
    );
}