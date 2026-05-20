import express from "express";
import jwt from "jsonwebtoken";
import request from "supertest";
import { beforeEach, describe, expect, it, vi } from "vitest";

const createMock = vi.fn();
const getHistoryMock = vi.fn();
const getSupervisorsMock = vi.fn();

vi.mock("../../src/controllers/solicitacoes", () => {
    class SolicitacoesController {
        create = createMock;
        getHistory = getHistoryMock;
        getSupervisors = getSupervisorsMock;
    }

    return { SolicitacoesController };
});

vi.mock("../../src/middleware/uploadRequestAttachment", () => ({
    uploadRequestAttachment: {
        single: () => (_req: unknown, _res: unknown, next: () => void) => next(),
    },
}));

describe("Solicitações routes", () => {
    beforeEach(() => {
        vi.clearAllMocks();
        process.env.AUTH_JWT_SECRET = "test-secret";
    });

    it("deve bloquear acesso sem token no GET /solicitacoes/history", async () => {
        const { default: solicitacoesRoutes } = await import("../../src/routes/solicitacoes");

        const app = express();
        app.use(express.json());
        app.use("/solicitacoes", solicitacoesRoutes);

        const response = await request(app).get("/solicitacoes/history");

        expect(response.status).toBe(401);
        expect(response.body).toEqual({
            message: "Token não informado.",
        });
    });

    it("deve chamar o controller no GET /solicitacoes/supervisors com token valido", async () => {
        getSupervisorsMock.mockImplementation(async (_req: unknown, res: any) => {
            return res.status(200).json([
                {
                    id: 1,
                    name: "Pedro Admin",
                    email: "pedro.admin@example.com",
                },
            ]);
        });

        const { default: solicitacoesRoutes } = await import("../../src/routes/solicitacoes");
        const token = jwt.sign(
            {
                sub: 7,
                email: "ana.souza@example.com",
                role: "employee",
            },
            process.env.AUTH_JWT_SECRET as string,
            { expiresIn: "1d" }
        );

        const app = express();
        app.use(express.json());
        app.use("/solicitacoes", solicitacoesRoutes);

        const response = await request(app)
            .get("/solicitacoes/supervisors")
            .set("Authorization", `Bearer ${token}`);

        expect(response.status).toBe(200);
        expect(getSupervisorsMock).toHaveBeenCalledTimes(1);
        expect(response.body).toEqual([
            {
                id: 1,
                name: "Pedro Admin",
                email: "pedro.admin@example.com",
            },
        ]);
    });

    it("deve chamar o controller no POST /solicitacoes com token válido", async () => {
        createMock.mockImplementation(async (_req: unknown, res: any) => {
            return res.status(201).json({
                message: "Solicitação enviada com sucesso.",
                request: {
                    id: 100,
                    type: "ferias",
                    typeLabel: "Ferias",
                    startDate: "2026-06-10",
                    endDate: "2026-06-20",
                    periodLabel: "10/06/2026 ate 20/06/2026",
                    reason: "Ferias programadas",supervisorId: 1,
                    supervisorName: "Pedro Admin",
                    attachmentUrl: null,
                    status: "pendente",
                    statusLabel: "Pendente",
                    createdAtLabel: "12/05/2026, 10:00",
                },
            });
        });

        const { default: solicitacoesRoutes } = await import("../../src/routes/solicitacoes");
        const token = jwt.sign(
            {
                sub: 7,
                email: "ana.souza@example.com",
                role: "employee",
            },
            process.env.AUTH_JWT_SECRET as string,
            { expiresIn: "1d" }
        );

        const app = express();
        app.use(express.json());
        app.use("/solicitacoes", solicitacoesRoutes);

        const response = await request(app)
            .post("/solicitacoes")
            .set("Authorization", `Bearer ${token}`)
            .send({
                supervisorId: 1,
                type: "ferias",
                startDate: "2026-06-10",
                endDate: "2026-06-20",
                reason: "Ferias programadas",
            });

        expect(response.status).toBe(201);
        expect(createMock).toHaveBeenCalledTimes(1);
        expect(response.body.message).toBe("Solicitação enviada com sucesso.");
        expect(response.body.request.supervisorName).toBe("Pedro Admin");
    });
});