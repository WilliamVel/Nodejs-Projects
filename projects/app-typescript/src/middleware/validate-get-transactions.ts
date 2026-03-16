import { Request, Response, NextFunction } from 'express';
import { getTransactionsSchema } from '../schemas/transfer.schema'; 
import { ValidateTransactionsLocals } from '../types/transfer.type';

export const validateGetTransactions = (
  req: Request, 
  res: Response<unknown, ValidateTransactionsLocals>, 
  next: NextFunction
): void => {
  const parsed = getTransactionsSchema.safeParse({ 
    params: req.params, 
    query: req.query 
  });

  if (!parsed.success) {
    res.status(400).json({
      success: false,
      message: "Invalid request data",
      errors: parsed.error.issues,
    });
    return;
  }

  res.locals.validatedInput = parsed.data;
  next();
}