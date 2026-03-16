import { z } from "zod";

const transferSchema = z
  .object({
    txtId: z.string(),
    fromUserId: z.number().int().positive(),
    toUserId: z.number().int().positive(),
    amount: z.number().positive(),
  })
  .refine((data) => data.fromUserId !== data.toUserId, {
    message: "Cannot transfer to the same user",
  });

export const validateTransfer = (data) => {
  const result = transferSchema.safeParse(data);
  if (!result.success) {
    return {
      success: false,
      message: "Invalid transfer data",
      errors: result.error.errors,
    };
  }
  return {
    success: true,
    data: result.data,
  };
};

// module.exports = { transferSchema, validateTransfer };
