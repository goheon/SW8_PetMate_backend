import express from "express";
import { testRouter } from "./test.js";

export const viewsRouter = express.Router();

viewsRouter.use("/", testRouter);
viewsRouter.use("/test", testRouter);
