import type { Request, Response } from "express";
import prisma from "../lib/prisma.js";

interface CreateTaskBody {
    title: string;
    userId: number;
}

export const createTask = async (
    req: Request<{}, {}, CreateTaskBody>,
    res: Response,
) => {
    try {
        const { title, userId } = req.body;

        const existingUser = await prisma.user.findUnique({
            where: {
                id: userId,
            },
        });

        if (!existingUser) {
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }

        const task = await prisma.task.create({
            data: {
                title,
                userId,
            },
        });

        return res.status(201).json({
            success: true,
            message: "Task created successfully",
            data: task,
        });
    } catch (error) {
        console.error(error);

        return res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
};
