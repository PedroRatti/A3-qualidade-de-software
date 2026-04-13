import { getPool } from "../database/connection";

export type User = {
    id: number;
    nome: string;
    email: string;
    password: string;
    cpf: string;
    number: string;
    birth: string;
    role: string;
    is_active: boolean;
};

export class UsersRepository {
    async findByEmail(email: string): Promise<User | null> {
        const pool = getPool();

        const result = await pool.query<User>(
            `
            SELECT *
            FROM users
            WHERE email = $1
            LIMIT 1
            `,
            [email]
        );

        if (result.rowCount === 0) {
            return null;
        }

        return result.rows[0];
    }
}