
import { Request, Response } from 'express';
import { TransactionService } from '../services/transaction.service';
import { GetTransactionsInput } from '../schemas/transfer.schema';

type ValidateTransactionsLocals = { 
  validatedInput: GetTransactionsInput;
};

export class TransactionController {
  private transactionService: TransactionService;

  constructor() {
    this.transactionService = new TransactionService();
  }

  async getTransactionsByUserId(
    _req: Request,
    res: Response<unknown, ValidateTransactionsLocals>
  ): Promise<void> {
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
  }
}