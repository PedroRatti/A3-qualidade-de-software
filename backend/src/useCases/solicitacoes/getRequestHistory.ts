import { RequestsRepository } from "../../repositories/request";
import { UsersRepository } from "../../repositories/user";
import { formatRequest, RequestHistoryItem } from "../../utils/solicitacoes/request.presenter";

type GetRequestHistoryInput = {
    userId: number;
};

export class GetRequestHistoryUseCase {
    constructor(
        private usersRepository: Pick<UsersRepository, "findById">,
        private requestsRepository: Pick<RequestsRepository, "findHistoryByUserId">
    ) { }

    async execute({ userId }: GetRequestHistoryInput): Promise<RequestHistoryItem[]> {
        const user = await this.usersRepository.findById(userId);

        if (!user) {
            throw new Error("Usuário não encontrado.");
        }

        if (!user.is_active) {
            throw new Error("Usuário inativo.");
        }

        const requests = await this.requestsRepository.findHistoryByUserId(userId);

        return requests.map(formatRequest);
    }
}