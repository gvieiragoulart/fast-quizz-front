import { createBrowserRouter } from "react-router-dom"

import { MainLayout } from "@/components/templates/main-layout"
import { ProtectedRoute } from "@/components/organisms/protected-route"
import { HomePage } from "@/pages/home"
import { LoginPage } from "@/pages/login"
import { RegisterPage } from "@/pages/register"
import { QuizPage } from "@/pages/quiz"
import { ResultsPage } from "@/pages/results"
import { CreateQuizPage } from "@/pages/create-quiz"
import { ProfilePage } from "@/pages/profile"

const router = createBrowserRouter([
    {
        element: <MainLayout />,
        children: [
            {
                path: "/",
                element: <HomePage />,
            },
            {
                path: "/my-quizzes",
                element: (
                    <ProtectedRoute>
                        <HomePage />
                    </ProtectedRoute>
                ),
            },
            {
                path: "/login",
                element: <LoginPage />,
            },
            {
                path: "/register",
                element: <RegisterPage />,
            },
            {
                path: "/quiz/:quizId",
                element: <QuizPage />,
            },
            {
                path: "/quiz/:quizId/results",
                element: <ResultsPage />,
            },
            {
                path: "/create",
                element: (
                    <ProtectedRoute>
                        <CreateQuizPage />
                    </ProtectedRoute>
                ),
            },
            {
                path: "/profile",
                element: (
                    <ProtectedRoute>
                        <ProfilePage />
                    </ProtectedRoute>
                ),
            },
        ],
    },
])

export { router }
