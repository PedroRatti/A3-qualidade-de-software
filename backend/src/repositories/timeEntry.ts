import { getPool } from "../database/connection";
import { TimeEntryAction, TimeEntryRecord } from "../useCases/ponto/contracts/ponto.types";
import { normalizeTimeEntryAction } from "../utils/ponto/ponto.Actions";

type TimeEntryRow = {
    id: number;
    user_id: number;
    action: string;
    created_at: Date;
};

export function toStoredTimeEntryAction(action: TimeEntryAction) {
    return action;
}

export class TimeEntriesRepository {
    async findTodayByUserId(userId: number): Promise<TimeEntryRecord[]> {
        const pool = getPool();

        const result = await pool.query<TimeEntryRow>(
            `
            SELECT id, user_id, action, created_at
            FROM time_entries
            WHERE user_id = $1
              AND DATE(created_at) = CURRENT_DATE
            ORDER BY created_at ASC, id ASC
            `,
            [userId]
        );

        return result.rows.map((row) => ({
            id: row.id,
            user_id: row.user_id,
            action: normalizeTimeEntryAction(row.action),
            created_at: new Date(row.created_at),
        }));
    }

    async create(input: { userId: number; action: TimeEntryAction }): Promise<TimeEntryRecord> {
        const pool = getPool();

        const result = await pool.query<TimeEntryRow>(
            `
            INSERT INTO time_entries (user_id, action, created_at)
            VALUES ($1, $2, NOW())
            RETURNING id, user_id, action, created_at
            `,
            [input.userId, toStoredTimeEntryAction(input.action)]
        );

        const row = result.rows[0];

        return {
            id: row.id,
            user_id: row.user_id,
            action: normalizeTimeEntryAction(row.action),
            created_at: new Date(row.created_at),
        };
    }
}