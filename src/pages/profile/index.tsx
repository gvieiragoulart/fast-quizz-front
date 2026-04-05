import { useState } from "react"
import { useNavigate } from "react-router-dom"
import {
    User,
    BookOpen,
    Pencil,
    Trash2,
    Save,
    X,
    Clock,
    CalendarDays,
    Loader2,
    BarChart3,
    Trophy,
} from "lucide-react"

import { Button } from "@/components/atoms/button"
import { Input } from "@/components/atoms/input"
import { Label } from "@/components/atoms/label"
import { Badge } from "@/components/atoms/badge"
import { Separator } from "@/components/atoms/separator"
import { Avatar, AvatarFallback } from "@/components/atoms/avatar"
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/atoms/card"
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/atoms/dialog"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/atoms/select"
import { Alert, AlertDescription } from "@/components/atoms/alert"

import {
    useCurrentUser,
    useUpdateUser,
    useMyQuizzes,
    useDeleteQuiz,
    useUpdateQuiz,
    useQuizResults,
} from "@/hooks/use-api"
import type {
    Quiz,
    QuizFeedbackMode,
    QuizDifficulty,
    QuizUpdateRequest,
} from "@/types"

const difficultyConfig: Record<
    QuizDifficulty,
    { label: string; className: string }
> = {
    facil: { label: "Fácil", className: "bg-emerald-500 text-white" },
    medio: { label: "Médio", className: "bg-yellow-500 text-white" },
    dificil: { label: "Difícil", className: "bg-orange-500 text-white" },
    expert: { label: "Expert", className: "bg-red-500 text-white" },
}

type Tab = "info" | "quizzes"

function ProfilePage() {
    const navigate = useNavigate()
    const [activeTab, setActiveTab] = useState<Tab>("info")

    const { data: user, isLoading: userLoading } = useCurrentUser()
    const { mutateAsync: updateUser } = useUpdateUser()

    const [page, setPage] = useState(1)
    const { data: quizzesData, isLoading: quizzesLoading } = useMyQuizzes(page)
    const { mutateAsync: deleteQuiz } = useDeleteQuiz()
    const { mutateAsync: updateQuiz } = useUpdateQuiz()

    // Edit profile state
    const [isEditingProfile, setIsEditingProfile] = useState(false)
    const [editUsername, setEditUsername] = useState("")
    const [editEmail, setEditEmail] = useState("")
    const [editPassword, setEditPassword] = useState("")
    const [profileError, setProfileError] = useState<string | null>(null)
    const [profileSuccess, setProfileSuccess] = useState<string | null>(null)
    const [savingProfile, setSavingProfile] = useState(false)

    // Delete quiz dialog
    const [deleteTarget, setDeleteTarget] = useState<Quiz | null>(null)
    const [deleting, setDeleting] = useState(false)

    // Edit quiz dialog
    const [editTarget, setEditTarget] = useState<Quiz | null>(null)
    const [editQuizTitle, setEditQuizTitle] = useState("")
    const [editQuizDescription, setEditQuizDescription] = useState("")
    const [editQuizTime, setEditQuizTime] = useState<number | "">("")
    const [editQuizFeedback, setEditQuizFeedback] =
        useState<QuizFeedbackMode>("final")
    const [editQuizDifficulty, setEditQuizDifficulty] = useState<
        QuizDifficulty | ""
    >("")
    const [savingQuiz, setSavingQuiz] = useState(false)
    const [quizError, setQuizError] = useState<string | null>(null)

    // Results dialog
    const [resultsQuiz, setResultsQuiz] = useState<Quiz | null>(null)
    const { data: resultsData, isLoading: resultsLoading } = useQuizResults(
        resultsQuiz?.id ?? "",
        !!resultsQuiz,
    )

    const startEditProfile = () => {
        if (!user) return
        setEditUsername(user.username)
        setEditEmail(user.email)
        setEditPassword("")
        setProfileError(null)
        setProfileSuccess(null)
        setIsEditingProfile(true)
    }

    const handleSaveProfile = async () => {
        if (!user) return
        if (!editUsername.trim() || editUsername.trim().length < 3) {
            setProfileError("Username deve ter pelo menos 3 caracteres.")
            return
        }
        if (!editEmail.trim()) {
            setProfileError("Email é obrigatório.")
            return
        }

        setSavingProfile(true)
        setProfileError(null)
        try {
            const data: Record<string, string> = {}
            if (editUsername !== user.username) data.username = editUsername
            if (editEmail !== user.email) data.email = editEmail
            if (editPassword) data.password = editPassword

            if (Object.keys(data).length === 0) {
                setIsEditingProfile(false)
                return
            }

            await updateUser({ userId: user.id, data })
            setProfileSuccess("Perfil atualizado com sucesso!")
            setIsEditingProfile(false)
        } catch {
            setProfileError("Erro ao atualizar perfil. Tente novamente.")
        } finally {
            setSavingProfile(false)
        }
    }

    const openEditQuiz = (quiz: Quiz) => {
        setEditTarget(quiz)
        setEditQuizTitle(quiz.title)
        setEditQuizDescription(quiz.description)
        setEditQuizTime(quiz.estimated_time ?? "")
        setEditQuizFeedback(quiz.feedback_mode ?? "final")
        setEditQuizDifficulty(quiz.difficulty ?? "")
        setQuizError(null)
    }

    const handleSaveQuiz = async () => {
        if (!editTarget) return
        if (!editQuizTitle.trim() || editQuizTitle.trim().length < 3) {
            setQuizError("Título deve ter pelo menos 3 caracteres.")
            return
        }

        setSavingQuiz(true)
        setQuizError(null)
        try {
            const data: QuizUpdateRequest = {
                title: editQuizTitle,
                description: editQuizDescription,
                estimated_time:
                    editQuizTime !== "" ? editQuizTime : undefined,
                feedback_mode: editQuizFeedback,
                difficulty: editQuizDifficulty || undefined,
            }
            await updateQuiz({ quizId: editTarget.id, data })
            setEditTarget(null)
        } catch {
            setQuizError("Erro ao atualizar quiz. Tente novamente.")
        } finally {
            setSavingQuiz(false)
        }
    }

    const handleDeleteQuiz = async () => {
        if (!deleteTarget) return
        setDeleting(true)
        try {
            await deleteQuiz(deleteTarget.id)
            setDeleteTarget(null)
        } catch {
            // error is visible to user via the dialog staying open
        } finally {
            setDeleting(false)
        }
    }

    if (userLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
        )
    }

    if (!user) {
        return (
            <div className="min-h-screen flex items-center justify-center px-4">
                <div className="text-center space-y-4">
                    <p className="text-muted-foreground">
                        Não foi possível carregar o perfil.
                    </p>
                    <Button onClick={() => navigate("/login")}>
                        Fazer Login
                    </Button>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-muted/30 pb-16">
            <div className="container mx-auto max-w-3xl px-4 pt-8">
                {/* Header */}
                <div className="flex items-center gap-4 mb-6">
                    <Avatar className="w-16 h-16 bg-blue-600">
                        <AvatarFallback className="bg-blue-600 text-white text-2xl font-bold">
                            {user.username.charAt(0).toUpperCase()}
                        </AvatarFallback>
                    </Avatar>
                    <div>
                        <h1 className="text-2xl font-bold">
                            {user.username}
                        </h1>
                        <p className="text-sm text-muted-foreground">
                            {user.email}
                        </p>
                    </div>
                </div>

                {/* Tabs */}
                <div className="flex gap-1 mb-6">
                    <Button
                        variant={activeTab === "info" ? "default" : "ghost"}
                        onClick={() => setActiveTab("info")}
                    >
                        <User className="w-4 h-4 mr-2" />
                        Informações
                    </Button>
                    <Button
                        variant={activeTab === "quizzes" ? "default" : "ghost"}
                        onClick={() => setActiveTab("quizzes")}
                    >
                        <BookOpen className="w-4 h-4 mr-2" />
                        Meus Quizzes
                    </Button>
                </div>

                <Separator className="mb-6" />

                {/* Alerts */}
                {profileSuccess && (
                    <Alert className="mb-4 border-emerald-200 bg-emerald-50 text-emerald-800">
                        <AlertDescription>{profileSuccess}</AlertDescription>
                    </Alert>
                )}

                {/* Tab: Info */}
                {activeTab === "info" && (
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between">
                            <CardTitle className="text-base">
                                Dados Pessoais
                            </CardTitle>
                            {!isEditingProfile && (
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={startEditProfile}
                                >
                                    <Pencil className="w-4 h-4 mr-1" />
                                    Editar
                                </Button>
                            )}
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {profileError && (
                                <Alert variant="destructive">
                                    <AlertDescription>
                                        {profileError}
                                    </AlertDescription>
                                </Alert>
                            )}

                            {isEditingProfile ? (
                                <>
                                    <div className="space-y-1">
                                        <Label htmlFor="edit-username">
                                            Username
                                        </Label>
                                        <Input
                                            id="edit-username"
                                            value={editUsername}
                                            onChange={(e) =>
                                                setEditUsername(e.target.value)
                                            }
                                        />
                                    </div>
                                    <div className="space-y-1">
                                        <Label htmlFor="edit-email">
                                            Email
                                        </Label>
                                        <Input
                                            id="edit-email"
                                            type="email"
                                            value={editEmail}
                                            onChange={(e) =>
                                                setEditEmail(e.target.value)
                                            }
                                        />
                                    </div>
                                    <div className="space-y-1">
                                        <Label htmlFor="edit-password">
                                            Nova senha (opcional)
                                        </Label>
                                        <Input
                                            id="edit-password"
                                            type="password"
                                            value={editPassword}
                                            onChange={(e) =>
                                                setEditPassword(e.target.value)
                                            }
                                            placeholder="Deixe em branco para manter"
                                        />
                                    </div>
                                    <div className="flex gap-2 pt-2">
                                        <Button
                                            onClick={handleSaveProfile}
                                            disabled={savingProfile}
                                        >
                                            {savingProfile ? (
                                                <Loader2 className="w-4 h-4 mr-1 animate-spin" />
                                            ) : (
                                                <Save className="w-4 h-4 mr-1" />
                                            )}
                                            Salvar
                                        </Button>
                                        <Button
                                            variant="ghost"
                                            onClick={() =>
                                                setIsEditingProfile(false)
                                            }
                                        >
                                            <X className="w-4 h-4 mr-1" />
                                            Cancelar
                                        </Button>
                                    </div>
                                </>
                            ) : (
                                <>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <p className="text-xs text-muted-foreground">
                                                Username
                                            </p>
                                            <p className="font-medium">
                                                {user.username}
                                            </p>
                                        </div>
                                        <div>
                                            <p className="text-xs text-muted-foreground">
                                                Email
                                            </p>
                                            <p className="font-medium">
                                                {user.email}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                        <CalendarDays className="w-4 h-4" />
                                        Membro desde{" "}
                                        {new Date(
                                            user.created_at,
                                        ).toLocaleDateString("pt-BR")}
                                    </div>
                                </>
                            )}
                        </CardContent>
                    </Card>
                )}

                {/* Tab: Quizzes */}
                {activeTab === "quizzes" && (
                    <div className="space-y-4">
                        {quizzesLoading ? (
                            <div className="flex justify-center py-12">
                                <Loader2 className="w-8 h-8 animate-spin text-primary" />
                            </div>
                        ) : !quizzesData?.items.length ? (
                            <Card>
                                <CardContent className="py-12 text-center">
                                    <p className="text-muted-foreground mb-4">
                                        Você ainda não criou nenhum quiz.
                                    </p>
                                    <Button
                                        onClick={() => navigate("/create")}
                                    >
                                        Criar meu primeiro quiz
                                    </Button>
                                </CardContent>
                            </Card>
                        ) : (
                            <>
                                {quizzesData.items.map((quiz) => (
                                    <Card key={quiz.id}>
                                        <CardContent className="flex items-center justify-between py-4">
                                            <div className="flex-1 min-w-0 mr-4">
                                                <div className="flex items-center gap-2 mb-1">
                                                    <h3 className="font-semibold truncate">
                                                        {quiz.title}
                                                    </h3>
                                                    {quiz.difficulty &&
                                                        difficultyConfig[
                                                            quiz.difficulty
                                                        ] && (
                                                            <Badge
                                                                className={
                                                                    difficultyConfig[
                                                                        quiz
                                                                            .difficulty
                                                                    ].className
                                                                }
                                                            >
                                                                {
                                                                    difficultyConfig[
                                                                        quiz
                                                                            .difficulty
                                                                    ].label
                                                                }
                                                            </Badge>
                                                        )}
                                                </div>
                                                <p className="text-sm text-muted-foreground line-clamp-1">
                                                    {quiz.description}
                                                </p>
                                                <div className="flex gap-3 mt-1 text-xs text-muted-foreground">
                                                    {quiz.estimated_time && (
                                                        <span className="flex items-center gap-1">
                                                            <Clock className="w-3 h-3" />
                                                            {
                                                                quiz.estimated_time
                                                            }{" "}
                                                            min
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                            <div className="flex gap-1 shrink-0">
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    title="Ver resultados"
                                                    onClick={() =>
                                                        setResultsQuiz(quiz)
                                                    }
                                                >
                                                    <BarChart3 className="w-4 h-4" />
                                                </Button>
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    title="Editar"
                                                    onClick={() =>
                                                        openEditQuiz(quiz)
                                                    }
                                                >
                                                    <Pencil className="w-4 h-4" />
                                                </Button>
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    className="text-red-500 hover:text-red-600"
                                                    title="Excluir"
                                                    onClick={() =>
                                                        setDeleteTarget(quiz)
                                                    }
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </Button>
                                            </div>
                                        </CardContent>
                                    </Card>
                                ))}

                                {/* Pagination */}
                                {quizzesData.total_pages > 1 && (
                                    <div className="flex justify-center gap-2 pt-4">
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            disabled={page <= 1}
                                            onClick={() =>
                                                setPage((p) => p - 1)
                                            }
                                        >
                                            Anterior
                                        </Button>
                                        <span className="flex items-center text-sm text-muted-foreground">
                                            {page} de {quizzesData.total_pages}
                                        </span>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            disabled={
                                                page >=
                                                quizzesData.total_pages
                                            }
                                            onClick={() =>
                                                setPage((p) => p + 1)
                                            }
                                        >
                                            Próxima
                                        </Button>
                                    </div>
                                )}
                            </>
                        )}
                    </div>
                )}
            </div>

            {/* Delete confirmation dialog */}
            <Dialog
                open={!!deleteTarget}
                onOpenChange={() => setDeleteTarget(null)}
            >
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Excluir Quiz</DialogTitle>
                    </DialogHeader>
                    <p className="text-sm text-muted-foreground">
                        Tem certeza que deseja excluir{" "}
                        <strong>{deleteTarget?.title}</strong>? Esta ação não
                        pode ser desfeita.
                    </p>
                    <DialogFooter>
                        <Button
                            variant="outline"
                            onClick={() => setDeleteTarget(null)}
                        >
                            Cancelar
                        </Button>
                        <Button
                            variant="destructive"
                            onClick={handleDeleteQuiz}
                            disabled={deleting}
                        >
                            {deleting ? (
                                <Loader2 className="w-4 h-4 mr-1 animate-spin" />
                            ) : (
                                <Trash2 className="w-4 h-4 mr-1" />
                            )}
                            Excluir
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Edit quiz dialog */}
            <Dialog
                open={!!editTarget}
                onOpenChange={() => setEditTarget(null)}
            >
                <DialogContent className="max-w-lg">
                    <DialogHeader>
                        <DialogTitle>Editar Quiz</DialogTitle>
                    </DialogHeader>

                    {quizError && (
                        <Alert variant="destructive">
                            <AlertDescription>{quizError}</AlertDescription>
                        </Alert>
                    )}

                    <div className="space-y-4">
                        <div className="space-y-1">
                            <Label htmlFor="eq-title">Título</Label>
                            <Input
                                id="eq-title"
                                value={editQuizTitle}
                                onChange={(e) =>
                                    setEditQuizTitle(e.target.value)
                                }
                            />
                        </div>
                        <div className="space-y-1">
                            <Label htmlFor="eq-desc">Descrição</Label>
                            <Input
                                id="eq-desc"
                                value={editQuizDescription}
                                onChange={(e) =>
                                    setEditQuizDescription(e.target.value)
                                }
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1">
                                <Label htmlFor="eq-time">
                                    Duração (min)
                                </Label>
                                <Input
                                    id="eq-time"
                                    type="number"
                                    min={1}
                                    value={editQuizTime}
                                    onChange={(e) =>
                                        setEditQuizTime(
                                            e.target.value === ""
                                                ? ""
                                                : Number(e.target.value),
                                        )
                                    }
                                />
                            </div>
                            <div className="space-y-1">
                                <Label>Feedback</Label>
                                <Select
                                    value={editQuizFeedback}
                                    onValueChange={(v) =>
                                        setEditQuizFeedback(
                                            v as QuizFeedbackMode,
                                        )
                                    }
                                >
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="final">
                                            Resumo Final
                                        </SelectItem>
                                        <SelectItem value="imediato">
                                            Resposta Imediata
                                        </SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                        <div className="space-y-1">
                            <Label>Dificuldade</Label>
                            <Select
                                value={editQuizDifficulty}
                                onValueChange={(v) =>
                                    setEditQuizDifficulty(
                                        v as QuizDifficulty,
                                    )
                                }
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Selecionar..." />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="facil">
                                        <span className="text-emerald-600 font-medium">
                                            Fácil
                                        </span>
                                    </SelectItem>
                                    <SelectItem value="medio">
                                        <span className="text-yellow-600 font-medium">
                                            Médio
                                        </span>
                                    </SelectItem>
                                    <SelectItem value="dificil">
                                        <span className="text-orange-600 font-medium">
                                            Difícil
                                        </span>
                                    </SelectItem>
                                    <SelectItem value="expert">
                                        <span className="text-red-600 font-medium">
                                            Expert
                                        </span>
                                    </SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    <DialogFooter>
                        <Button
                            variant="outline"
                            onClick={() => setEditTarget(null)}
                        >
                            Cancelar
                        </Button>
                        <Button
                            onClick={handleSaveQuiz}
                            disabled={savingQuiz}
                        >
                            {savingQuiz ? (
                                <Loader2 className="w-4 h-4 mr-1 animate-spin" />
                            ) : (
                                <Save className="w-4 h-4 mr-1" />
                            )}
                            Salvar
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Results dialog */}
            <Dialog
                open={!!resultsQuiz}
                onOpenChange={() => setResultsQuiz(null)}
            >
                <DialogContent className="max-w-lg max-h-[80vh] flex flex-col">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2">
                            <BarChart3 className="w-5 h-5" />
                            Resultados: {resultsQuiz?.title}
                        </DialogTitle>
                    </DialogHeader>

                    <div className="flex-1 overflow-y-auto">
                        {resultsLoading ? (
                            <div className="flex justify-center py-8">
                                <Loader2 className="w-6 h-6 animate-spin text-primary" />
                            </div>
                        ) : !resultsData?.items?.length ? (
                            <p className="text-center text-muted-foreground py-8">
                                Nenhuma resposta registrada para este quiz ainda.
                            </p>
                        ) : (
                            <>
                                {/* Summary */}
                                <div className="grid grid-cols-3 gap-3 mb-4">
                                    <div className="text-center p-3 bg-muted/50 rounded-lg">
                                        <p className="text-2xl font-bold">
                                            {resultsData.items.length}
                                        </p>
                                        <p className="text-xs text-muted-foreground">
                                            Respostas
                                        </p>
                                    </div>
                                    <div className="text-center p-3 bg-muted/50 rounded-lg">
                                        <p className="text-2xl font-bold">
                                            {Math.round(
                                                resultsData.items.reduce(
                                                    (acc, r) => acc + r.score,
                                                    0,
                                                ) / resultsData.items.length,
                                            )}
                                            %
                                        </p>
                                        <p className="text-xs text-muted-foreground">
                                            Média
                                        </p>
                                    </div>
                                    <div className="text-center p-3 bg-muted/50 rounded-lg">
                                        <p className="text-2xl font-bold">
                                            {Math.max(
                                                ...resultsData.items.map(
                                                    (r) => r.score,
                                                ),
                                            )}
                                            %
                                        </p>
                                        <p className="text-xs text-muted-foreground">
                                            Melhor nota
                                        </p>
                                    </div>
                                </div>

                                <Separator className="mb-3" />

                                {/* Results list */}
                                <div className="space-y-2">
                                    {resultsData.items
                                        .sort((a, b) => b.score - a.score)
                                        .map((result, index) => (
                                            <div
                                                key={result.id}
                                                className="flex items-center justify-between py-2 px-3 rounded-lg hover:bg-muted/50"
                                            >
                                                <div className="flex items-center gap-3">
                                                    <span className="text-sm font-mono text-muted-foreground w-6">
                                                        {index === 0 ? (
                                                            <Trophy className="w-4 h-4 text-yellow-500" />
                                                        ) : (
                                                            `${index + 1}.`
                                                        )}
                                                    </span>
                                                    <div>
                                                        <p className="font-medium text-sm">
                                                            {
                                                                result.respondent_name
                                                            }
                                                        </p>
                                                        <p className="text-xs text-muted-foreground">
                                                            {new Date(
                                                                result.taken_at,
                                                            ).toLocaleDateString(
                                                                "pt-BR",
                                                                {
                                                                    day: "2-digit",
                                                                    month: "short",
                                                                    hour: "2-digit",
                                                                    minute: "2-digit",
                                                                },
                                                            )}
                                                        </p>
                                                    </div>
                                                </div>
                                                <Badge
                                                    className={
                                                        result.score >= 70
                                                            ? "bg-emerald-500 text-white"
                                                            : result.score >= 40
                                                              ? "bg-yellow-500 text-white"
                                                              : "bg-red-500 text-white"
                                                    }
                                                >
                                                    {result.score}%
                                                </Badge>
                                            </div>
                                        ))}
                                </div>
                            </>
                        )}
                    </div>

                    <DialogFooter>
                        <Button
                            variant="outline"
                            onClick={() => setResultsQuiz(null)}
                        >
                            Fechar
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    )
}

export { ProfilePage }
