import express from "express";
import { testRouter } from "../apis/test.js";

export const apiRouter = express.Router();

apiRouter.use("/", testRouter);
apiRouter.use("/test", testRouter);
