import { z } from 'zod';

export const transferSchema = z.object({
  txId: z.string().min(1),
  from: z.number().positive(),
  to: z.number().positive(),
  amount: z.number().positive(),
}).refine( 
  (data) => data.from !== data.to, 
  {message: "Sender and receiver cannot be the same"}
);

export const transactionStatusSchema = z.enum(['SUCCESS', 'FAILED', 'PROCESSING']);

export const transactionParamsSchema = z.object({
  userId: z.coerce.number().int().min(1),
});

export const transactionQuerySchema = z.object({
  status: transactionStatusSchema.optional(),
  limit: z.coerce.number().int().min(1).max(50).default(10),
  page: z.coerce.number().int().min(1).default(1),
});

export const getTransactionsSchema = z.object({
  params: transactionParamsSchema,
  query: transactionQuerySchema,
});

export type TransferInput = z.infer<typeof transferSchema>;
export type GetTransactionsInput = z.infer<typeof getTransactionsSchema>;
export type TransactionStatus = z.infer<typeof transactionStatusSchema>;

export type ValidationResult<T> =
  | { success: true; data: T }
  | { success: false; errors: z.ZodIssue[] };
 
export const validateTransfer = (data: unknown): ValidationResult<TransferInput> => {
  const result = transferSchema.safeParse(data);
  if (!result.success) {
    return { success: false, errors: result.error.issues };
  }
  return { success: true, data: result.data };
};
