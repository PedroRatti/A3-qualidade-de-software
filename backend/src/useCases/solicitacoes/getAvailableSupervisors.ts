import { UsersRepository } from "../../repositories/user";

export class GetAvailableSupervisorsUseCase {
    constructor(
        private usersRepository: Pick<UsersRepository, "findActiveAdmins">
    ) { }

    async execute() {
        return this.usersRepository.findActiveAdmins();
    }
}