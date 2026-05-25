import { expect, test } from "@playwright/test";

const collaboratorsMock = [
    {
        id: 2,
        name: "Ana Admin",
        email: "ana.admin@example.com",
        cpf: "12345678901",
        number: "48999990002",
        birth: "1998-03-12T03:00:00.000Z",
        role: "admin",
        is_active: true,
    },
    {
        id: 3,
        name: "Bruno Lima",
        email: "bruno.lima@example.com",
        cpf: "12345678902",
        number: "48999990003",
        birth: "1997-07-25T03:00:00.000Z",
        role: "employee",
        is_active: true,
    },
];

test("admin deve ver o botão de colaboradores na sidebar", async ({ page }) => {
    await page.addInitScript(() => {
        localStorage.setItem("token", "fake-jwt-token");
        localStorage.setItem(
            "user",
            JSON.stringify({
                id: 1,
                name: "Pedro Admin",
                email: "pedro.admin@example.com",
                cpf: "12345678900",
                number: "48999990001",
                birth: "1995-05-17",
                role: "admin",
                is_active: true,
            })
        );
    });

    await page.route("**/colaboradores", async (route) => {
        await route.fulfill({
            status: 200,
            contentType: "application/json",
            body: JSON.stringify(collaboratorsMock),
        });
    });

    await page.goto("/collaborators");

    await expect(
        page.getByRole("button", { name: "Colaboradores" })
    ).toBeVisible();
});

test("employee não deve ver o botão de colaboradores na sidebar", async ({ page }) => {
    await page.addInitScript(() => {
        localStorage.setItem("token", "fake-jwt-token");
        localStorage.setItem(
            "user",
            JSON.stringify({
                id: 7,
                name: "Ana Souza",
                email: "ana.souza@example.com",
                cpf: "12345678901",
                number: "48999990002",
                birth: "1998-03-12",
                role: "employee",
                is_active: true,
            })
        );
    });

    await page.goto("/requests");

    await expect(
        page.getByRole("button", { name: "Colaboradores" })
    ).toHaveCount(0);
});

test("admin deve carregar os cards de colaboradores", async ({ page }) => {
    await page.addInitScript(() => {
        localStorage.setItem("token", "fake-jwt-token");
        localStorage.setItem(
            "user",
            JSON.stringify({
                id: 1,
                name: "Pedro Admin",
                email: "pedro.admin@example.com",
                cpf: "12345678900",
                number: "48999990001",
                birth: "1995-05-17",
                role: "admin",
                is_active: true,
            })
        );
    });

    await page.route("**/colaboradores", async (route) => {
        await route.fulfill({
            status: 200,
            contentType: "application/json",
            body: JSON.stringify(collaboratorsMock),
        });
    });

    await page.goto("/collaborators");

    await expect(
        page.getByRole("heading", { name: "Colaboradores", level: 1 })
    ).toBeVisible();
    await expect(page.getByText("Ana Admin")).toBeVisible();
    await expect(page.getByText("bruno.lima@example.com")).toBeVisible();
    await expect(page.getByText("12/03/1998")).toBeVisible();
    await expect(page.getByText("25/07/1997")).toBeVisible();
});

test("deve exibir erro ao falhar na carga de colaboradores", async ({ page }) => {
    await page.addInitScript(() => {
        localStorage.setItem("token", "fake-jwt-token");
        localStorage.setItem(
            "user",
            JSON.stringify({
                id: 1,
                name: "Pedro Admin",
                email: "pedro.admin@example.com",
                cpf: "12345678900",
                number: "48999990001",
                birth: "1995-05-17",
                role: "admin",
                is_active: true,
            })
        );
    });

    await page.route("**/colaboradores", async (route) => {
        await route.fulfill({
            status: 403,
            contentType: "application/json",
            body: JSON.stringify({
                message: "Acesso negado.",
            }),
        });
    });

    await page.goto("/collaborators");

    await expect(
        page.getByText("Falha ao carregar colaboradores.")
    ).toBeVisible();
    await expect(page.getByText("Acesso negado.")).toBeVisible();
});

test("employee deve ser redirecionado ao tentar abrir /collaborators", async ({ page }) => {
    await page.addInitScript(() => {
        localStorage.setItem("token", "fake-jwt-token");
        localStorage.setItem(
            "user",
            JSON.stringify({
                id: 7,
                name: "Ana Souza",
                email: "ana.souza@example.com",
                cpf: "12345678901",
                number: "48999990002",
                birth: "1998-03-12",
                role: "employee",
                is_active: true,
            })
        );
    });

    await page.goto("/collaborators");

    await expect(page).toHaveURL(/\/overview$/);
});