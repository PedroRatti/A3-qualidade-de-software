import express from "express";
import jwt from "jsonwebtoken";
import request from "supertest";
import { beforeEach, describe, expect, it, vi } from "vitest";

const getTodayMock = vi.fn();
const registerMock = vi.fn();

vi.mock("../../src/controllers/ponto", () => {
    class PontoController {
        getToday = getTodayMock;
        register = registerMock;
    }

    return { PontoController };
});

describe("Ponto routes", () => {
    beforeEach(() => {
        vi.clearAllMocks();
        process.env.AUTH_JWT_SECRET = "test-secret";
    });

    it("deve bloquear acesso sem token no GET /ponto/today", async () => {
        const { default: pontoRoutes } = await import("../../src/routes/ponto");

        const app = express();
        app.use(express.json());
        app.use("/ponto", pontoRoutes);

        const response = await request(app).get("/ponto/today");

        expect(response.status).toBe(401);
        expect(response.body).toEqual({
            message: "Token não informado.",
        });
    });

    it("deve chamar o controller no GET /ponto/today com token válido", async () => {
        getTodayMock.mockImplementation(async (_req: unknown, res: any) => {
            return res.status(200).json({
                employeeName: "Ana Souza",
                status: "aguardando-entrada",
                shiftLabel: "Jornada prevista: 08:00 - 17:00",
                workedTime: "00:00",
                currentDay: "segunda-feira, 05 de maio de 2026",
                currentTime: "08:00",
                availableActions: ["clock-in"],
                records: [],
            });
        });

        const { default: pontoRoutes } = await import("../../src/routes/ponto");
        const token = jwt.sign(
            {
                sub: 1,
                email: "ana.souza@example.com",
                role: "employee",
            },
            process.env.AUTH_JWT_SECRET as string,
            { expiresIn: "1d" }
        );

        const app = express();
        app.use(express.json());
        app.use("/ponto", pontoRoutes);

        const response = await request(app)
            .get("/ponto/today")
            .set("Authorization", `Bearer ${token}`);

        expect(response.status).toBe(200);
        expect(getTodayMock).toHaveBeenCalledTimes(1);
        expect(response.body.availableActions).toEqual(["clock-in"]);
    });

    it("deve chamar o controller no POST /ponto/register com token válido", async () => {
        registerMock.mockImplementation(async (_req: unknown, res: any) => {
            return res.status(201).json({
                message: "Ponto registrado com sucesso.",
                summary: {
                    employeeName: "Ana Souza",
                    status: "em-jornada",
                    shiftLabel: "Jornada prevista: 08:00 - 17:00",
                    workedTime: "00:00",
                    currentDay: "segunda-feira, 05 de maio de 2026",
                    currentTime: "08:00",
                    availableActions: ["start-break", "clock-out"],
                    records: [
                        {
                            id: 1,
                            label: "Entrada",
                            timestamp: "08:00",
                            kind: "entrada",
                        },
                    ],
                },
            });
        });

        const { default: pontoRoutes } = await import("../../src/routes/ponto");
        const token = jwt.sign(
            {
                sub: 1,
                email: "ana.souza@example.com",
                role: "employee",
            },
            process.env.AUTH_JWT_SECRET as string,
            { expiresIn: "1d" }
        );

        const app = express();
        app.use(express.json());
        app.use("/ponto", pontoRoutes);

        const response = await request(app)
            .post("/ponto/register")
            .set("Authorization", `Bearer ${token}`)
            .send({ action: "clock-in" });

        expect(response.status).toBe(201);
        expect(registerMock).toHaveBeenCalledTimes(1);
        expect(response.body.message).toBe("Ponto registrado com sucesso.");
    });
});