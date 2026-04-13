import request from "supertest";
import { describe, it, expect, beforeEach, vi } from "vitest";
import express from "express";

const loginMock = vi.fn();

vi.mock("../../src/controllers/login", () => {
    class AuthController {
        login = loginMock;
    }

    return { AuthController };
});

describe("Auth routes", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it("deve chamar o controller no POST /auth/login", async () => {
        loginMock.mockImplementation(async (req: any, res: any) => {
            return res.status(200).json({
                message: "Login realizado com sucesso.",
                token: "fake-token",
                user: {
                    id: 1,
                    nome: "Pedro Admin",
                    email: "pedro.admin@example.com",
                    role: "admin",
                    is_active: true,
                },
            });
        });

        const { default: authRoutes } = await import("../../src/routes/auth");

        const app = express();
        app.use(express.json());
        app.use("/auth", authRoutes);

        const response = await request(app).post("/auth/login").send({
            email: "pedro.admin@example.com",
            password: "pedro123",
        });

        expect(response.status).toBe(200);
        expect(response.body).toEqual({
            message: "Login realizado com sucesso.",
            token: "fake-token",
            user: {
                id: 1,
                nome: "Pedro Admin",
                email: "pedro.admin@example.com",
                role: "admin",
                is_active: true,
            },
        });

        expect(loginMock).toHaveBeenCalledTimes(1);
    });

    it("deve retornar 401 quando o controller responder credenciais inválidas", async () => {
        loginMock.mockImplementation(async (req: any, res: any) => {
            return res.status(401).json({
                message: "Credenciais inválidas.",
            });
        });

        const { default: authRoutes } = await import("../../src/routes/auth");

        const app = express();
        app.use(express.json());
        app.use("/auth", authRoutes);

        const response = await request(app).post("/auth/login").send({
            email: "pedro.admin@example.com",
            password: "senha-errada",
        });

        expect(response.status).toBe(401);
        expect(response.body).toEqual({
            message: "Credenciais inválidas.",
        });

        expect(loginMock).toHaveBeenCalledTimes(1);
    });

    it("deve retornar 400 quando o controller responder dados obrigatórios ausentes", async () => {
        loginMock.mockImplementation(async (req: any, res: any) => {
            return res.status(400).json({
                message: "É necessário informar o Email",
            });
        });

        const { default: authRoutes } = await import("../../src/routes/auth");

        const app = express();
        app.use(express.json());
        app.use("/auth", authRoutes);

        const response = await request(app).post("/auth/login").send({
            email: "",
            password: "",
        });

        expect(response.status).toBe(400);
        expect(response.body).toEqual({
            message: "É necessário informar o Email",
        });

        expect(loginMock).toHaveBeenCalledTimes(1);
    });
});