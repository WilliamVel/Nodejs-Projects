
import { Request, Response } from 'express';
import { TransactionService } from '../services/transaction.service';
import { ValidateTransactionsLocals } from '../types/transfer.type';

export class TransactionController {
  private transactionService: TransactionService;

  constructor() {
    this.transactionService = new TransactionService();
  }

  async getTransactionsByUserId(
    _req: Request,
    res: Response<unknown, ValidateTransactionsLocals>
  ): Promise<void> {
    try {
      const {
        params: { userId },
        query: { status, limit, page },
      } = res.locals.validatedInput;

      const result = await this.transactionService.getTransactionsByUserId(
        userId, 
        status, 
        limit, 
        page
      );

      res.json({
        success: true,
        data: {
          transactions: result.transactions,
          pagination: result.pagination,
        },
      });
    } catch (error) {
      console.error('Error fetching transactions:', error);
      res.status(500).json({
        success: false,
        message: 'An error occurred while fetching transactions',
      });
    }
  }
}