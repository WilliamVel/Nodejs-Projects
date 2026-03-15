import { WalletModel } from "../models/wallet.js";
import { IdempotencyStore } from "../store/idempotency-store.js";
import { IdempotencyEnum } from "../constants/idempotency.enum.js";

const processingUsers = new Set();

export class TransferService {
  static async transfer(txtId, fromUserId, toUserId, amount) {
    try {
      const idempotencyResult = await IdempotencyStore.startProcessing(txtId);
      if (!idempotencyResult.ok) {
        if (idempotencyResult.record.status === IdempotencyEnum.PROCESSING) {
          return {
            success: false,
            code: "IDEMPOTENCY_IN_PROGRESS",
            message: `Transfer with txId ${txtId} is currently being processed. Please wait.`,
          };
        } else if (
          idempotencyResult.record.status === IdempotencyEnum.SUCCESS
        ) {
          return {
            success: true,
            message: `Transfer with txId ${txtId} has already been processed.`,
            data: idempotencyResult.record.response,
          };
        }
      }

      if (processingUsers.has(fromUserId) || processingUsers.has(toUserId)) {
        await IdempotencyStore.clear(txtId);
        return {
          success: false,
          message: `One of the users is currently processing another transfer. Please try again later.`,
        };
      }
      processingUsers.add(fromUserId);
      processingUsers.add(toUserId);

      const fromUserBalance = await WalletModel.getBalanceByUserId(fromUserId);
      if (fromUserBalance === null) {
        await IdempotencyStore.clear(txtId);
        return {
          success: false,
          message: `User with id ${fromUserId} not found`,
        };
      }
      if (fromUserBalance < amount) {
        await IdempotencyStore.clear(txtId);
        return {
          success: false,
          message: `Insufficient funds`,
        };
      }
      const toUserBalance = await WalletModel.getBalanceByUserId(toUserId);
      if (toUserBalance === null) {
        await IdempotencyStore.clear(txtId);
        return {
          success: false,
          message: `User with id ${toUserId} not found`,
        };
      }
      // Update balances from user
      let balanceUpdateFrom = fromUserBalance - amount;
      const responseBalanceFrom = await WalletModel.updateBalance(
        fromUserId,
        balanceUpdateFrom,
      );
      if (!responseBalanceFrom.success) {
        throw new Error(responseBalanceFrom.message);
      }

      // Update balances to user
      let balanceUpdateTo = toUserBalance + amount;
      const responseBalanceTo = await WalletModel.updateBalance(
        toUserId,
        balanceUpdateTo,
      );
      if (!responseBalanceTo.success) {
        await WalletModel.updateBalance(fromUserId, fromUserBalance);
        throw new Error(responseBalanceTo.message);
      }

      const response = {
        success: true,
        message: `Transferred ${amount} from ${fromUserId} to ${toUserId}`,
        data: {
          fromUserId: fromUserId,
          toUserId: toUserId,
          amount: amount,
          fromNewBalance: balanceUpdateFrom,
          toNewBalance: balanceUpdateTo,
          timestamp: new Date().toISOString(),
        },
      };

      await IdempotencyStore.saveSuccess(txtId, response);

      console.log(`Transferring ${amount} from ${fromUserId} to ${toUserId}`);
      return response;
    } catch (error) {
      console.error(
        `Error occurred while transferring funds: ${error.message}`,
      );
      await IdempotencyStore.clear(txtId);
      return {
        success: false,
        message: `Error occurred while transferring funds: ${error.message}`,
      };
    } finally {
      processingUsers.delete(fromUserId);
      processingUsers.delete(toUserId);
    }
  }
}
