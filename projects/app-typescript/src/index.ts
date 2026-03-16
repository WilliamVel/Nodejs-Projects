import express, {Application} from 'express';
import dotenv from 'dotenv';
import { transactionRouter } from './routes/transaction.routes';

dotenv.config();

const app: Application = express();
const PORT = process.env.PORT ?? 3000;

app.use(express.json());

app.use('/transactions', transactionRouter);

app.get('/health', (_req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString(),
    message: 'Hello from TypeScript!' });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});


export default app;