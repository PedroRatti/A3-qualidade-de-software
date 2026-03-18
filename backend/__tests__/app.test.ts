import request from "supertest";
import { describe, expect, it } from "vitest";
import app from "../src/app";

describe("GET /", () => {
    it("deve retornar status 200 e a mensagem do endpoint raiz", async () => {
        const response = await request(app).get("/");

        expect(response.status).toBe(200);
        expect(response.body).toEqual({
            message: "Servidor de EquipeHub está rodando!",
        });
    });
});