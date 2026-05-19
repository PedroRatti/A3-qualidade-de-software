import { Request, Response } from "express";
import { RequestsRepository } from "../repositories/request";
import { UsersRepository } from "../repositories/user";
import { CreateRequestUseCase } from "../useCases/solicitacoes/createRequest";
import { GetRequestHistoryUseCase } from "../useCases/solicitacoes/getRequestHistory";
import { GetAvailableSupervisorsUseCase } from "../useCases/solicitacoes/getAvailableSupervisors";

export class SolicitacoesController {
    async create(req: Request, res: Response) {
        try {
            const userId = Number(req.user?.id);
            const { type, startDate, endDate, reason, supervisorId } = req.body;
            const attachment = req.file;

            if (!Number.isInteger(userId)) {
                return res.status(401).json({ message: "Contexto de usuário inválido." });
            }

            const usersRepository = new UsersRepository();
            const requestsRepository = new RequestsRepository();
            const useCase = new CreateRequestUseCase(usersRepository, requestsRepository);

            const request = await useCase.execute({
                userId,
                supervisorId: Number(supervisorId),
                type,
                startDate,
                endDate,
                reason,
                attachment,
            });

            return res.status(201).json({
                message: "Solicitação enviada com sucesso.",
                request,
            });
        } catch (error) {
            return handleRequestError(error, res, "Erro interno ao criar a solicitação.");
        }
    }

    async getHistory(req: Request, res: Response) {
        try {
            const userId = Number(req.user?.id);

            if (!Number.isInteger(userId)) {
                return res.status(401).json({ message: "Contexto de usuário inválido." });
            }

            const usersRepository = new UsersRepository();
            const requestsRepository = new RequestsRepository();
            const useCase = new GetRequestHistoryUseCase(usersRepository, requestsRepository);

            const history = await useCase.execute({ userId });

            return res.status(200).json(history);
        } catch (error) {
            return handleRequestError(error, res, "Erro interno ao buscar o histórico de solicitações.");
        }
    }

    async getSupervisors(_req: Request, res: Response) {
        try {
            const usersRepository = new UsersRepository();
            const useCase = new GetAvailableSupervisorsUseCase(usersRepository);
            const supervisors = await useCase.execute();

            return res.status(200).json(supervisors);
        } catch (error) {
            console.error(error);

            return res.status(500).json({
                message: "Erro interno ao buscar supervisores.",
            });
        }
    }
}

function handleRequestError(error: unknown, res: Response, fallbackMessage: string) {
    if (error instanceof Error) {
        const badRequestMessages = [
            "É necessário informar o tipo da solicitação.",
            "Tipo de solicitação inválido.",
            "É necessário informar o supervisor.",
            "Supervisor inválido.",
            "Supervisor inativo.",
            "Período inválido.",
            "A data inicial não pode ser maior que a data final.",
            "É necessário informar o motivo da solicitação.",
            "É necessário anexar o atestado para abono de falta.",
        ];

        if (badRequestMessages.includes(error.message)) {
            return res.status(400).json({ message: error.message });
        }

        if (error.message === "Usuario inativo.") {
            return res.status(403).json({ message: error.message });
        }

        if (error.message === "Usuario nao encontrado.") {
            return res.status(404).json({ message: error.message });
        }
    }

    console.error(error);

    return res.status(500).json({ message: fallbackMessage });
}