import { RequestsRepository } from "../../repositories/request";
import { UsersRepository } from "../../repositories/user";
import {
    formatSupervisorRequest,
    parseReviewRequestStatus,
    type SupervisorRequestItem,
} from "../../utils/solicitacoes/request.presenter";

type ReviewRequestInput = {
    userId: number;
    requestId: number;
    status: string;
};

export class ReviewRequestUseCase {
    constructor(
        private usersRepository: Pick<UsersRepository, "findById">,
        private requestsRepository: Pick<RequestsRepository, "findById" | "updateStatus">
    ) { }

    async execute({ userId, requestId, status }: ReviewRequestInput): Promise<SupervisorRequestItem> {
        if (!Number.isInteger(requestId)) {
            throw new Error("Solicitação inválida.");
        }

        if (!status?.trim()) {
            throw new Error("É necessário informar o status da solicitação.");
        }

        const parsedStatus = parseReviewRequestStatus(status);

        if (!parsedStatus) {
            throw new Error("Status de solicitação inválido.");
        }

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

        const request = await this.requestsRepository.findById(requestId);

        if (!request) {
            throw new Error("Solicitação não encontrada.");
        }

        if (request.supervisor_id !== userId) {
            throw new Error("Solicitação não pertence ao supervisor informado.");
        }

        if (request.status !== "pendente") {
            throw new Error("Solicitação já analisada.");
        }

        const updatedRequest = await this.requestsRepository.updateStatus({
            requestId,
            status: parsedStatus,
        });

        return formatSupervisorRequest(updatedRequest);
    }
}