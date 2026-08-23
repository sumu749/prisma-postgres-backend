import type { Request, Response } from "express";
import prisma from "../lib/prisma.js";

interface CreateTaskBody {
    title: string;
    userId: number;
}

interface UpdateTaskBody {
    title?: string;
    completed?: boolean;
}

// Create a new task

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

// Get all tasks

export const getAllTasks = async (req: Request, res: Response) => {
    try {
        const tasks = await prisma.task.findMany({
            include: {
                user: true,
            },
        });

        return res.status(200).json({
            success: true,
            message: "Tasks fetched successfully",
            data: tasks,
        });
    } catch (error) {
        console.error(error);

        return res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
};

// Get a single task by ID

export const getSingleTask = async (
    req: Request<{ id: string }>,
    res: Response,
) => {
    try {
        const id = Number(req.params.id);

        if (isNaN(id)) {
            return res.status(400).json({
                success: false,
                message: "Invalid task ID",
            });
        }

        const task = await prisma.task.findUnique({
            where: {
                id,
            },
            include: {
                user: true,
            },
        });

        if (!task) {
            return res.status(404).json({
                success: false,
                message: "Task not found",
            });
        }

        return res.status(200).json({
            success: true,
            message: "Task fetched successfully",
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

// Update a task by ID

export const updateTask = async (
    req: Request<{ id: string }, {}, UpdateTaskBody>,
    res: Response,
) => {
    try {
        const id = Number(req.params.id);

        if (isNaN(id)) {
            return res.status(400).json({
                success: false,
                message: "Invalid task ID",
            });
        }

        const { title, completed } = req.body;

        const existingTask = await prisma.task.findUnique({
            where: {
                id,
            },
        });

        if (!existingTask) {
            return res.status(404).json({
                success: false,
                message: "Task not found",
            });
        }

        const updatedTask = await prisma.task.update({
            where: {
                id,
            },
            data: {
                title,
                completed,
            },
        });

        return res.status(200).json({
            success: true,
            message: "Task updated successfully",
            data: updatedTask,
        });
    } catch (error) {
        console.error(error);

        return res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
};

// Delete a task by ID

export const deleteTask = async (
    req: Request<{ id: string }>,
    res: Response,
) => {
    try {
        const id = Number(req.params.id);

        if (isNaN(id)) {
            return res.status(400).json({
                success: false,
                message: "Invalid task ID",
            });
        }

        const existingTask = await prisma.task.findUnique({
            where: {
                id,
            },
        });

        if (!existingTask) {
            return res.status(404).json({
                success: false,
                message: "Task not found",
            });
        }

        await prisma.task.delete({
            where: {
                id,
            },
        });

        return res.status(200).json({
            success: true,
            message: "Task deleted successfully",
        });
    } catch (error) {
        console.error(error);

        return res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
};
