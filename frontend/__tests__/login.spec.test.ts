import { Buffer } from "node:buffer";
import { expect, test } from "@playwright/test";

function createToken(overrides: Record<string, unknown> = {}) {
    const header = Buffer.from(
        JSON.stringify({ alg: "HS256", typ: "JWT" })
    ).toString("base64url");

    const payload = Buffer.from(
        JSON.stringify({
            sub: 1,
            email: "pedro.admin@example.com",
            role: "admin",
            exp: Math.floor(Date.now() / 1000) + 60 * 60,
            ...overrides,
        })
    ).toString("base64url");

    return `${header}.${payload}.signature`;
}

test.beforeEach(async ({ page }) => {
    await page.addInitScript(() => {
        localStorage.clear();
    });
});

test("deve fazer login com sucesso e redirecionar para overview", async ({ page }) => {
    const validToken = createToken();

    await page.route("**/auth/login", async (route) => {
        expect(route.request().method()).toBe("POST");
        expect(route.request().postDataJSON()).toEqual({
            email: "pedro.admin@example.com",
            password: "pedro123",
        });

        await route.fulfill({
            status: 200,
            contentType: "application/json",
            body: JSON.stringify({
                message: "Login realizado com sucesso.",
                token: validToken,
                user: {
                    id: 1,
                    name: "Pedro Admin",
                    email: "pedro.admin@example.com",
                    role: "admin",
                    is_active: true,
                },
            }),
        });
    });

    await page.route("**/ponto/today", async (route) => {
        await route.fulfill({
            status: 200,
            contentType: "application/json",
            body: JSON.stringify({
                employeeName: "Pedro Admin",
                status: "aguardando-entrada",
                shiftLabel: "Jornada prevista: 08:00 - 17:00",
                workedTime: "00:00",
                currentDay: "segunda-feira, 01 de junho de 2026",
                currentTime: "08:00",
                availableActions: ["clock-in"],
                records: [
                    { id: 1, label: "Entrada", timestamp: "--:--", kind: "entrada" },
                    { id: 2, label: "Início da pausa", timestamp: "--:--", kind: "pausa" },
                    { id: 3, label: "Fim da pausa", timestamp: "--:--", kind: "retorno" },
                    { id: 4, label: "Saída", timestamp: "--:--", kind: "saida" },
                ],
            }),
        });
    });

    await page.route("**/solicitacoes/assigned", async (route) => {
        await route.fulfill({
            status: 200,
            contentType: "application/json",
            body: JSON.stringify([]),
        });
    });

    await page.goto("/");

    await page.getByLabel("Email").fill("pedro.admin@example.com");
    await page.getByLabel("Senha").fill("pedro123");
    await page.getByRole("button", { name: "Entrar" }).click();

    await expect(page).toHaveURL(/\/overview$/);
    await expect(page.getByRole("heading", { name: "Overview" })).toBeVisible();
    await expect
        .poll(() => page.evaluate(() => localStorage.getItem("token")))
        .toBe(validToken);
});

test("deve exibir erro quando o backend rejeitar as credenciais", async ({ page }) => {
    await page.route("**/auth/login", async (route) => {
        await route.fulfill({
            status: 401,
            contentType: "application/json",
            body: JSON.stringify({
                message: "Credenciais inválidas.",
            }),
        });
    });

    await page.goto("/");

    await page.getByLabel("Email").fill("pedro.admin@example.com");
    await page.getByLabel("Senha").fill("senha-errada");
    await page.getByRole("button", { name: "Entrar" }).click();

    await expect(page).toHaveURL(/\/$/);
    await expect(page.getByText("Credenciais inválidas.")).toBeVisible();
});