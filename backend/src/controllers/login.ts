import { Request, Response } from "express";

import { UsersRepository } from "../repositories/user";
import { LoginUseCase } from "../useCases/login";

export class AuthController {
    async login(req: Request, res: Response) {
        try {
            const { email, password } = req.body;

            const usersRepository = new UsersRepository();
            const loginUseCase = new LoginUseCase(usersRepository);

            const result = await loginUseCase.execute({ email, password });

            return res.status(200).json({
                message: "Login realizado com sucesso.",
                ...result,
            });
        } catch (error) {
            if (error instanceof Error) {
                if (
                    error.message === "É necessário informar o Email" ||
                    error.message === "É necessário informar a senha"
                ) {
                    return res.status(400).json({ message: error.message });
                }

                if (error.message === "Usuário inativo.") {
                    return res.status(403).json({ message: error.message });
                }

                if (error.message === "Credenciais inválidas.") {
                    return res.status(401).json({ message: error.message });
                }

                if (error.message === "AUTH_JWT_SECRET não configurado.") {
                    return res.status(500).json({ message: error.message });
                }
            }

            console.error(error);

            return res.status(500).json({
                message: "Erro interno ao realizar login.",
            });
        }
    }
}