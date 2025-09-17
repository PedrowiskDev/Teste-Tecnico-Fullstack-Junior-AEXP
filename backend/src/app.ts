import express, { Request, Response, NextFunction } from "express";
import eventRouter from "./routers/eventRouter";
import cors from "cors";
import morgan from "morgan";
import helmet from "helmet";

const app = express();

app.use(morgan("tiny"));

app.use(cors());

app.use(helmet());

app.use(express.json());
app.use("/events", eventRouter);

app.use((error: Error, req: Request, res: Response, next: NextFunction) => {
  res.status(500).send(error.message);
});

export default app;
