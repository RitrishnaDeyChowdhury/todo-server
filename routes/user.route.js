import express from "express";
import { login, logout, registration } from "../controllers/user.controller.js";
const router = express.Router();

router.post("/registration", registration);
router.post("/login", login);
router.get("/logout", logout);

export default router;