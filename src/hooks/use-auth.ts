import { useContext } from "react"

import { AuthContext } from "@/contexts/auth"

function useAuth() {
    const context = useContext(AuthContext)
    if (context === undefined) {
        throw new Error("useAuth deve ser usado dentro de AuthProvider")
    }
    return context
}

export { useAuth }
