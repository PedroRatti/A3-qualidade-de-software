import { RequestsRepository } from "../../repositories/request";
import { UsersRepository } from "../../repositories/user";
import {
    formatSupervisorRequest,
    type SupervisorRequestItem,
} from "../../utils/solicitacoes/request.presenter";

type GetSupervisorRequestsInput = {
    userId: number;
};

export class GetSupervisorRequestsUseCase {
    constructor(
        private usersRepository: Pick<UsersRepository, "findById">,
        private requestsRepository: Pick<RequestsRepository, "findHistoryBySupervisorId">
    ) { }

    async execute({ userId }: GetSupervisorRequestsInput): Promise<SupervisorRequestItem[]> {
        const user = await this.usersRepository.findById(userId);

        if (!user) {
            throw new Error("Usuário não encontrado.");
        }

        if (!user.is_active) {
            throw new Error("Usuário inativo.");
        }

        if (user.role !== "admin") {
            throw new Error("Acesso negado.");
        }

        const requests = await this.requestsRepository.findHistoryBySupervisorId(userId);

        return requests.map(formatSupervisorRequest);
    }
}