import { Router } from "express";

import { AuthController } from "../controllers/login";

const authRoutes = Router();
const authController = new AuthController();

authRoutes.post("/login", (req, res) => authController.login(req, res));

export default authRoutes;