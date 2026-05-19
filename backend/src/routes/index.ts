import { Router } from "express";

import authRoutes from "./auth";
import pontoRoutes from "./ponto";
import solicitacoesRoutes from "./solicitacoes";

const routes = Router();

routes.use("/auth", authRoutes);
routes.use("/ponto", pontoRoutes);
routes.use("/solicitacoes", solicitacoesRoutes);

export default routes;