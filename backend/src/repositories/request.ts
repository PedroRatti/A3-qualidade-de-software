import { getPool } from "../database/connection";
import type {
    RequestRecord,
    RequestStatus,
    RequestType,
    SupervisorRequestRecord,
} from "../useCases/solicitacoes/contracts/request.types";

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

type SupervisorRequestRow = RequestRow & {
    requester_name: string;
    requester_email: string;
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

    async findHistoryBySupervisorId(supervisorId: number): Promise<SupervisorRequestRecord[]> {
        const pool = getPool();

        const result = await pool.query<SupervisorRequestRow>(
            `
            SELECT
                r.*,
                supervisor.name AS supervisor_name,
                requester.name AS requester_name,
                requester.email AS requester_email
            FROM requests r
            JOIN users supervisor ON supervisor.id = r.supervisor_id
            JOIN users requester ON requester.id = r.user_id
            WHERE r.supervisor_id = $1
            ORDER BY
                CASE WHEN r.status = 'pendente' THEN 0 ELSE 1 END,
                r.created_at DESC,
                r.id DESC
            `,
            [supervisorId]
        );

        return result.rows;
    }

    async findById(requestId: number): Promise<SupervisorRequestRecord | null> {
        const pool = getPool();

        const result = await pool.query<SupervisorRequestRow>(
            `
            SELECT
                r.*,
                supervisor.name AS supervisor_name,
                requester.name AS requester_name,
                requester.email AS requester_email
            FROM requests r
            JOIN users supervisor ON supervisor.id = r.supervisor_id
            JOIN users requester ON requester.id = r.user_id
            WHERE r.id = $1
            LIMIT 1
            `,
            [requestId]
        );

        if (result.rowCount === 0) {
            return null;
        }

        return result.rows[0];
    }

    async updateStatus(input: {
        requestId: number;
        status: RequestStatus;
    }): Promise<SupervisorRequestRecord> {
        const pool = getPool();

        const result = await pool.query<SupervisorRequestRow>(
            `
            WITH updated AS (
                UPDATE requests
                SET status = $2,
                    updated_at = NOW()
                WHERE id = $1
                RETURNING *
            )
            SELECT
                u.*,
                supervisor.name AS supervisor_name,
                requester.name AS requester_name,
                requester.email AS requester_email
            FROM updated u
            JOIN users supervisor ON supervisor.id = u.supervisor_id
            JOIN users requester ON requester.id = u.user_id
            `,
            [input.requestId, input.status]
        );

        if (result.rowCount === 0) {
            throw new Error("Solicitação não encontrada.");
        }

        return result.rows[0];
    }
}