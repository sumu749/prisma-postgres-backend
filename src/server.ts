import express, { type Request, type Response } from "express";
import cors from "cors";

import userRouter from "./routes/user.route.js";
import taskRouter from "./routes/task.route.js";

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req: Request, res: Response) => {
    res.send("Server is running");
});

app.use("/users", userRouter);
app.use("/tasks", taskRouter);

app.listen(5000, () => {
    console.log("Server is running on port 5000");
});
