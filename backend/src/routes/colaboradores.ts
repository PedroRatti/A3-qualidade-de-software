import { Router } from "express";
import { ColaboradoresController } from "../controllers/colaboradores";
import { verifyJWT } from "../middleware/verifyJWT";

const colaboradoresRoutes = Router();
const colaboradoresController = new ColaboradoresController();

colaboradoresRoutes.use(verifyJWT);
colaboradoresRoutes.get("/", (req, res) => colaboradoresController.getAll(req, res));

export default colaboradoresRoutes;