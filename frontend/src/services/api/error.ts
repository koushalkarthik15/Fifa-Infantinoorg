/**
 * Standardized API error handling utilities.
 */

export class AppApiError extends Error {
  public readonly code: string
  public readonly status?: number
  public readonly details?: Record<string, unknown>

  constructor(message: string, code: string, status?: number, details?: Record<string, unknown>) {
    super(message)
    this.name = "AppApiError"
    this.code = code
    this.status = status
    this.details = details
  }
}

/**
 * Parses a non-OK fetch Response into a structured AppApiError.
 */
export async function parseErrorResponse(response: Response): Promise<AppApiError> {
  let message = `Request failed with status ${response.status}`
  let code = "UNKNOWN_ERROR"
  let details: Record<string, unknown> | undefined

  try {
    const body = await response.json()
    if (body.detail) {
      message = typeof body.detail === "string" ? body.detail : JSON.stringify(body.detail)
    }
    if (body.error?.code) {
      code = body.error.code
    }
    details = body
  } catch {
    // Response body was not JSON
  }

  return new AppApiError(message, code, response.status, details)
}

/**
 * Normalizes unknown thrown values into AppApiError instances.
 */
export function normalizeApiError(error: unknown): AppApiError {
  if (error instanceof AppApiError) return error

  if (error instanceof DOMException && error.name === "AbortError") {
    return new AppApiError("Request was cancelled", "UNKNOWN_ERROR")
  }

  if (error instanceof Error) {
    return new AppApiError(error.message, "UNKNOWN_ERROR")
  }

  return new AppApiError("An unexpected error occurred", "UNKNOWN_ERROR")
}
