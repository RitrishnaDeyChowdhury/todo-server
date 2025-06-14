import express from "express";
import { createTodo, getAllTodos, deleteTodo, update } from "../controllers/todo.controller.js";
const router = express.Router();

router.get("/", getAllTodos);
router.post("/create", createTodo);
router.put("/update/:id", update);
router.delete("/delete/:id",deleteTodo);

export default router;
