import { Router } from "express";

import authRoutes from "./auth";
import pontoRoutes from "./ponto";

const routes = Router();

routes.use("/auth", authRoutes);
routes.use("/ponto", pontoRoutes);

export default routes;