import { Router } from "express";
import authRoutes from "./auth";

const routes = Router();

routes.get("/service-health", (req, res) => {
    res.json({ message: "Servidor de EquipeHub está rodando!" });
});

routes.use("/auth", authRoutes);

export default routes;