import { describe, expect, it } from "vitest";
import {
    type CollaboratorDirectoryItem,
    type User,
    UsersRepository,
} from "../../src/repositories/user";
import { GetCollaboratorsUseCase } from "../../src/useCases/colaboradores/getCollaborators";

function makeUser(overrides: Partial<User> = {}): User {
    return {
        id: 1,
        name: "Pedro Admin",
        email: "pedro.admin@example.com",
        password: "123456",
        cpf: "12345678900",
        number: "48999990001",
        birth: "1995-05-17",
        role: "admin",
        is_active: true,
        ...overrides,
    };
}

function makeCollaborator(
    overrides: Partial<CollaboratorDirectoryItem> = {}
): CollaboratorDirectoryItem {
    return {
        id: 7,
        name: "Ana Souza",
        email: "ana.souza@example.com",
        cpf: "12345678901",
        number: "48999990002",
        birth: "1998-03-12",
        role: "employee",
        is_active: true,
        ...overrides,
    };
}

describe("GetCollaboratorsUseCase", () => {
    it("deve listar colaboradores para um admin ativo", async () => {
        const usersRepository: Pick<
            UsersRepository,
            "findById" | "findDirectoryEntries"
        > = {
            findById: async () => makeUser({ id: 1, role: "admin" }),
            findDirectoryEntries: async () => [
                makeCollaborator(),
                makeCollaborator({
                    id: 8,
                    name: "Bruno Lima",
                    email: "bruno.lima@example.com",
                    cpf: "12345678902",
                }),
            ],
        };

        const useCase = new GetCollaboratorsUseCase(usersRepository);
        const result = await useCase.execute({ userId: 1 });

        expect(result).toHaveLength(2);
        expect(result[0].name).toBe("Ana Souza");
        expect(result[1].name).toBe("Bruno Lima");
    });

    it("deve bloquear usuário que não seja admin", async () => {
        const usersRepository: Pick<
            UsersRepository,
            "findById" | "findDirectoryEntries"
        > = {
            findById: async () => makeUser({ id: 7, role: "employee" }),
            findDirectoryEntries: async () => [],
        };

        const useCase = new GetCollaboratorsUseCase(usersRepository);

        await expect(useCase.execute({ userId: 7 })).rejects.toThrow(
            "Acesso negado."
        );
    });

    it("deve bloquear usuário inativo", async () => {
        const usersRepository: Pick<
            UsersRepository,
            "findById" | "findDirectoryEntries"
        > = {
            findById: async () => makeUser({ is_active: false }),
            findDirectoryEntries: async () => [],
        };

        const useCase = new GetCollaboratorsUseCase(usersRepository);

        await expect(useCase.execute({ userId: 1 })).rejects.toThrow(
            "Usuario inativo."
        );
    });

    it("deve falhar quando o usuário não existir", async () => {
        const usersRepository: Pick<
            UsersRepository,
            "findById" | "findDirectoryEntries"
        > = {
            findById: async () => null,
            findDirectoryEntries: async () => [],
        };

        const useCase = new GetCollaboratorsUseCase(usersRepository);

        await expect(useCase.execute({ userId: 999 })).rejects.toThrow(
            "Usuario nao encontrado."
        );
    });
});