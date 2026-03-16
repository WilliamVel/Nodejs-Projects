// ── Respuesta estándar de la API ──────────────────
export interface ApiResponse<T = undefined> {
  success: boolean;
  message: string;
  data?: T;
  errors?: unknown[];
}
 
// ── Respuesta estándar de servicios internos ──────
// Nunca retornar throw desde un service — siempre ServiceResult
export interface ServiceResult<T = undefined> {
  success: boolean;
  message: string;
  code?: string;
  data?: T;
}