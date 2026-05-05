import { UsersRepository } from "../../repositories/user";
import { TimeEntriesRepository } from "../../repositories/timeEntry";
import { getAvailableActions, mapPointActionKeyToTimeEntryAction } from "../../utils/ponto/ponto.Actions";
import { PointActionKey } from "./contracts/ponto.types";
import { buildPointSummary } from "../../utils/ponto/ponto.summary";

type RegisterTimeEntryRequest = {
    userId: number;
    action: string;
    now?: Date;
};

export class RegisterTimeEntryUseCase {
    constructor(
        private usersRepository: Pick<UsersRepository, "findById">,
        private timeEntriesRepository: Pick<TimeEntriesRepository, "findTodayByUserId" | "create">
    ) { }

    async execute({ userId, action, now }: RegisterTimeEntryRequest) {
        if (!action?.trim()) {
            throw new Error("é necessário informar a ação.");
        }

        const normalizedAction = mapPointActionKeyToTimeEntryAction(action);

        if (!normalizedAction) {
            throw new Error("Ação de ponto inválida.");
        }

        const user = await this.usersRepository.findById(userId);

        if (!user) {
            throw new Error("Usuário não encontrado.");
        }

        if (!user.is_active) {
            throw new Error("Usuário inativo.");
        }

        const existingEntries = await this.timeEntriesRepository.findTodayByUserId(userId);
        const availableActions = getAvailableActions(existingEntries.map((entry) => entry.action));

        if (!availableActions.includes(action as PointActionKey)) {
            throw new Error("Ação de ponto não permitida para o momento atual.");
        }

        await this.timeEntriesRepository.create({
            userId,
            action: normalizedAction,
        });

        const updatedEntries = await this.timeEntriesRepository.findTodayByUserId(userId);

        return buildPointSummary({
            employeeName: user.name,
            entries: updatedEntries,
            now,
        });
    }
}