import { defineConfig } from "vitest/config";

export default defineConfig({
    test: {
        include: ["__tests__/**/*.test.ts"],
        exclude: ["dist", "node_modules"],
    },
});
import { Request, Response } from "express";

import { TimeEntriesRepository } from "../repositories/timeEntry";
import { UsersRepository } from "../repositories/user";
import { GetTodayPointSummaryUseCase } from "../useCases/ponto/getTodayPointSummary";
import { RegisterTimeEntryUseCase } from "../useCases/ponto/registerTimeEntry";
import { GetPointHistoryUseCase } from "../useCases/ponto/getPointHistory";

export class PontoController {

    async getToday(req: Request, res: Response) {
        try {
            const userId = Number(req.user?.id);

            if (!Number.isInteger(userId)) {
                return res.status(401).json({
                    message: "ID de usuário inválido.",
                });
            }

            const usersRepository = new UsersRepository();
            const timeEntriesRepository = new TimeEntriesRepository();
            const getTodayPointSummaryUseCase = new GetTodayPointSummaryUseCase(
                usersRepository,
                timeEntriesRepository
            );

            const summary = await getTodayPointSummaryUseCase.execute({ userId });

            return res.status(200).json(summary);
        } catch (error) {
            return handlePontoError(error, res, "Erro interno ao buscar o resumo de ponto.");
        }
    }

    async register(req: Request, res: Response) {
        try {
            const userId = Number(req.user?.id);
            const { action } = req.body;

            if (!Number.isInteger(userId)) {
                return res.status(401).json({
                    message: "Contexto de usuário inválido.",
                });
            }

            const usersRepository = new UsersRepository();
            const timeEntriesRepository = new TimeEntriesRepository();
            const registerTimeEntryUseCase = new RegisterTimeEntryUseCase(
                usersRepository,
                timeEntriesRepository
            );

            const summary = await registerTimeEntryUseCase.execute({ userId, action });

            return res.status(201).json({
                message: "Ponto registrado com sucesso.",
                summary,
            });
        } catch (error) {
            return handlePontoError(error, res, "Erro interno ao registrar a batida de ponto.");
        }
    }

    async getHistory(req: Request, res: Response) {
        try {
            const userId = Number(req.user?.id);

            if (!Number.isInteger(userId)) {
                return res.status(401).json({
                    message: "Contexto de usuário inválido.",
                });
            }

            const usersRepository = new UsersRepository();
            const timeEntriesRepository = new TimeEntriesRepository();
            const getPointHistoryUseCase = new GetPointHistoryUseCase(
                usersRepository,
                timeEntriesRepository
            );

            const history = await getPointHistoryUseCase.execute({ userId });

            return res.status(200).json(history);
        } catch (error) {
            return handlePontoError(error, res, "Erro interno ao buscar o histórico de ponto.");
        }
    }
}

function handlePontoError(error: unknown, res: Response, fallbackMessage: string) {
    if (error instanceof Error) {
        if (
            error.message === "É necessário informar a ação." ||
            error.message === "Ação de ponto inválida."
        ) {
            return res.status(400).json({ message: error.message });
        }

        if (error.message === "Usuário inativo.") {
            return res.status(403).json({ message: error.message });
        }

        if (error.message === "Usuário não encontrado.") {
            return res.status(404).json({ message: error.message });
        }

        if (error.message === "Ação de ponto não permitida para o momento atual.") {
            return res.status(409).json({ message: error.message });
        }
    }

    console.error(error);

    return res.status(500).json({
        message: fallbackMessage,
    });
}