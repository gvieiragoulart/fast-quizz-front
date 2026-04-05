import { createContext, useCallback, useState } from "react"
import type { ReactNode } from "react"

import { authService } from "@/services/auth"

interface AuthContextType {
    isAuthenticated: boolean
    login: (token: string) => void
    logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

interface AuthProviderProps {
    children: ReactNode
}

function AuthProvider({ children }: AuthProviderProps) {
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(
        authService.isAuthenticated(),
    )

    const login = useCallback((token: string) => {
        if (token && authService.isAuthenticated()) {
            setIsAuthenticated(true)
        }
    }, [])

    const logout = useCallback(() => {
        authService.logout()
        setIsAuthenticated(false)
    }, [])

    return (
        <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
            {children}
        </AuthContext.Provider>
    )
}

export { AuthContext, AuthProvider }
export type { AuthContextType }
