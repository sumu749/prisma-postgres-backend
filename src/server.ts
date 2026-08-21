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

app.get("/", (req: Request, res: Response) => {
    res.send("Server is running with TypeScript + Prisma + PostgreSQL 🚀");
});

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

            res.status(500).json({
                success: false,
                message: "Something went wrong",
            });
        }
    },
);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
