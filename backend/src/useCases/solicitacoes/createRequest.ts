import { RequestsRepository } from "../../repositories/request";
import { UsersRepository } from "../../repositories/user";
import { formatRequest, parseRequestType } from "../../utils/solicitacoes/request.presenter";

type CreateRequestInput = {
    userId: number;
    supervisorId: number;
    type: string;
    startDate: string;
    endDate: string;
    reason: string;
    attachment?: Express.Multer.File;
};

function isValidDate(value: string) {
    return /^\d{4}-\d{2}-\d{2}$/.test(value) && !Number.isNaN(new Date(`${value}T00:00:00`).getTime());
}

export class CreateRequestUseCase {
    constructor(
        private usersRepository: Pick<UsersRepository, "findById">,
        private requestsRepository: Pick<RequestsRepository, "create">
    ) { }

    async execute({ userId, supervisorId, type, startDate, endDate, reason, attachment }: CreateRequestInput) {
        if (!type?.trim()) {
            throw new Error("É necessário informar o tipo da solicitação.");
        }

        const parsedType = parseRequestType(type);

        if (!parsedType) {
            throw new Error("Tipo de solicitação inválido.");
        }

        if (!Number.isInteger(supervisorId)) {
            throw new Error("É necessário informar o supervisor.");
        }

        if (!isValidDate(startDate) || !isValidDate(endDate)) {
            throw new Error("Periodo inválido.");
        }

        if (new Date(`${startDate}T00:00:00`) > new Date(`${endDate}T00:00:00`)) {
            throw new Error("A data inicial não pode ser maior que a data final.");
        }

        if (!reason?.trim()) {
            throw new Error("É necessário informar o motivo da solicitação.");
        }

        if (parsedType === "abono_falta" && !attachment) {
            throw new Error("É necessário anexar o atestado para abono de falta.");
        }

        const user = await this.usersRepository.findById(userId);

        if (!user) {
            throw new Error("Usuário não encontrado.");
        }

        if (!user.is_active) {
            throw new Error("Usuário inativo.");
        }

        const supervisor = await this.usersRepository.findById(supervisorId);

        if (!supervisor || supervisor.role !== "admin") {
            throw new Error("Supervisor inválido.");
        }

        if (!supervisor.is_active) {
            throw new Error("Supervisor inativo.");
        }

        const request = await this.requestsRepository.create({
            userId,
            supervisorId,
            type: parsedType,
            startDate,
            endDate,
            reason: reason.trim(),
            attachmentUrl: attachment ? `/uploads/requests/${attachment.filename}` : null,
        });

        return formatRequest(request);
    }
}