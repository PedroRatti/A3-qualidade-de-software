import { Router } from "express";
import { SolicitacoesController } from "../controllers/solicitacoes";
import { verifyJWT } from "../middleware/verifyJWT";
import { uploadRequestAttachment } from "../middleware/uploadRequestAttachment";

const solicitacoesRoutes = Router();
const solicitacoesController = new SolicitacoesController();

solicitacoesRoutes.use(verifyJWT);

solicitacoesRoutes.get("/supervisors", (req, res) => solicitacoesController.getSupervisors(req, res));
solicitacoesRoutes.post("/", uploadRequestAttachment.single("attachment"), (req, res) => solicitacoesController.create(req, res));
solicitacoesRoutes.get("/history", (req, res) => solicitacoesController.getHistory(req, res));

export default solicitacoesRoutes;