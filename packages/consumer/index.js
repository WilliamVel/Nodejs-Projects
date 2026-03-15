import { TransferService } from "wallet-transfer-app/services/transfers.js";

async function main() {
  console.log('Imported TransferService:', typeof TransferService);
  try {
    // Demo call (may fail if dependent modules expect runtime state)
    const result = await TransferService.transfer('demo-tx-1', '1', '2', 1);
    console.log('TransferService.transfer result:', result);
  } catch (err) {
    console.error('Call failed (expected in demo):', err?.message || err);
  }
}

main();
