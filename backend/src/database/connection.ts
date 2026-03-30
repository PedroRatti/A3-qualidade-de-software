import { Pool } from "pg";

function getDatabaseConfig() {
    const host = process.env.DB_HOST;
    const port = process.env.DB_PORT;
    const database = process.env.DB_NAME;
    const user = process.env.DB_USER;
    const password = process.env.DB_PASSWORD;

    const missingVariables = [
        ["DB_HOST", host],
        ["DB_PORT", port],
        ["DB_NAME", database],
        ["DB_USER", user],
        ["DB_PASSWORD", password],
    ]
        .filter(([, value]) => !value)
        .map(([key]) => key);

    if (missingVariables.length > 0) {
        throw new Error(
            `Variaveis de ambiente ausentes para o banco: ${missingVariables.join(", ")}`
        );
    }

    return {
        host,
        port: Number(port),
        database,
        user,
        password,
    };
}

let pool: Pool | null = null;

function getPool() {
    if (!pool) {
        pool = new Pool(getDatabaseConfig());
    }

    return pool;
}

export async function connectToDatabase() {
    const client = await getPool().connect();

    try {
        await client.query("SELECT 1");
        console.log("Conectado ao banco de dados");
    } finally {
        client.release();
    }
}

export { getPool };