import { GetTransactionsInput, TransactionStatus } from "../schemas/transfer.schema";

// ── Transfer ──────────────────────────────────────
export type TransferInput = {
  txId: string;
  fromUserId: number;
  toUserId: number;
  amount: number;
}
 
export type TransferResult = {
  txId: string;
  fromUserId: number;
  toUserId: number;
  amount: number;
  status: TransactionStatus;
  timestamp: string;
}

export type TransactionPagination = {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
};

export type GetTransactionsByUserResult = {
  transactions: TransferResult[];
  pagination: TransactionPagination;
};

export type ValidateTransactionsLocals = { 
  validatedInput: GetTransactionsInput;
};
