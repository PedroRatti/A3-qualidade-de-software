import jwt from "jsonwebtoken";

import { UsersRepository } from "../repositories/user";

type LoginRequest = {
    email: string;
    password: string;
};

export class LoginUseCase {
    constructor(private usersRepository: UsersRepository) { }

    async execute({ email, password }: LoginRequest) {
        if (!email?.trim()) throw new Error("É necessário informar o Email");
        if (!password?.trim()) throw new Error("É necessário informar a senha");

        const user = await this.usersRepository.findByEmail(email);

        if (!user) throw new Error("Credenciais inválidas.");
        if (!user.is_active) throw new Error("Usuário inativo.");
        if (user.password !== password) throw new Error("Credenciais inválidas.");

        const secret = process.env.AUTH_JWT_SECRET;
        if (!secret) throw new Error("AUTH_JWT_SECRET não configurado.");

        const token = jwt.sign(
            {
                sub: user.id,
                email: user.email,
                role: user.role,
            },
            secret,
            { expiresIn: "1d" }
        );

        return {
            token,
            user: {
                id: user.id,
                nome: user.nome,
                email: user.email,
                role: user.role,
                is_active: user.is_active,
            },
        };
    }
}