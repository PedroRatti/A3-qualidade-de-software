import { test, expect } from "@playwright/test";

test("deve fazer a request para o backend e exibir a mensagem na tela", async ({ page }) => {
    const responsePromise = page.waitForResponse(
        (response) =>
            response.url() === "http://localhost:3000/" &&
            response.request().method() === "GET"
    );

    await page.goto("/");

    const response = await responsePromise;
    const body = await response.json();

    expect(response.status()).toBe(200);
    expect(body).toEqual({
        message: "Servidor de EquipeHub está rodando!",
    });

    await expect(page.getByRole("heading", { name: "EquipeHub" })).toBeVisible();
    await expect(page.getByText("Servidor de EquipeHub está rodando!")).toBeVisible();
});