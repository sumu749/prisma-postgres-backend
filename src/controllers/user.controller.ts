import type { Request, Response } from "express";
import prisma from "../lib/prisma.js";

interface CreateUserBody {
    name: string;
    email: string;
}

interface UpdateUserBody {
    name?: string;
    email?: string;
}

// POST /users endpoint to create a new user

export const createUser = async (
    req: Request<{}, {}, CreateUserBody>,
    res: Response,
) => {
    try {
        const { name, email } = req.body;

        const user = await prisma.user.create({
            data: {
                name,
                email,
            },
        });

        return res.status(201).json({
            success: true,
            message: "User created successfully",
            data: user,
        });
    } catch (error) {
        console.error(error);

        return res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
};

// GET /users endpoint to fetch all users

export const getAllUsers = async (req: Request, res: Response) => {
    try {
        const users = await prisma.user.findMany({
            include: {
                tasks: true,
            },
        });

        return res.status(200).json({
            success: true,
            message: "Users fetched successfully",
            data: users,
        });
    } catch (error) {
        console.error(error);

        return res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
};

// GET /users/:id endpoint to fetch a single user by ID

export const getSingleUser = async (
    req: Request<{ id: string }>,
    res: Response,
) => {
    try {
        const id = Number(req.params.id);

        if (isNaN(id)) {
            return res.status(400).json({
                success: false,
                message: "Invalid user ID",
            });
        }

        const user = await prisma.user.findUnique({
            where: {
                id,
            },
            include: {
                tasks: true,
            },
        });

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }

        return res.status(200).json({
            success: true,
            message: "User fetched successfully",
            data: user,
        });
    } catch (error) {
        console.error(error);

        return res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
};

// PUT /users/:id endpoint to update a user by ID

export const updateUser = async (
    req: Request<{ id: string }, {}, UpdateUserBody>,
    res: Response,
) => {
    try {
        const id = Number(req.params.id);

        if (isNaN(id)) {
            return res.status(400).json({
                success: false,
                message: "Invalid user ID",
            });
        }

        const { name, email } = req.body;

        const existingUser = await prisma.user.findUnique({
            where: {
                id,
            },
        });

        if (!existingUser) {
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }

        const updatedUser = await prisma.user.update({
            where: {
                id,
            },
            data: {
                name,
                email,
            },
        });

        return res.status(200).json({
            success: true,
            message: "User updated successfully",
            data: updatedUser,
        });
    } catch (error) {
        console.error(error);

        return res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
};

// DELETE /users/:id endpoint to delete a user by ID

export const deleteUser = async (
    req: Request<{ id: string }>,
    res: Response,
) => {
    try {
        const id = Number(req.params.id);

        if (isNaN(id)) {
            return res.status(400).json({
                success: false,
                message: "Invalid user ID",
            });
        }

        const existingUser = await prisma.user.findUnique({
            where: {
                id,
            },
        });

        if (!existingUser) {
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }

        const deletedUser = await prisma.user.delete({
            where: {
                id,
            },
        });

        return res.status(200).json({
            success: true,
            message: "User deleted successfully",
            data: deletedUser,
        });
    } catch (error) {
        console.error(error);

        return res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
};
