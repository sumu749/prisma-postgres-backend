import { Prisma } from "./generated/prisma/client.js";
import express from "express";
import type { Request, Response } from "express";
import cors from "cors";
import "dotenv/config";
import prisma from "./lib/prisma.js";

const app = express();

app.use(cors());
app.use(express.json());

interface CreateUserBody {
    name: string;
    email: string;
}

interface UpdateUserBody {
    name?: string;
    email?: string;
}

interface CreateTaskBody {
    title: string;
    userId: number;
}

// GET / endpoint to check if the server is running

app.get("/", (req: Request, res: Response) => {
    res.send("Server is running with TypeScript + Prisma + PostgreSQL 🚀");
});

// User endpoints

// POST /users endpoint to create a new user

app.post(
    "/users",
    async (req: Request<{}, {}, CreateUserBody>, res: Response) => {
        try {
            const { name, email } = req.body;

            const user = await prisma.user.create({
                data: {
                    name,
                    email,
                },
            });

            res.status(201).json({
                success: true,
                message: "User created successfully",
                data: user,
            });
        } catch (error) {
            console.error(error);

            if (
                error instanceof Prisma.PrismaClientKnownRequestError &&
                (error as Prisma.PrismaClientKnownRequestError).code === "P2002"
            ) {
                return res.status(409).json({
                    success: false,
                    message: "Email already exists",
                });
            }

            return res.status(500).json({
                success: false,
                message: "Internal server error",
            });
        }
    },
);

// GET /users endpoint to fetch all users

app.get("/users", async (req: Request, res: Response) => {
    try {
        const users = await prisma.user.findMany();

        res.status(200).json({
            success: true,
            message: "Users fetched successfully",
            data: users,
        });
    } catch (error) {
        console.error(error);

        res.status(500).json({
            success: false,
            message: "Something went wrong",
        });
    }
});

// GET /users/:id endpoint to fetch a user by ID

app.get("/users/:id", async (req: Request<{ id: string }>, res: Response) => {
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
        });

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }

        res.status(200).json({
            success: true,
            message: "User fetched successfully",
            data: user,
        });
    } catch (error) {
        console.error(error);

        res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
});

// PATCH /users/:id endpoint to update a user by ID

app.patch(
    "/users/:id",
    async (req: Request<{ id: string }, {}, UpdateUserBody>, res: Response) => {
        try {
            const id = Number(req.params.id);
            const { name, email } = req.body;

            if (isNaN(id)) {
                return res.status(400).json({
                    success: false,
                    message: "Invalid user ID",
                });
            }

            const user = await prisma.user.update({
                where: {
                    id,
                },
                data: {
                    ...(name !== undefined && { name }),
                    ...(email !== undefined && { email }),
                },
            });

            res.status(200).json({
                success: true,
                message: "User updated successfully",
                data: user,
            });
        } catch (error) {
            console.error(error);

            res.status(500).json({
                success: false,
                message: "Something went wrong",
            });
        }
    },
);

// DELETE /users/:id endpoint to delete a user by ID

app.delete(
    "/users/:id",
    async (req: Request<{ id: string }>, res: Response) => {
        try {
            const id = Number(req.params.id);

            if (isNaN(id)) {
                return res.status(400).json({
                    success: false,
                    message: "Invalid user ID",
                });
            }

            const user = await prisma.user.delete({
                where: {
                    id,
                },
            });

            res.status(200).json({
                success: true,
                message: "User deleted successfully",
                data: user,
            });
        } catch (error) {
            console.error(error);

            res.status(500).json({
                success: false,
                message: "Something went wrong",
            });
        }
    },
);

// Task endpoints

// POST /tasks endpoint to create a new task

app.post(
    "/tasks",
    async (req: Request<{}, {}, CreateTaskBody>, res: Response) => {
        try {
            const { title, userId } = req.body;

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
    },
);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
