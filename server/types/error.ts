export interface CustomError extends Error {
  statusCode?: number
  details?: Record<string, unknown>
  message: string
}
