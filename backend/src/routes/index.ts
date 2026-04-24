import { Router } from "express";
import authRoutes from "./auth";
import { verifyJWT } from "../middleware/verifyJWT";

const routes = Router();

routes.get("/service-health", verifyJWT, (req, res) => {
    res.json({ message: "Servidor de EquipeHub está rodando!" });
});

routes.use("/auth", authRoutes);

export default routes;