import { describe, it, expect, vi, beforeEach } from "vitest"
import { apiClient } from "./client"

describe("apiClient", () => {
  beforeEach(() => {
    vi.clearAllMocks()
    // Reset global fetch mock
    global.fetch = vi.fn()
  })

  it("supports AbortController signal for cancellation", async () => {
    const abortController = new AbortController()
    
    // Mock fetch to simulate a delay that respects the abort signal
    vi.mocked(global.fetch).mockImplementation(
      (url, options) =>
        new Promise((resolve, reject) => {
          if (options?.signal) {
            if (options.signal.aborted) {
              return reject(new DOMException("Aborted", "AbortError"))
            }
            options.signal.addEventListener("abort", () => {
              reject(new DOMException("Aborted", "AbortError"))
            })
          }
        })
    )

    // Fire request
    const requestPromise = apiClient.get("/test", { signal: abortController.signal })
    
    // Abort it immediately
    abortController.abort()

    // Assert it throws an AbortError mapped to AppApiError
    await expect(requestPromise).rejects.toThrow()
    
    try {
      await requestPromise
    } catch (error: unknown) {
      // The normalizeApiError will catch DOMException and wrap it
      expect((error as { name: string }).name).toBe("AppApiError")
      expect((error as { code: string }).code).toBe("UNKNOWN_ERROR")
    }
  })
})
