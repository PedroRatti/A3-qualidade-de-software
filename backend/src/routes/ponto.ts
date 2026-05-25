import { Router } from "express";

import { PontoController } from "../controllers/ponto";
import { verifyJWT } from "../middleware/verifyJWT";

const pontoRoutes = Router();
const pontoController = new PontoController();

pontoRoutes.use(verifyJWT);

pontoRoutes.get("/today", (req, res) => pontoController.getToday(req, res));
pontoRoutes.post("/register", (req, res) => pontoController.register(req, res));
pontoRoutes.get("/history", (req, res) => pontoController.getHistory(req, res));
pontoRoutes.get("/team/history", (req, res) => pontoController.getTeamHistory(req, res));

export default pontoRoutes;