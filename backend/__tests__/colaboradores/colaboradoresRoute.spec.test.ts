import express from "express";
import jwt from "jsonwebtoken";
import request from "supertest";
import { beforeEach, describe, expect, it, vi } from "vitest";

const getAllMock = vi.fn();

vi.mock("../../src/controllers/colaboradores", () => {
    class ColaboradoresController {
        getAll = getAllMock;
    }

    return { ColaboradoresController };
});

describe("Colaboradores routes", () => {
    beforeEach(() => {
        vi.clearAllMocks();
        process.env.AUTH_JWT_SECRET = "test-secret";
    });

    it("deve bloquear acesso sem token no GET /colaboradores", async () => {
        const { default: colaboradoresRoutes } = await import(
            "../../src/routes/colaboradores"
        );

        const app = express();
        app.use(express.json());
        app.use("/colaboradores", colaboradoresRoutes);

        const response = await request(app).get("/colaboradores");

        expect(response.status).toBe(401);
        expect(response.body).toEqual({
            message: "Token não informado.",
        });
    });

    it("deve chamar o controller no GET /colaboradores com token válido", async () => {
        getAllMock.mockImplementation(async (_req: unknown, res: any) => {
            return res.status(200).json([
                {
                    id: 7,
                    name: "Ana Souza",
                    email: "ana.souza@example.com",
                    cpf: "12345678901",
                    number: "48999990002",
                    birth: "1998-03-12",
                    role: "employee",
                    is_active: true,
                },
            ]);
        });

        const { default: colaboradoresRoutes } = await import(
            "../../src/routes/colaboradores"
        );

        const token = jwt.sign(
            {
                sub: 1,
                email: "pedro.admin@example.com",
                role: "admin",
            },
            process.env.AUTH_JWT_SECRET as string,
            { expiresIn: "1d" }
        );

        const app = express();
        app.use(express.json());
        app.use("/colaboradores", colaboradoresRoutes);

        const response = await request(app)
            .get("/colaboradores")
            .set("Authorization", `Bearer ${token}`);

        expect(response.status).toBe(200);
        expect(getAllMock).toHaveBeenCalledTimes(1);
        expect(response.body[0].name).toBe("Ana Souza");
    });
});