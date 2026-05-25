import { Buffer } from "node:buffer";
import { expect, test } from "@playwright/test";

const supervisorMock = [
    {
        id: 1,
        name: "Pedro Admin",
        email: "pedro.admin@example.com",
    },
    {
        id: 2,
        name: "Maria Admin",
        email: "maria.admin@example.com",
    },
];

function makeHistoryItem(overrides: Partial<{
    id: number;
    type: "ferias" | "abono_falta" | "outro";
    typeLabel: string;
    startDate: string;
    endDate: string;
    periodLabel: string;
    reason: string;
    supervisorId: number;
    supervisorName: string;
    attachmentUrl: string | null;
    status: "pendente" | "aprovada" | "rejeitada";
    statusLabel: string;
    createdAtLabel: string;
}> = {}) {
    return {
        id: 100,
        type: "ferias" as const,
        typeLabel: "Férias",
        startDate: "2026-06-10",
        endDate: "2026-06-20",
        periodLabel: "10/06/2026 ate 20/06/2026",
        reason: "Férias programadas",
        supervisorId: 1,
        supervisorName: "Pedro Admin",
        attachmentUrl: null,
        status: "pendente" as const,
        statusLabel: "Pendente",
        createdAtLabel: "12/05/2026, 10:00",
        ...overrides,
    };
}

function makeAssignedRequest(overrides: Partial<{
    id: number;
    type: "ferias" | "abono_falta" | "outro";
    typeLabel: string;
    startDate: string;
    endDate: string;
    periodLabel: string;
    reason: string;
    requesterId: number;
    requesterName: string;
    requesterEmail: string;
    supervisorId: number;
    supervisorName: string;
    attachmentUrl: string | null;
    status: "pendente" | "aprovada" | "rejeitada";
    statusLabel: string;
    createdAtLabel: string;
    updatedAtLabel: string;
}> = {}) {
    return {
        id: 200,
        type: "ferias" as const,
        typeLabel: "Férias",
        startDate: "2026-05-25",
        endDate: "2026-05-26",
        periodLabel: "25/05/2026 ate 26/05/2026",
        reason: "Viagem pessoal",
        requesterId: 7,
        requesterName: "Ana Souza",
        requesterEmail: "ana.souza@example.com",
        supervisorId: 1,
        supervisorName: "Pedro Admin",
        attachmentUrl: null,
        status: "pendente" as const,
        statusLabel: "Pendente",
        createdAtLabel: "25/05/2026, 18:39",
        updatedAtLabel: "25/05/2026, 18:39",
        ...overrides,
    };
}

test.beforeEach(async ({ page }) => {
    await page.addInitScript(() => {
        localStorage.setItem("token", "fake-jwt-token");
        localStorage.setItem(
            "user",
            JSON.stringify({
                id: 7,
                name: "Ana Souza",
                email: "ana.souza@example.com",
                role: "employee",
                is_active: true,
            })
        );
    });
});

test("deve enviar solicitação de férias com sucesso", async ({ page }) => {
    await page.route("**/solicitacoes/supervisors", async (route) => {
        await route.fulfill({
            status: 200,
            contentType: "application/json",
            body: JSON.stringify(supervisorMock),
        });
    });

    await page.route("**/solicitacoes/history", async (route) => {
        await route.fulfill({
            status: 200,
            contentType: "application/json",
            body: JSON.stringify([makeHistoryItem()]),
        });
    });

    await page.route("**/solicitacoes", async (route) => {
        if (route.request().method() !== "POST") {
            await route.fallback();
            return;
        }

        await route.fulfill({
            status: 201,
            contentType: "application/json",
            body: JSON.stringify({
                message: "Solicitação enviada com sucesso.",
                request: makeHistoryItem(),
            }),
        });
    });

    await page.goto("/requests");

    await expect(
        page.getByRole("heading", { name: "Solicitações", level: 1 })
    ).toBeVisible();
    await expect(
        page.getByRole("button", { name: "Gerenciar Solicitações" })
    ).toHaveCount(0);

    await page.selectOption('select:has(option[value="1"])', "1");
    await page.locator('input[type="date"]').nth(0).fill("2026-06-10");
    await page.locator('input[type="date"]').nth(1).fill("2026-06-20");
    await page.locator("textarea").fill("Férias programadas");
    await page.getByRole("button", { name: "Enviar solicitação" }).click();

    await expect(
        page.getByRole("heading", { name: "Histórico de solicitações" })
    ).toBeVisible();
    await expect(page.getByText("Pedro Admin")).toBeVisible();
    await expect(page.getByText("Férias programadas")).toBeVisible();
    await expect(page.getByText("Pendente")).toBeVisible();
});

test("deve enviar solicitação de abono com anexo", async ({ page }) => {
    await page.route("**/solicitacoes/supervisors", async (route) => {
        await route.fulfill({
            status: 200,
            contentType: "application/json",
            body: JSON.stringify(supervisorMock),
        });
    });

    await page.route("**/solicitacoes/history", async (route) => {
        await route.fulfill({
            status: 200,
            contentType: "application/json",
            body: JSON.stringify([
                makeHistoryItem({
                    id: 101,
                    type: "abono_falta",
                    typeLabel: "Abono de falta",
                    startDate: "2026-05-12",
                    endDate: "2026-05-12",
                    periodLabel: "12/05/2026",
                    reason: "Consulta médica",
                    attachmentUrl: "/uploads/requests/atestado.pdf",
                }),
            ]),
        });
    });

    await page.route("**/solicitacoes", async (route) => {
        if (route.request().method() !== "POST") {
            await route.fallback();
            return;
        }

        expect(route.request().headers()["content-type"]).toContain(
            "multipart/form-data"
        );

        await route.fulfill({
            status: 201,
            contentType: "application/json",
            body: JSON.stringify({
                message: "Solicitação enviada com sucesso.",
                request: makeHistoryItem({
                    id: 101,
                    type: "abono_falta",
                    typeLabel: "Abono de falta",
                    startDate: "2026-05-12",
                    endDate: "2026-05-12",
                    periodLabel: "12/05/2026",
                    reason: "Consulta médica",
                    attachmentUrl: "/uploads/requests/atestado.pdf",
                }),
            }),
        });
    });

    await page.goto("/requests");

    await page.selectOption('select:has(option[value="1"])', "1");
    await page.locator("select").nth(1).selectOption("abono_falta");
    await page.locator('input[type="date"]').nth(0).fill("2026-05-12");
    await page.locator('input[type="date"]').nth(1).fill("2026-05-12");
    await page.locator('input[type="file"]').setInputFiles({
        name: "atestado.pdf",
        mimeType: "application/pdf",
        buffer: Buffer.from("fake pdf content"),
    });
    await page.locator("textarea").fill("Consulta médica");
    await page.getByRole("button", { name: "Enviar solicitação" }).click();

    const historyItem = page.locator(".requests-history__item").first();

    await expect(historyItem).toContainText("Abono de falta");
    await expect(historyItem).toContainText("Consulta médica");
    await expect(
        historyItem.getByRole("link", { name: "Ver anexo" })
    ).toBeVisible();
});

test("deve carregar histórico e exibir supervisor e anexo", async ({ page }) => {
    await page.route("**/solicitacoes/supervisors", async (route) => {
        await route.fulfill({
            status: 200,
            contentType: "application/json",
            body: JSON.stringify(supervisorMock),
        });
    });

    await page.route("**/solicitacoes/history", async (route) => {
        await route.fulfill({
            status: 200,
            contentType: "application/json",
            body: JSON.stringify([
                makeHistoryItem({
                    id: 102,
                    type: "abono_falta",
                    typeLabel: "Abono de falta",
                    reason: "Consulta médica",
                    attachmentUrl: "/uploads/requests/atestado.pdf",
                    supervisorName: "Maria Admin",
                    supervisorId: 2,
                }),
            ]),
        });
    });

    await page.goto("/requests");
    await page.getByRole("button", { name: "Histórico" }).click();

    await expect(
        page.getByRole("heading", { name: "Histórico de solicitações" })
    ).toBeVisible();
    await expect(page.getByText("Maria Admin")).toBeVisible();
    await expect(page.getByText("Consulta médica")).toBeVisible();
    await expect(page.getByRole("link", { name: "Ver anexo" })).toHaveAttribute(
        "href",
        "http://localhost:3000/uploads/requests/atestado.pdf"
    );
});

test("deve limpar erro do histórico ao trocar de aba", async ({ page }) => {
    await page.route("**/solicitacoes/supervisors", async (route) => {
        await route.fulfill({
            status: 200,
            contentType: "application/json",
            body: JSON.stringify(supervisorMock),
        });
    });

    await page.route("**/solicitacoes/history", async (route) => {
        await route.fulfill({
            status: 500,
            contentType: "application/json",
            body: JSON.stringify({
                message: "Erro interno ao buscar o histórico de solicitações.",
            }),
        });
    });

    await page.goto("/requests");
    await page.getByRole("button", { name: "Histórico" }).click();

    await expect(
        page.getByText("Ocorreu um erro ao buscar o histórico.")
    ).toBeVisible();

    await page.getByRole("button", { name: "Nova solicitação" }).click();

    await expect(
        page.getByText("Ocorreu um erro ao buscar o histórico.")
    ).not.toBeVisible();
    await expect(
        page.getByRole("heading", { name: "Abrir nova solicitação" })
    ).toBeVisible();
});

test("admin deve visualizar e revisar solicitações na aba de gerenciamento", async ({
    page,
}) => {
    await page.addInitScript(() => {
        localStorage.setItem("token", "fake-jwt-token");
        localStorage.setItem(
            "user",
            JSON.stringify({
                id: 1,
                name: "Pedro Admin",
                email: "pedro.admin@example.com",
                role: "admin",
                is_active: true,
            })
        );
    });

    await page.route("**/solicitacoes/supervisors", async (route) => {
        await route.fulfill({
            status: 200,
            contentType: "application/json",
            body: JSON.stringify(supervisorMock),
        });
    });

    await page.route("**/solicitacoes/assigned", async (route) => {
        await route.fulfill({
            status: 200,
            contentType: "application/json",
            body: JSON.stringify([makeAssignedRequest()]),
        });
    });

    await page.route("**/solicitacoes/200/status", async (route) => {
        await route.fulfill({
            status: 200,
            contentType: "application/json",
            body: JSON.stringify({
                message: "Solicitação atualizada com sucesso.",
                request: makeAssignedRequest({
                    status: "aprovada",
                    statusLabel: "Aprovada",
                    updatedAtLabel: "25/05/2026, 19:15",
                }),
            }),
        });
    });

    await page.goto("/requests");
    await page.getByRole("button", { name: "Gerenciar Solicitações" }).click();

    await expect(
        page.getByRole("heading", { name: "Gerenciar Solicitações" })
    ).toBeVisible();
    await expect(page.getByText("Ana Souza")).toBeVisible();
    await expect(page.getByText("Viagem pessoal")).toBeVisible();

    await page.getByRole("button", { name: "Aprovar" }).click();

    await expect(page.getByText("Aprovada")).toBeVisible();
    await expect(page.getByText("Solicitação já analisada.")).toBeVisible();
});

test("admin deve conseguir rejeitar uma solicitação atribuída", async ({ page }) => {
    await page.addInitScript(() => {
        localStorage.setItem("token", "fake-jwt-token");
        localStorage.setItem(
            "user",
            JSON.stringify({
                id: 1,
                name: "Pedro Admin",
                email: "pedro.admin@example.com",
                role: "admin",
                is_active: true,
            })
        );
    });

    await page.route("**/solicitacoes/supervisors", async (route) => {
        await route.fulfill({
            status: 200,
            contentType: "application/json",
            body: JSON.stringify(supervisorMock),
        });
    });

    await page.route("**/solicitacoes/assigned", async (route) => {
        await route.fulfill({
            status: 200,
            contentType: "application/json",
            body: JSON.stringify([
                makeAssignedRequest({
                    id: 201,
                    requesterName: "Bruno Lima",
                    requesterEmail: "bruno.lima@example.com",
                }),
            ]),
        });
    });

    await page.route("**/solicitacoes/201/status", async (route) => {
        await route.fulfill({
            status: 200,
            contentType: "application/json",
            body: JSON.stringify({
                message: "Solicitação atualizada com sucesso.",
                request: makeAssignedRequest({
                    id: 201,
                    requesterName: "Bruno Lima",
                    requesterEmail: "bruno.lima@example.com",
                    status: "rejeitada",
                    statusLabel: "Rejeitada",
                    updatedAtLabel: "25/05/2026, 19:20",
                }),
            }),
        });
    });

    await page.goto("/requests");
    await page.getByRole("button", { name: "Gerenciar Solicitações" }).click();
    await page.getByRole("button", { name: "Rejeitar" }).click();

    await expect(page.getByText("Rejeitada")).toBeVisible();
    await expect(page.getByText("Solicitação já analisada.")).toBeVisible();
});