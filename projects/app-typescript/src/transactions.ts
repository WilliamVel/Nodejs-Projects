import { TransferResult } from './types/transfer.type';

export const transactions: TransferResult[] = [
  { txId: 'tx1', fromUserId: 1, toUserId: 2, amount: 50.00,  status: 'SUCCESS',    timestamp: '2026-03-01T08:00:00Z' },
  { txId: 'tx2', fromUserId: 1, toUserId: 3, amount: 200.00, status: 'FAILED',     timestamp: '2026-03-05T14:00:00Z' },
  { txId: 'tx3', fromUserId: 2, toUserId: 1, amount: 75.00,  status: 'SUCCESS',    timestamp: '2026-03-10T09:00:00Z' },
  { txId: 'tx4', fromUserId: 1, toUserId: 2, amount: 30.00,  status: 'PROCESSING', timestamp: '2026-03-15T07:00:00Z' },
  { txId: 'tx5', fromUserId: 3, toUserId: 1, amount: 120.00, status: 'SUCCESS',    timestamp: '2026-03-15T08:30:00Z' },
];