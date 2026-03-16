import { Router } from 'express';
import { validateGetTransactions } from '../middleware/validate-get-transactions';
import { TransactionController } from '../controllers/transaction.controller';  

const transactionRouter: Router = Router();
const transactionController = new TransactionController();

transactionRouter.get('/:userId', validateGetTransactions, async (req, res) => {
  await transactionController.getTransactionsByUserId(req, res);
});

export {transactionRouter}