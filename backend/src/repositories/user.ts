import { getPool } from "../database/connection";

export type User = {
    id: number;
    name: string;
    email: string;
    password: string;
    cpf: string;
    number: string;
    birth: string;
    role: string;
    is_active: boolean;
};

export type SupervisorOption = {
    id: number;
    name: string;
    email: string;
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

    async findById(id: number): Promise<User | null> {
        const pool = getPool();

        const result = await pool.query<User>(
            `
            SELECT *
            FROM users
            WHERE id = $1
            LIMIT 1
            `,
            [id]
        );

        if (result.rowCount === 0) {
            return null;
        }

        return result.rows[0];
    }

    async findActiveAdmins(): Promise<SupervisorOption[]> {
        const pool = getPool();

        const result = await pool.query<SupervisorOption>(
            `
        SELECT id, name, email
        FROM users
        WHERE role = 'admin'
          AND is_active = TRUE
        ORDER BY name ASC
        `
        );

        return result.rows;
    }
}