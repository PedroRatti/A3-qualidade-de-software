import dotenv from "dotenv";
import app from "./app";
import { connectToDatabase } from "./database/connection";

dotenv.config();

const PORT = 3000;

async function startServer() {
    try {
        await connectToDatabase();

        app.listen(PORT, () => {
            console.log(`Servidor rodando em http://localhost:${PORT}`);
        });
    } catch (error) {
        console.error(error);
    }
}

startServer();