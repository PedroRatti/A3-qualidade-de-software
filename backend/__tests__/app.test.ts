import request from "supertest";
import jwt from "jsonwebtoken";
import { afterEach, beforeEach, describe, expect, it } from "vitest";

import app from "../src/app";

describe("GET /service-health", () => {
    beforeEach(() => {
        process.env.AUTH_JWT_SECRET = "test-secret";
    });

    afterEach(() => {
        delete process.env.AUTH_JWT_SECRET;
    });

    it("deve retornar 401 quando o token nao for informado", async () => {
        const response = await request(app).get("/service-health");

        expect(response.status).toBe(401);
        expect(response.body).toEqual({
            message: "Token não informado.",
        });
    });

    it("deve retornar 200 e a mensagem quando o token for valido", async () => {
        const token = jwt.sign(
            {
                sub: 1,
                email: "pedro.admin@example.com",
                role: "admin",
            },
            process.env.AUTH_JWT_SECRET as string,
            { expiresIn: "1d" }
        );

        const response = await request(app)
            .get("/service-health")
            .set("Authorization", `Bearer ${token}`);;

        expect(response.status).toBe(200);
        expect(response.body).toEqual({
            message: "Servidor de EquipeHub está rodando!",
        });
    });

    it("deve retornar 401 quando o token estiver mal formatado", async () => {
        const response = await request(app)
            .get("/service-health")
            .set("Authorization", "Token abc123");

        expect(response.status).toBe(401);
        expect(response.body).toEqual({
            message: "Token mal formatado.",
        });
    });

    it("deve retornar 401 quando o token for invalido", async () => {
        const response = await request(app)
            .get("/service-health")
            .set("Authorization", "Bearer token-invalido");

        expect(response.status).toBe(401);
        expect(response.body).toEqual({
            message: "Token inválido ou expirado.",
        });
    });

    it("deve retornar 401 quando o token estiver expirado", async () => {
        const expiredToken = jwt.sign(
            {
                sub: 1,
                email: "pedro.admin@example.com",
                role: "admin",
            },
            process.env.AUTH_JWT_SECRET as string,
            { expiresIn: -1 }
        );

        const response = await request(app)
            .get("/service-health")
            .set("Authorization", `Bearer ${expiredToken}`);

        expect(response.status).toBe(401);
        expect(response.body).toEqual({
            message: "Token inválido ou expirado.",
        });
    });
});
