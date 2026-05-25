import { Request, Response } from "express";
import { UsersRepository } from "../repositories/user";
import { GetCollaboratorsUseCase } from "../useCases/colaboradores/getCollaborators";

export class ColaboradoresController {
    async getAll(req: Request, res: Response) {
        try {
            const userId = Number(req.user?.id);

            if (!Number.isInteger(userId)) {
                return res.status(401).json({
                    message: "Contexto de usuario invalido.",
                });
            }

            const usersRepository = new UsersRepository();
            const useCase = new GetCollaboratorsUseCase(usersRepository);
            const collaborators = await useCase.execute({ userId });

            return res.status(200).json(collaborators);
        } catch (error) {
            if (error instanceof Error) {
                if (error.message === "Usuario nao encontrado.") {
                    return res.status(404).json({ message: error.message });
                }

                if (
                    error.message === "Usuario inativo." ||
                    error.message === "Acesso negado."
                ) {
                    return res.status(403).json({ message: error.message });
                }
            }

            console.error(error);

            return res.status(500).json({
                message: "Erro interno ao buscar colaboradores.",
            });
        }
    }
}