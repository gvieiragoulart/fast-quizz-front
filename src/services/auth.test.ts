import { describe, it, expect } from "vitest"
import { authService } from "@/services/auth"

describe("authService", () => {
    it("should store token on login", () => {
        const mockToken = "test-token-123"
        localStorage.setItem("access_token", mockToken)

        expect(authService.getToken()).toBe(mockToken)
        expect(authService.isAuthenticated()).toBe(true)

        localStorage.removeItem("access_token")
    })

    it("should remove token on logout", () => {
        localStorage.setItem("access_token", "test-token")
        authService.logout()

        expect(authService.getToken()).toBeNull()
        expect(authService.isAuthenticated()).toBe(false)
    })

    it("should return false for isAuthenticated when no token", () => {
        localStorage.removeItem("access_token")
        expect(authService.isAuthenticated()).toBe(false)
    })
})
