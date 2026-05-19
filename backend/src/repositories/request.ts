import { getPool } from "../database/connection";
import type { RequestRecord, RequestStatus, RequestType } from "../useCases/solicitacoes/contracts/request.types";

type RequestRow = {
    id: number;
    user_id: number;
    supervisor_id: number;
    supervisor_name: string;
    type: RequestType;
    start_date: string;
    end_date: string;
    reason: string;
    attachment_url: string | null;
    status: RequestStatus;
    created_at: Date;
    updated_at: Date;
};

export class RequestsRepository {
    async create(input: {
        userId: number;
        supervisorId: number;
        type: RequestType;
        startDate: string;
        endDate: string;
        reason: string;
        attachmentUrl: string | null;
    }): Promise<RequestRecord> {
        const pool = getPool();

        const result = await pool.query<RequestRow>(
            `
            WITH inserted AS (
                INSERT INTO requests
                    (user_id, supervisor_id, type, start_date, end_date, reason, attachment_url, status, created_at, updated_at)
                VALUES
                    ($1, $2, $3, $4, $5, $6, $7, 'pendente', NOW(), NOW())
                RETURNING *
            )
            SELECT i.*, u.name AS supervisor_name
            FROM inserted i
            JOIN users u ON u.id = i.supervisor_id
            `,
            [
                input.userId,
                input.supervisorId,
                input.type,
                input.startDate,
                input.endDate,
                input.reason,
                input.attachmentUrl,
            ]
        );

        return result.rows[0];
    }

    async findHistoryByUserId(userId: number): Promise<RequestRecord[]> {
        const pool = getPool();

        const result = await pool.query<RequestRow>(
            `
            SELECT r.*, u.name AS supervisor_name
            FROM requests r
            JOIN users u ON u.id = r.supervisor_id
            WHERE r.user_id = $1
            ORDER BY r.created_at DESC, r.id DESC
            `,
            [userId]
        );

        return result.rows;
    }
}