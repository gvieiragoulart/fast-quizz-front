import { useNavigate } from "react-router-dom"
import { LogOut, User, Zap } from "lucide-react"

import { Button } from "@/components/atoms/button"
import { Avatar, AvatarFallback } from "@/components/atoms/avatar"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/atoms/dropdown-menu"
import { useAuth } from "@/hooks/use-auth"

function Navbar() {
    const navigate = useNavigate()
    const { isAuthenticated, logout } = useAuth()

    const handleLogout = () => {
        logout()
        navigate("/")
    }

    return (
        <header className="sticky top-0 z-50 w-full border-b bg-white shadow-sm">
            <div className="container mx-auto flex h-16 items-center justify-between px-4">
                <div className="flex items-center gap-6">
                    <button
                        type="button"
                        onClick={() => navigate("/")}
                        className="flex items-center gap-2 font-bold text-xl text-blue-600"
                    >
                        <Zap className="w-5 h-5" />
                        Fast Quiz
                    </button>

                    <nav className="hidden md:flex items-center gap-1">
                        <Button variant="ghost" onClick={() => navigate("/")}>
                            Explorar
                        </Button>
                        {isAuthenticated && (
                            <Button
                                variant="ghost"
                                onClick={() => navigate("/my-quizzes")}
                            >
                                Meus Quizzes
                            </Button>
                        )}
                    </nav>
                </div>

                <div className="flex items-center gap-2">
                    {isAuthenticated ? (
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <button
                                    type="button"
                                    className="rounded-full focus:outline-none focus:ring-2 focus:ring-ring"
                                >
                                    <Avatar className="w-8 h-8 bg-blue-600">
                                        <AvatarFallback className="bg-blue-600 text-white text-sm font-bold">
                                            U
                                        </AvatarFallback>
                                    </Avatar>
                                </button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-48">
                                <DropdownMenuItem
                                    onClick={() => navigate("/profile")}
                                >
                                    <User className="mr-2 h-4 w-4" />
                                    Meu Perfil
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem
                                    onClick={handleLogout}
                                    className="text-red-600"
                                >
                                    <LogOut className="mr-2 h-4 w-4" />
                                    Sair
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    ) : (
                        <>
                            <Button
                                variant="ghost"
                                onClick={() => navigate("/login")}
                            >
                                Login
                            </Button>
                            <Button onClick={() => navigate("/register")}>
                                Registrar
                            </Button>
                        </>
                    )}
                </div>
            </div>
        </header>
    )
}

export { Navbar }
