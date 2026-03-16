import express from "express";
import dotenv from "dotenv";
import { transferRouter } from "./routes/transfer.js";

dotenv.config();

const app = express();

const port = process.env.PORT || 3000;

app.use(express.json());

app.use("/transfer", transferRouter);

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});

const shutdown = async (signal) => {
  console.log(`[${signal}] Shutting down...`);
  server.close(async () => {
    await IdempotencyStore.disconnect();
    console.log("Redis disconnected. Process exiting.");
    process.exit(0);
  });
};

process.on("SIGTERM", () => shutdown("SIGTERM")); // Kubernetes
process.on("SIGINT", () => shutdown("SIGINT")); // Ctrl+C local
