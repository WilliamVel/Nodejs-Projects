import { transactions } from '../transactions';
import {  
  GetTransactionsByUserResult,
} from '../types/transfer.type';
import { TransactionStatus } from '../schemas/transfer.schema';

export class TransactionService {
  async getTransactionsByUserId(
    userId: number, 
    status?: TransactionStatus, 
    limit: number = 10, 
    page: number = 1
  ): Promise<GetTransactionsByUserResult> {
    const filtered = transactions.filter( 
      (tx) => 
        (tx.fromUserId === userId || tx.toUserId === userId) && 
        (!status || tx.status === status)
    );

    const total = filtered.length;
    const start = (page - 1) * limit;
    const paginated = filtered.slice(start, start + limit);

    return {
      transactions: paginated,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }
}