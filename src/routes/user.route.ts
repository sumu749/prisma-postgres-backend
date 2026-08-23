import { Router } from "express";
import {
    createUser,
    deleteUser,
    getAllUsers,
    getSingleUser,
    updateUser,
} from "../controllers/user.controller.js";
const router = Router();

router.post("/", createUser);
router.get("/", getAllUsers);
router.get("/:id", getSingleUser);
router.patch("/:id", updateUser);
router.delete("/:id", deleteUser);

export default router;
