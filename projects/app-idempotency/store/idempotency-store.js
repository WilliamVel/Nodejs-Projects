import { IdempotencyEnum } from "../constants/idempotency.enum.js";

export class IdempotencyStore {
  static store = new Map();

  static async get(key) {
    if (!IdempotencyStore.store.has(key)) return null;
    if (IdempotencyStore.store.get(key).expiresAt < Date.now()) {
      IdempotencyStore.store.delete(key);
      return null;
    }
    return IdempotencyStore.store.get(key);
  }
  static async startProcessing(key) {
    const value = await IdempotencyStore.get(key);
    if (value === null) {
      IdempotencyStore.store.set(key, {
        expiresAt: Date.now() + 24 * 60 * 60 * 1000, // 24 hours
        status: IdempotencyEnum.PROCESSING,
      });
      return {
        ok: true,
        status: IdempotencyEnum.PROCESSING,
        record: null,
      };
    }
    return {
      ok: false,
      status: "Exists",
      record: value,
    };
  }
  static async saveSuccess(key, response) {
    IdempotencyStore.store.set(key, {
      ok: true,
      status: IdempotencyEnum.SUCCESS,
      expiresAt: Date.now() + 24 * 60 * 60 * 1000, // 24 hours
      response,
    });
  }
  static async clear(key) {
    IdempotencyStore.store.delete(key);
  }
}
