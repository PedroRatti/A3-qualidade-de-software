import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";

import { LoginUseCase } from "../../src/useCases/login";
import { UsersRepository, User } from "../../src/repositories/user";

class FakeUsersRepository implements Pick<UsersRepository, "findByEmail"> {
    private user: User | null = null;

    setUser(user: User | null) {
        this.user = user;
    }

    async findByEmail(email: string): Promise<User | null> {
        if (this.user?.email === email) {
            return this.user;
        }

        return null;
    }
}

describe("LoginUseCase", () => {
    let usersRepository: FakeUsersRepository;
    let loginUseCase: LoginUseCase;

    beforeEach(() => {
        usersRepository = new FakeUsersRepository();
        loginUseCase = new LoginUseCase(usersRepository);
        process.env.AUTH_JWT_SECRET = "test-secret";
    });

    afterEach(() => {
        vi.restoreAllMocks();
        delete process.env.AUTH_JWT_SECRET;
    });

    it("deve retornar token e usuário quando as credenciais forem válidas", async () => {
        usersRepository.setUser({
            id: 1,
            name: "Pedro Admin",
            email: "pedro.admin@example.com",
            password: "pedro123",
            cpf: "12345678900",
            number: "48999990001",
            birth: "1995-05-17",
            role: "admin",
            is_active: true,
        });

        const result = await loginUseCase.execute({
            email: "pedro.admin@example.com",
            password: "pedro123",
        });

        expect(result).toHaveProperty("token");
        expect(typeof result.token).toBe("string");
        expect(result.user).toEqual({
            id: 1,
            name: "Pedro Admin",
            email: "pedro.admin@example.com",
            cpf: "12345678900",
            number: "48999990001",
            birth: "1995-05-17",
            role: "admin",
            is_active: true,
        });
    });

    it("deve falhar quando o email não for informado", async () => {
        await expect(
            loginUseCase.execute({
                email: "",
                password: "pedro123",
            })
        ).rejects.toThrow("É necessário informar o Email");
    });

    it("deve falhar quando a senha não for informada", async () => {
        await expect(
            loginUseCase.execute({
                email: "pedro.admin@example.com",
                password: "",
            })
        ).rejects.toThrow("É necessário informar a senha");
    });
    
    it("deve falhar quando o usuário não existir", async () => {
        await expect(
            loginUseCase.execute({
                email: "naoexiste@example.com",
                password: "123456",
            })
        ).rejects.toThrow("Credenciais inválidas.");
    });

    it("deve falhar quando o usuário estiver inativo", async () => {
        usersRepository.setUser({
            id: 1,
            name: "Pedro Admin",
            email: "pedro.admin@example.com",
            password: "pedro123",
            cpf: "12345678900",
            number: "48999990001",
            birth: "1995-05-17",
            role: "admin",
            is_active: false,
        });

        await expect(
            loginUseCase.execute({
                email: "pedro.admin@example.com",
                password: "pedro123",
            })
        ).rejects.toThrow("Usuário inativo.");
    });

    it("deve falhar quando a senha estiver incorreta", async () => {
        usersRepository.setUser({
            id: 1,
            name: "Pedro Admin",
            email: "pedro.admin@example.com",
            password: "pedro123",
            cpf: "12345678900",
            number: "48999990001",
            birth: "1995-05-17",
            role: "admin",
            is_active: true,
        });

        await expect(
            loginUseCase.execute({
                email: "pedro.admin@example.com",
                password: "senha-errada",
            })
        ).rejects.toThrow("Credenciais inválidas.");
    });

    it("deve falhar quando AUTH_JWT_SECRET não estiver configurado", async () => {
        delete process.env.AUTH_JWT_SECRET;

        usersRepository.setUser({
            id: 1,
            name: "Pedro Admin",
            email: "pedro.admin@example.com",
            password: "pedro123",
            cpf: "12345678900",
            number: "48999990001",
            birth: "1995-05-17",
            role: "admin",
            is_active: true,
        });

        await expect(
            loginUseCase.execute({
                email: "pedro.admin@example.com",
                password: "pedro123",
            })
        ).rejects.toThrow("AUTH_JWT_SECRET não configurado.");
    });
});
