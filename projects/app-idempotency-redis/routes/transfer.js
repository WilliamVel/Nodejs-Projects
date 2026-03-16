import { Router } from "express";
import { TransferController } from "../controllers/transfers.js";

export const transferRouter = Router();

transferRouter.post("/", TransferController.transfer);
