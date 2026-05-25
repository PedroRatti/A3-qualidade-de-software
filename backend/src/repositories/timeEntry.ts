import { getPool } from "../database/connection";
import { TimeEntryAction, TimeEntryRecord } from "../useCases/ponto/contracts/ponto.types";
import { normalizeTimeEntryAction } from "../utils/ponto/ponto.actions";

type TimeEntryRow = {
    id: number;
    user_id: number;
    action: string;
    created_at: Date;
};

type TeamTimeEntryRow = TimeEntryRow & {
    user_name: string;
    user_email: string;
    user_is_active: boolean;
};

export type TeamTimeEntryRecord = TimeEntryRecord & {
    user_name: string;
    user_email: string;
    user_is_active: boolean;
};

export function toStoredTimeEntryAction(action: TimeEntryAction) {
    return action;
}

function mapTimeEntryRow(row: TimeEntryRow): TimeEntryRecord {
    return {
        id: row.id,
        user_id: row.user_id,
        action: normalizeTimeEntryAction(row.action),
        created_at: new Date(row.created_at),
    };
}

function mapTeamTimeEntryRow(row: TeamTimeEntryRow): TeamTimeEntryRecord {
    return {
        id: row.id,
        user_id: row.user_id,
        action: normalizeTimeEntryAction(row.action),
        created_at: new Date(row.created_at),
        user_name: row.user_name,
        user_email: row.user_email,
        user_is_active: row.user_is_active,
    };
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

        return result.rows.map(mapTimeEntryRow);
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

        return mapTimeEntryRow(result.rows[0]);
    }

    async findHistoryByUserId(userId: number, daysBack = 30): Promise<TimeEntryRecord[]> {
        const pool = getPool();

        const result = await pool.query<TimeEntryRow>(
            `
                SELECT id, user_id, action, created_at
                FROM time_entries
                WHERE user_id = $1
                AND created_at >= CURRENT_DATE - ($2 * INTERVAL '1 day')
                ORDER BY created_at DESC, id DESC
            `,
            [userId, daysBack]
        );

        return result.rows.map(mapTimeEntryRow);
    }

    async findTeamHistory(daysBack = 30): Promise<TeamTimeEntryRecord[]> {
        const pool = getPool();

        const result = await pool.query<TeamTimeEntryRow>(
            `
                SELECT
                    te.id,
                    te.user_id,
                    te.action,
                    te.created_at,
                    u.name AS user_name,
                    u.email AS user_email,
                    u.is_active AS user_is_active
                FROM time_entries te
                INNER JOIN users u ON u.id = te.user_id
                WHERE u.role = 'employee'
                  AND te.created_at >= CURRENT_DATE - ($1 * INTERVAL '1 day')
                ORDER BY u.name ASC, te.created_at DESC, te.id DESC
            `,
            [daysBack]
        );

        return result.rows.map(mapTeamTimeEntryRow);
    }
}