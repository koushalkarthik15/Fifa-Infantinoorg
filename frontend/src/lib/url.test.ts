import { describe, it, expect } from "vitest"
import { buildUrl } from "./url"

describe("url utilities", () => {
  describe("buildUrl", () => {
    it("appends query parameters correctly", () => {
      expect(buildUrl("/api/users", { page: 1, limit: 10 })).toBe("/api/users?page=1&limit=10")
    })
    it("ignores undefined, null, and empty string values", () => {
      expect(buildUrl("/api/users", { page: 1, sort: null, filter: undefined, q: "" })).toBe("/api/users?page=1")
    })
    it("returns original path if no valid params exist", () => {
      expect(buildUrl("/api/users", { sort: null })).toBe("/api/users")
      expect(buildUrl("/api/users")).toBe("/api/users")
    })
  })
})
