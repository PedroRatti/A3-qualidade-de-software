import { type CollaboratorDirectoryItem, UsersRepository } from "../../repositories/user";

type GetCollaboratorsInput = {
    userId: number;
};

export class GetCollaboratorsUseCase {
    constructor(
        private usersRepository: Pick<UsersRepository, "findById" | "findDirectoryEntries">
    ) { }

    async execute({ userId }: GetCollaboratorsInput): Promise<CollaboratorDirectoryItem[]> {
        const user = await this.usersRepository.findById(userId);

        if (!user) {
            throw new Error("Usuario nao encontrado.");
        }

        if (!user.is_active) {
            throw new Error("Usuario inativo.");
        }

        if (user.role !== "admin") {
            throw new Error("Acesso negado.");
        }

        return this.usersRepository.findDirectoryEntries();
    }
}