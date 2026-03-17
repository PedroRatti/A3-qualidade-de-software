import { Router } from "express";

const routes = Router();

routes.get("/", (req, res) => {
    res.json({ message: "Servidor de EquipeHub está rodando!" });
});

export default routes;