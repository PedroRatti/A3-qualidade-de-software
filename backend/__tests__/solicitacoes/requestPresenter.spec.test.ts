import { describe, expect, it } from "vitest";

import {
    formatRequest,
    formatSupervisorRequest,
    parseReviewRequestStatus,
} from "../../src/utils/solicitacoes/request.presenter";
import type {
    RequestRecord,
    SupervisorRequestRecord,
} from "../../src/useCases/solicitacoes/contracts/request.types";

function makeRecord(overrides: Partial<RequestRecord> = {}): RequestRecord {
    return {
        id: 10,
        user_id: 7,
        supervisor_id: 1,
        supervisor_name: "Pedro Admin",
        type: "ferias",
        start_date: "2026-06-10",
        end_date: "2026-06-20",
        reason: "Férias programadas",
        attachment_url: "/uploads/requests/arquivo.pdf",
        status: "pendente",
        created_at: new Date("2026-05-12T10:00:00"),
        updated_at: new Date("2026-05-12T10:00:00"),
        ...overrides,
    };
}

function makeSupervisorRecord(
    overrides: Partial<SupervisorRequestRecord> = {}
): SupervisorRequestRecord {
    return {
        ...makeRecord(),
        requester_name: "Ana Souza",
        requester_email: "ana.souza@example.com",
        ...overrides,
    };
}

describe("request.presenter", () => {
    it("deve formatar uma solicitação com período e supervisor", () => {
        const result = formatRequest(makeRecord());

        expect(result.id).toBe(10);
        expect(result.type).toBe("ferias");
        expect(result.typeLabel).toBe("Férias");
        expect(result.startDate).toBe("2026-06-10");
        expect(result.endDate).toBe("2026-06-20");
        expect(result.periodLabel).toContain("10/06/2026");
        expect(result.periodLabel).toContain("20/06/2026");
        expect(result.supervisorId).toBe(1);
        expect(result.supervisorName).toBe("Pedro Admin");
        expect(result.attachmentUrl).toBe("/uploads/requests/arquivo.pdf");
        expect(result.statusLabel).toBe("Pendente");
    });

    it("deve formatar corretamente solicitação de um único dia", () => {
        const result = formatRequest(
            makeRecord({
                type: "abono_falta",
                start_date: "2026-05-12",
                end_date: "2026-05-12",
            })
        );

        expect(result.type).toBe("abono_falta");
        expect(result.typeLabel).toBe("Abono de falta");
        expect(result.periodLabel).toBe("12/05/2026");
    });

    it("deve formatar solicitação do supervisor com dados do solicitante", () => {
        const result = formatSupervisorRequest(makeSupervisorRecord());

        expect(result.requesterId).toBe(7);
        expect(result.requesterName).toBe("Ana Souza");
        expect(result.requesterEmail).toBe("ana.souza@example.com");
        expect(result.updatedAtLabel).toBeTruthy();
    });

    it("deve normalizar status de revisão recebido da API", () => {
        expect(parseReviewRequestStatus("aprovado")).toBe("aprovada");
        expect(parseReviewRequestStatus("rejeitado")).toBe("rejeitada");
        expect(parseReviewRequestStatus("invalido")).toBeNull();
    });

    it("deve lançar erro ao receber data inválida", () => {
        expect(() =>
            formatRequest(
                makeRecord({
                    start_date: "data-invalida",
                })
            )
        ).toThrow("Data inválida recebida no presenter: data-invalida");
    });
});