import { expect, test } from "@playwright/test";

test.beforeEach(async ({ page }) => {
    await page.addInitScript(() => {
        localStorage.clear();
    });
});

test("deve fazer login com sucesso e redirecionar para overview", async ({ page }) => {
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
                token: "fake-jwt-token",
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

    await page.goto("/");

    await page.getByLabel("Email").fill("pedro.admin@example.com");
    await page.getByLabel("Senha").fill("pedro123");
    await page.getByRole("button", { name: "Entrar" }).click();

    await expect(page).toHaveURL(/\/overview$/);
    await expect(page.getByRole("heading", { name: "Overview" })).toBeVisible();
    await expect
        .poll(() => page.evaluate(() => localStorage.getItem("token")))
        .toBe("fake-jwt-token");
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