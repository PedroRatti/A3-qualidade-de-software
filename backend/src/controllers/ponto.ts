import { Request, Response } from "express";

import { TimeEntriesRepository } from "../repositories/timeEntry";
import { UsersRepository } from "../repositories/user";
import { GetPointHistoryUseCase } from "../useCases/ponto/getPointHistory";
import { GetTeamPointHistoryUseCase } from "../useCases/ponto/getTeamPointHistory";
import { GetTodayPointSummaryUseCase } from "../useCases/ponto/getTodayPointSummary";
import { RegisterTimeEntryUseCase } from "../useCases/ponto/registerTimeEntry";

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

    async getTeamHistory(req: Request, res: Response) {
        try {
            const requesterUserId = Number(req.user?.id);
            const daysBack =
                req.query.daysBack === undefined ? undefined : Number(req.query.daysBack);

            if (!Number.isInteger(requesterUserId)) {
                return res.status(401).json({
                    message: "Contexto de usuário inválido.",
                });
            }

            const usersRepository = new UsersRepository();
            const timeEntriesRepository = new TimeEntriesRepository();
            const getTeamPointHistoryUseCase = new GetTeamPointHistoryUseCase(
                usersRepository,
                timeEntriesRepository
            );

            const history = await getTeamPointHistoryUseCase.execute({
                requesterUserId,
                daysBack,
            });

            return res.status(200).json(history);
        } catch (error) {
            return handlePontoError(
                error,
                res,
                "Erro interno ao buscar o histórico de ponto da equipe."
            );
        }
    }
}

function handlePontoError(error: unknown, res: Response, fallbackMessage: string) {
    if (error instanceof Error) {
        if (
            error.message === "é necessário informar a ação." ||
            error.message === "Ação de ponto inválida." ||
            error.message === "Período de consulta inválido."
        ) {
            return res.status(400).json({ message: error.message });
        }

        if (error.message === "Usuário inativo." || error.message === "Acesso negado.") {
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