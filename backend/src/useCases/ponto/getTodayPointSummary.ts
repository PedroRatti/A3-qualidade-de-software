import { UsersRepository } from "../../repositories/user";
import { TimeEntriesRepository } from "../../repositories/timeEntry";
import { buildPointSummary } from "../../utils/ponto/ponto.summary";

type GetTodayPointSummaryRequest = {
    userId: number;
    now?: Date;
};

export class GetTodayPointSummaryUseCase {
    constructor(
        private usersRepository: Pick<UsersRepository, "findById">,
        private timeEntriesRepository: Pick<TimeEntriesRepository, "findTodayByUserId">
    ) { }

    async execute({ userId, now }: GetTodayPointSummaryRequest) {
        const user = await this.usersRepository.findById(userId);

        if (!user) {
            throw new Error("Usuário não encontrado.");
        }

        if (!user.is_active) {
            throw new Error("Usuário inativo.");
        }

        const entries = await this.timeEntriesRepository.findTodayByUserId(userId);

        return buildPointSummary({
            employeeName: user.name,
            entries,
            now,
        });
    }
}