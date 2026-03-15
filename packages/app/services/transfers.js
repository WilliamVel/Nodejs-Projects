import { WalletModel } from "../models/wallet.js";

export class TransferService {
  static async transfer(fromUserId, toUserId, amount) {
    if (fromUserId === toUserId) {
      return {
        success: false,
        message: `Cannot transfer to the same user`,
      };
    }
    try {
      const fromUserBalance = await WalletModel.getBalanceByUserId(fromUserId);
      if (!fromUserBalance) {
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
      // Update balances from user
      const responseBalanceFrom = await WalletModel.updateBalance(
        fromUserId,
        fromUserBalance - amount,
      );
      if (!responseBalanceFrom.success)
        throw new Error(responseBalanceFrom.message);
      // Update balances to user
      const responseBalanceTo = await WalletModel.updateBalance(
        toUserId,
        toUserBalance + amount,
      );
      if (!responseBalanceTo.success) {
        await WalletModel.updateBalance(fromUserId, fromUserBalance);
        throw new Error(responseBalanceTo.message);
      }

      console.log(`Transferring ${amount} from ${fromUserId} to ${toUserId}`);
      return {
        success: true,
        message: `Transferred ${amount} from ${fromUserId} to ${toUserId}`,
      };
    } catch (error) {
      console.error(
        `Error occurred while transferring funds: ${error.message}`,
      );
      return {
        success: false,
        message: `Error occurred while transferring funds: ${error.message}`,
      };
    }
  }
}
