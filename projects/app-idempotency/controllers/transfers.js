import { validateTransfer } from "../schemas/transfer.js";
import { TransferService } from "../services/transfers.js";

export class TransferController {
  static async transfer(req, res) {
    try {
      const resultValidation = validateTransfer(req.body);

      if (!resultValidation.success) {
        return res.status(400).json({
          success: false,
          message: "Invalid transfer data",
          errors: resultValidation.errors,
        });
      }

      let { txtId, fromUserId, toUserId, amount } = resultValidation.data;
      const responseTransfer = await TransferService.transfer(
        txtId,
        fromUserId,
        toUserId,
        amount,
      );

      if (
        !responseTransfer.success &&
        responseTransfer.code === "IDEMPOTENCY_IN_PROGRESS"
      ) {
        return res.status(409).json({
          success: false,
          message: responseTransfer.message,
        });
      }

      if (!responseTransfer.success) {
        return res.status(400).json({
          success: false,
          message: responseTransfer.message,
        });
      }

      return res.status(200).json({
        success: true,
        message: responseTransfer.message,
        data: responseTransfer.data,
      });
    } catch (error) {
      console.log(
        `[TransferController] - Error processing transfer: ${error.message}`,
      );
      return res.status(500).json({
        success: false,
        message: `An error occurred while processing the transfer.`,
      });
    }
  }
}
