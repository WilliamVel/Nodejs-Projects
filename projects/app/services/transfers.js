import { WalletModel } from "../models/wallet.js";

const processingUsers = new Set();

export class TransferService {
  static async transfer(fromUserId, toUserId, amount) {
    try {
      if (processingUsers.has(fromUserId) || processingUsers.has(toUserId)) {
        return {
          success: false,
          message: `One of the users is currently processing another transfer. Please try again later.`,
        };
      }
      processingUsers.add(fromUserId);
      processingUsers.add(toUserId);

      const fromUserBalance = await WalletModel.getBalanceByUserId(fromUserId);
      if (fromUserBalance === null) {
        return {
          success: false,
          message: `User with id ${fromUserId} not found`,
        };
      }
      if (fromUserBalance < amount) {
        return {
          success: false,
          message: `Insufficient funds`,
        };
      }
      const toUserBalance = await WalletModel.getBalanceByUserId(toUserId);
      if (toUserBalance === null) {
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
      if (!responseBalanceFrom.success)
        throw new Error(responseBalanceFrom.message);
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

      console.log(`Transferring ${amount} from ${fromUserId} to ${toUserId}`);
      return {
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
    } catch (error) {
      console.error(
        `Error occurred while transferring funds: ${error.message}`,
      );
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
