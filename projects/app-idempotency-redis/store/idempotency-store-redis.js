import Redis from "ioredis";
import { IdempotencyEnum } from "../constants/idempotency.enum.js";

const TTL_SECONDS = 24 * 60 * 60; // 24 hours
const KEY_PREFIX = "idempotency:";

const redis = new Redis(process.env.REDIS_URL || "redis://localhost:6379", {
  connectionTimeout: 3000,
  commandTimeout: 3000,

  retryStrategy(times) {
    if (times > 3) return null;
    return Math.min(times * 200, 1000);
  },
});

redis.on("connect", () => console.log("[REDIS] Connected"));
redis.on("error", (err) => console.error("[REDIS] Connection error:", err));

const buildKey = (txId) => `${KEY_PREFIX}${txId}`;

// SET key value EX seconds NX
// NX = solo setea si el key NO existe — atómico
export class IdempotencyStore {
  static async startProcessing(txId) {
    const key = buildKey(txId);

    const result = await redis.set(
      key,
      JSON.stringify({ status: IdempotencyEnum.PROCESSING }),
      "EX",
      TTL_SECONDS,
      "NX",
    );

    if (result === "OK") {
      return { ok: true, status: IdempotencyEnum.PROCESSING, record: null };
    }

    const existing = await IdempotencyStore.get(txId);
    return {
      ok: false,
      status: "Exists",
      record: existing,
    };
  }

  // Obtain the value
  static async get(txId) {
    const value = await redis.get(buildKey(txId));
    if (!value) return null;
    return JSON.parse(value);
  }

  static async saveSuccess(txId, response) {
    await redis.set(
      buildKey(txId),
      JSON.stringify({ ok: true, status: IdempotencyEnum.SUCCESS, response }),
      "EX",
      TTL_SECONDS,
    );
  }

  /**
   * Marca el txId como fallido por razón de negocio.
   * NO borramos el key — guardamos el fallo para que
   * el mismo txId con datos diferentes sea rechazado.
   *
   * Ejemplo: txId "abc123" falló por saldo insuficiente.
   * Si el cliente reintenta con el mismo txId pero diferente amount
   * → rechazado, debe generar un nuevo txId.
   */
  static async saveFailure(txId, errorMessage) {
    await redis.set(
      buildKey(txId),
      JSON.stringify({
        ok: false,
        status: IdempotencyEnum.FAILED,
        errorMessage,
      }),
      "EX",
      TTL_SECONDS,
    );
  }

  static async clear(txId) {
    await redis.del(buildKey(txId));
  }

  static async disconnect() {
    await redis.quit();
  }
}
