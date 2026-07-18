import { env } from "@/config/env"
import { normalizeApiError, parseErrorResponse } from "./error"
import { buildUrl } from "@/lib/url"

export interface APIResponse<T = unknown> {
  success: boolean;
  message: string;
  data?: T;
}


interface FetchOptions extends RequestInit {
  params?: Record<string, string | number | boolean | undefined | null>
}

type Middleware = (options: RequestInit) => RequestInit | Promise<RequestInit>

class ApiClient {
  private middlewares: Middleware[] = []
  private baseUrl: string

  constructor(baseUrl?: string) {
    // If not provided, fallback to the environment or an empty string for relative paths
    this.baseUrl = baseUrl ?? env.NEXT_PUBLIC_API_URL ?? ""
  }

  /**
   * Register a middleware to intercept and modify requests before they are sent.
   */
  public use(middleware: Middleware) {
    this.middlewares.push(middleware)
  }

  private async executeMiddlewares(options: RequestInit): Promise<RequestInit> {
    let currentOptions = { ...options }
    for (const middleware of this.middlewares) {
      currentOptions = await middleware(currentOptions)
    }
    return currentOptions
  }

  /**
   * Core request method utilizing native fetch.
   */
  public async request<T>(endpoint: string, options: FetchOptions = {}): Promise<T> {
    try {
      const { params, ...customOptions } = options
      
      // Default headers
      const defaultHeaders: HeadersInit = {
        "Content-Type": "application/json",
        Accept: "application/json",
      }

      let requestOptions: RequestInit = {
        ...customOptions,
        headers: {
          ...defaultHeaders,
          ...customOptions.headers,
        },
      }

      // Execute pre-request middleware (e.g., attaching auth tokens)
      requestOptions = await this.executeMiddlewares(requestOptions)

      // Build full URL with query parameters
      const fullPath = endpoint.startsWith("http") ? endpoint : `${this.baseUrl}${endpoint}`
      const url = buildUrl(fullPath, params)

      const response = await fetch(url, requestOptions)

      if (!response.ok) {
        throw await parseErrorResponse(response)
      }

      // 204 No Content handling
      if (response.status === 204) {
        return {} as T
      }

      return (await response.json()) as T
    } catch (error) {
      throw normalizeApiError(error)
    }
  }

  public get<T>(endpoint: string, options?: Omit<FetchOptions, "method">) {
    return this.request<T>(endpoint, { ...options, method: "GET" })
  }

  public post<T>(endpoint: string, data?: unknown, options?: Omit<FetchOptions, "method" | "body">) {
    return this.request<T>(endpoint, {
      ...options,
      method: "POST",
      body: data ? JSON.stringify(data) : undefined,
    })
  }

  public put<T>(endpoint: string, data?: unknown, options?: Omit<FetchOptions, "method" | "body">) {
    return this.request<T>(endpoint, {
      ...options,
      method: "PUT",
      body: data ? JSON.stringify(data) : undefined,
    })
  }

  public patch<T>(endpoint: string, data?: unknown, options?: Omit<FetchOptions, "method" | "body">) {
    return this.request<T>(endpoint, {
      ...options,
      method: "PATCH",
      body: data ? JSON.stringify(data) : undefined,
    })
  }

  public delete<T>(endpoint: string, options?: Omit<FetchOptions, "method">) {
    return this.request<T>(endpoint, { ...options, method: "DELETE" })
  }
}

// Export a singleton instance for global application usage
export const apiClient = new ApiClient()
