import { readJson } from "../utils.js";

const wallets = readJson("./wallets.json");

export class WalletModel {
  static async getBalanceByUserId(userId) {
    return wallets.find((wallet) => wallet.userId === userId)?.balance || 0;
  }

  static async updateBalance(userId, newBalance) {
    const walletIndex = wallets.findIndex((wallet) => wallet.userId === userId);
    if (walletIndex === -1) {
      return {
        success: false,
        message: `User with id ${userId} not found`,
      };
    }
    wallets[walletIndex].balance = newBalance;
    console.log(`Updated balance for user ${userId} to ${newBalance}`);
    return {
      success: true,
      message: `Updated balance for user ${userId} to ${newBalance}`,
    };
  }
}
