import { Router } from "express";
import {
    createTask,
    deleteTask,
    getAllTasks,
    getSingleTask,
    updateTask,
} from "../controllers/task.controller.js";

const router = Router();

router.post("/", createTask);
router.get("/", getAllTasks);
router.get("/:id", getSingleTask);
router.patch("/:id", updateTask);
router.delete("/:id", deleteTask);

export default router;
