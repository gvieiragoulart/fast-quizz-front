import { useState } from "react"
import { useNavigate } from "react-router-dom"
import {
    Plus,
    Trash2,
    ChevronLeft,
    ChevronRight,
    Upload,
    Save,
    HelpCircle,
    Clock,
    ImagePlus,
    X,
} from "lucide-react"

import { Button } from "@/components/atoms/button"
import { Input } from "@/components/atoms/input"
import { Label } from "@/components/atoms/label"
import { Textarea } from "@/components/atoms/textarea"
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/atoms/card"
import { RadioGroup, RadioGroupItem } from "@/components/atoms/radio-group"
import { Separator } from "@/components/atoms/separator"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/atoms/select"
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/atoms/dialog"
import { Alert, AlertDescription } from "@/components/atoms/alert"
import type {
    QuizFeedbackMode,
    QuizDifficulty,
    Question,
    QuestionOption,
} from "@/types"
import { useCreateQuiz, useUploadQuizImage } from "@/hooks/use-api"
import { useQuizJsonValidator } from "@/hooks/use-quiz-json-validator"

interface ImportedQuestion {
    text: string
    correct_answer?: string | number
    options: Array<{
        text: string
        is_correct?: boolean
        order?: number
        reference_id?: number
    }>
}

function CreateQuizPage() {
    const navigate = useNavigate()
    const [quizTitle, setQuizTitle] = useState("")
    const [quizDescription, setQuizDescription] = useState("")
    const [estimatedTime, setEstimatedTime] = useState<number | "">("")
    const [feedbackMode, setFeedbackMode] = useState<QuizFeedbackMode>("final")
    const [difficulty, setDifficulty] = useState<QuizDifficulty | "">("")
    const [imageFile, setImageFile] = useState<File | null>(null)
    const [imagePreview, setImagePreview] = useState<string | null>(null)
    const [questions, setQuestions] = useState<Partial<Question>[]>([
        {
            text: "",
            options: [
                {
                    reference_id: 1,
                    id: "1",
                    text: "",
                    order: 0,
                    is_correct: true,
                },
                {
                    reference_id: 2,
                    id: "2",
                    text: "",
                    order: 1,
                    is_correct: false,
                },
                {
                    reference_id: 3,
                    id: "3",
                    text: "",
                    order: 2,
                    is_correct: false,
                },
                {
                    reference_id: 4,
                    id: "4",
                    text: "",
                    order: 3,
                    is_correct: false,
                },
            ],
        },
    ])
    const { mutateAsync: createQuiz } = useCreateQuiz()
    const { mutateAsync: uploadImage } = useUploadQuizImage()

    const [activeStep, setActiveStep] = useState(0)
    const [isImportDialogOpen, setIsImportDialogOpen] = useState(false)
    const { jsonInput, errors: jsonErrors, isValid: jsonIsValid, handleChange: handleJsonInputChange, validate: validateJson, reset: resetJson } = useQuizJsonValidator()
    const [error, setError] = useState<string | null>(null)
    const [successMessage, setSuccessMessage] = useState<string | null>(null)

    const maxSteps = questions.length

    const addQuestion = () => {
        const newQuestion: Partial<Question> = {
            text: "",
            correct_answer: 1,
            options: [
                {
                    id: Math.random().toString(),
                    reference_id: 1,
                    text: "",
                    order: 0,
                    is_correct: true,
                },
                {
                    id: Math.random().toString(),
                    reference_id: 2,
                    text: "",
                    order: 1,
                    is_correct: false,
                },
                {
                    id: Math.random().toString(),
                    reference_id: 3,
                    text: "",
                    order: 2,
                    is_correct: false,
                },
                {
                    id: Math.random().toString(),
                    reference_id: 4,
                    text: "",
                    order: 3,
                    is_correct: false,
                },
            ],
        }
        setQuestions([...questions, newQuestion])
        setActiveStep(questions.length)
    }

    const removeQuestion = (index: number) => {
        if (questions.length === 1) return
        const newQuestions = questions.filter((_, i) => i !== index)
        setQuestions(newQuestions)
        if (activeStep >= newQuestions.length)
            setActiveStep(newQuestions.length - 1)
    }

    const updateQuestionText = (text: string) => {
        const newQuestions = [...questions]
        newQuestions[activeStep].text = text
        setQuestions(newQuestions)
    }

    const updateOptionText = (optionIndex: number, text: string) => {
        const newQuestions = [...questions]
        if (newQuestions[activeStep].options) {
            newQuestions[activeStep].options![optionIndex].text = text
        }
        setQuestions(newQuestions)
    }

    const setCorrectOption = (optionIndex: number) => {
        const newQuestions = [...questions]
        if (newQuestions[activeStep].options) {
            newQuestions[activeStep].options!.forEach((opt, i) => {
                opt.is_correct = i === optionIndex
            })
            const correctOption = newQuestions[activeStep].options!.find(
                (opt) => opt.is_correct,
            )
            if (correctOption) {
                newQuestions[activeStep].correct_answer =
                    correctOption.reference_id
            }
        }
        setQuestions(newQuestions)
    }

    const handleImportJson = () => {
        const errors = validateJson()
        if (errors.length > 0) return

        try {
            const parsed = JSON.parse(jsonInput) as ImportedQuestion[]

            const importedQuestions: Partial<Question>[] = parsed.map((q) => {
                const options: QuestionOption[] = q.options.map(
                    (opt, index) => {
                        let isCorrect = opt.is_correct ?? false
                        if (q.correct_answer && opt.text === q.correct_answer)
                            isCorrect = true
                        return {
                            id: Math.random().toString(),
                            text: opt.text || "",
                            order: opt.order ?? index,
                            reference_id: opt.reference_id ?? index + 1,
                            is_correct: isCorrect,
                        }
                    },
                )
                if (
                    !options.some((opt) => opt.is_correct) &&
                    options.length > 0
                )
                    options[0].is_correct = true
                const correctOpt = options.find((opt) => opt.is_correct)
                return {
                    text: q.text,
                    correct_answer:
                        typeof q.correct_answer === "number"
                            ? q.correct_answer
                            : correctOpt?.reference_id ?? 1,
                    options,
                }
            })

            setQuestions(importedQuestions)
            setActiveStep(0)
            setIsImportDialogOpen(false)
            resetJson()
            setSuccessMessage("Perguntas importadas com sucesso!")
        } catch (err: unknown) {
            const message =
                err instanceof Error ? err.message : "Erro desconhecido"
            setError("Erro ao processar JSON: " + message)
        }
    }

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file) return

        if (!["image/jpeg", "image/png", "image/webp"].includes(file.type)) {
            setError("Formato de imagem invalido. Use JPEG, PNG ou WebP.")
            return
        }
        if (file.size > 1 * 1024 * 1024) {
            setError("A imagem deve ter no maximo 1 MB.")
            return
        }

        setImageFile(file)
        setImagePreview(URL.createObjectURL(file))
        setError(null)
    }

    const removeImage = () => {
        setImageFile(null)
        if (imagePreview) URL.revokeObjectURL(imagePreview)
        setImagePreview(null)
    }

    const handleSaveQuiz = async () => {
        if (!quizTitle) {
            setError("Por favor, insira um titulo para o quiz.")
            return
        }

        try {
            const createdQuiz = await createQuiz({
                title: quizTitle,
                description: quizDescription,
                estimated_time:
                    estimatedTime !== "" ? estimatedTime : undefined,
                feedback_mode: feedbackMode,
                difficulty: difficulty || undefined,
                questions: questions as Array<{
                    text: string
                    correct_answer: number
                    options: Array<{
                        reference_id: number
                        is_correct?: boolean
                        text: string
                    }>
                }>,
            })

            if (imageFile && createdQuiz?.id) {
                await uploadImage({
                    quizId: createdQuiz.id,
                    file: imageFile,
                })
            }

            setQuizTitle("")
            setQuizDescription("")
            setEstimatedTime("")
            setFeedbackMode("final")
            setDifficulty("")
            removeImage()
            setSuccessMessage("Quiz salvo com sucesso!")
            navigate("/")
        } catch {
            setError("Erro ao salvar o quiz. Tente novamente.")
        }
    }

    return (
        <div className="min-h-screen bg-muted/30 pb-16">
            <div className="container mx-auto max-w-3xl px-4 pt-8">
                <div className="flex items-center justify-between mb-6">
                    <h1 className="text-2xl font-bold text-blue-600">
                        Criar Novo Quiz
                    </h1>
                    <div className="flex gap-2">
                        <Button
                            variant="outline"
                            onClick={() => setIsImportDialogOpen(true)}
                        >
                            <Upload className="mr-2 w-4 h-4" />
                            Importar JSON
                        </Button>
                        <Button
                            className="bg-emerald-600 hover:bg-emerald-700"
                            onClick={handleSaveQuiz}
                        >
                            <Save className="mr-2 w-4 h-4" />
                            Salvar Quiz
                        </Button>
                    </div>
                </div>

                {error && (
                    <Alert variant="destructive" className="mb-4">
                        <AlertDescription>{error}</AlertDescription>
                    </Alert>
                )}
                {successMessage && (
                    <Alert className="mb-4 border-emerald-200 bg-emerald-50 text-emerald-800">
                        <AlertDescription>{successMessage}</AlertDescription>
                    </Alert>
                )}

                <Card className="mb-6">
                    <CardHeader>
                        <CardTitle className="text-base">
                            Informacoes Basicas
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-1">
                            <Label htmlFor="quiz-title">Titulo do Quiz</Label>
                            <Input
                                id="quiz-title"
                                value={quizTitle}
                                onChange={(e) => setQuizTitle(e.target.value)}
                                placeholder="Ex: React Fundamentals"
                            />
                        </div>
                        <div className="space-y-1">
                            <Label htmlFor="quiz-desc">Descricao</Label>
                            <Textarea
                                id="quiz-desc"
                                rows={2}
                                value={quizDescription}
                                onChange={(e) =>
                                    setQuizDescription(e.target.value)
                                }
                                placeholder="Uma breve descricao sobre o que trata este quiz..."
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1">
                                <Label htmlFor="quiz-time">
                                    Duracao estimada
                                </Label>
                                <div className="relative">
                                    <Clock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
                                    <Input
                                        id="quiz-time"
                                        type="number"
                                        min={1}
                                        className="pl-9"
                                        value={estimatedTime}
                                        onChange={(e) =>
                                            setEstimatedTime(
                                                e.target.value === ""
                                                    ? ""
                                                    : Number(e.target.value),
                                            )
                                        }
                                        placeholder="Ex: 10"
                                    />
                                </div>
                                <p className="text-xs text-muted-foreground">
                                    minutos
                                </p>
                            </div>
                            <div className="space-y-1">
                                <Label htmlFor="quiz-feedback">
                                    Modo de feedback
                                </Label>
                                <Select
                                    value={feedbackMode}
                                    onValueChange={(v) =>
                                        setFeedbackMode(v as QuizFeedbackMode)
                                    }
                                >
                                    <SelectTrigger id="quiz-feedback">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="final">
                                            <div>
                                                <p className="font-medium">
                                                    Resumo Final
                                                </p>
                                                <p className="text-xs text-muted-foreground">
                                                    Feedback ao terminar o quiz
                                                </p>
                                            </div>
                                        </SelectItem>
                                        <SelectItem value="imediato">
                                            <div>
                                                <p className="font-medium">
                                                    Resposta Imediata
                                                </p>
                                                <p className="text-xs text-muted-foreground">
                                                    Feedback apos cada resposta
                                                </p>
                                            </div>
                                        </SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1">
                                <Label htmlFor="quiz-difficulty">
                                    Dificuldade
                                </Label>
                                <Select
                                    value={difficulty}
                                    onValueChange={(v) =>
                                        setDifficulty(v as QuizDifficulty)
                                    }
                                >
                                    <SelectTrigger id="quiz-difficulty">
                                        <SelectValue placeholder="Selecionar..." />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="facil">
                                            <span className="font-medium text-emerald-600">
                                                Facil
                                            </span>
                                        </SelectItem>
                                        <SelectItem value="medio">
                                            <span className="font-medium text-yellow-600">
                                                Medio
                                            </span>
                                        </SelectItem>
                                        <SelectItem value="dificil">
                                            <span className="font-medium text-orange-600">
                                                Dificil
                                            </span>
                                        </SelectItem>
                                        <SelectItem value="expert">
                                            <span className="font-medium text-red-600">
                                                Expert
                                            </span>
                                        </SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-1">
                                <Label>Imagem do Quiz</Label>
                                {imagePreview ? (
                                    <div className="relative rounded-lg overflow-hidden border h-[88px]">
                                        <img
                                            src={imagePreview}
                                            alt="Preview"
                                            className="w-full h-full object-cover"
                                        />
                                        <button
                                            type="button"
                                            onClick={removeImage}
                                            className="absolute top-1 right-1 bg-black/60 text-white rounded-full p-1 hover:bg-black/80"
                                        >
                                            <X className="w-3 h-3" />
                                        </button>
                                    </div>
                                ) : (
                                    <label
                                        htmlFor="quiz-image"
                                        className="flex items-center justify-center gap-2 h-[88px] border-2 border-dashed rounded-lg cursor-pointer hover:border-primary/50 hover:bg-muted/50 transition-colors"
                                    >
                                        <ImagePlus className="w-5 h-5 text-muted-foreground" />
                                        <span className="text-sm text-muted-foreground">
                                            Clique para enviar
                                        </span>
                                        <input
                                            id="quiz-image"
                                            type="file"
                                            accept="image/jpeg,image/png,image/webp"
                                            className="hidden"
                                            onChange={handleImageChange}
                                        />
                                    </label>
                                )}
                                <p className="text-xs text-muted-foreground">
                                    JPEG, PNG ou WebP (max 1 MB)
                                </p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <div className="flex items-center justify-between">
                            <CardTitle className="text-base">
                                Pergunta {activeStep + 1} de {maxSteps}
                            </CardTitle>
                            <div className="flex gap-1">
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="text-red-500 hover:text-red-600"
                                    onClick={() => removeQuestion(activeStep)}
                                    disabled={questions.length === 1}
                                    title="Remover Pergunta"
                                >
                                    <Trash2 className="w-4 h-4" />
                                </Button>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="text-blue-600"
                                    onClick={addQuestion}
                                    title="Adicionar Pergunta"
                                >
                                    <Plus className="w-4 h-4" />
                                </Button>
                            </div>
                        </div>
                    </CardHeader>

                    <Separator />

                    <CardContent className="pt-6 space-y-6">
                        <div className="space-y-1">
                            <Label htmlFor="question-text">
                                Texto da Pergunta
                            </Label>
                            <Textarea
                                id="question-text"
                                rows={2}
                                value={questions[activeStep]?.text || ""}
                                onChange={(e) =>
                                    updateQuestionText(e.target.value)
                                }
                                placeholder="Digite a pergunta aqui..."
                            />
                        </div>

                        <div>
                            <div className="flex items-center gap-2 mb-3">
                                <Label>Opcoes de Resposta</Label>
                                <HelpCircle
                                    className="w-4 h-4 text-muted-foreground"
                                    aria-label="Selecione o botao de radio na opcao correta"
                                />
                            </div>

                            <RadioGroup
                                value={questions[activeStep]?.options
                                    ?.findIndex((opt) => opt.is_correct)
                                    .toString()}
                                onValueChange={(v) =>
                                    setCorrectOption(parseInt(v))
                                }
                                className="space-y-3"
                            >
                                {questions[activeStep]?.options?.map(
                                    (option, index) => (
                                        <div
                                            key={option.id}
                                            className="flex items-center gap-3"
                                        >
                                            <RadioGroupItem
                                                value={index.toString()}
                                                id={`option-${index}`}
                                                className={
                                                    option.is_correct
                                                        ? "text-emerald-600 border-emerald-600"
                                                        : ""
                                                }
                                            />
                                            <Input
                                                className={`flex-1 ${option.is_correct ? "border-emerald-400 ring-1 ring-emerald-300" : ""}`}
                                                placeholder={`Opcao ${index + 1}`}
                                                value={option.text}
                                                onChange={(e) =>
                                                    updateOptionText(
                                                        index,
                                                        e.target.value,
                                                    )
                                                }
                                            />
                                        </div>
                                    ),
                                )}
                            </RadioGroup>
                        </div>

                        <div className="flex items-center justify-between pt-2">
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => setActiveStep((s) => s - 1)}
                                disabled={activeStep === 0}
                            >
                                <ChevronLeft className="w-4 h-4 mr-1" />
                                Anterior
                            </Button>

                            <div className="flex gap-1">
                                {questions.map((_, i) => (
                                    <button
                                        type="button"
                                        key={i}
                                        onClick={() => setActiveStep(i)}
                                        className={`w-2 h-2 rounded-full transition-colors ${
                                            i === activeStep
                                                ? "bg-primary"
                                                : "bg-muted-foreground/30"
                                        }`}
                                    />
                                ))}
                            </div>

                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => setActiveStep((s) => s + 1)}
                                disabled={activeStep === maxSteps - 1}
                            >
                                Proxima
                                <ChevronRight className="w-4 h-4 ml-1" />
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </div>

            <Dialog
                open={isImportDialogOpen}
                onOpenChange={setIsImportDialogOpen}
            >
                <DialogContent className="max-w-lg">
                    <DialogHeader>
                        <DialogTitle>Importar Perguntas via JSON</DialogTitle>
                    </DialogHeader>
                    <p className="text-sm text-muted-foreground">
                        Cole abaixo o array de perguntas no formato JSON. Cada objeto deve conter{" "}
                        <code className="text-xs bg-muted px-1 rounded">text</code> e um array de{" "}
                        <code className="text-xs bg-muted px-1 rounded">options</code> com pelo menos uma marcada{" "}
                        <code className="text-xs bg-muted px-1 rounded">is_correct: true</code>.
                    </p>
                    <Textarea
                        rows={10}
                        className={`font-mono text-xs ${jsonErrors.length > 0 ? "border-red-400 focus-visible:ring-red-400" : jsonInput.trim() ? "border-emerald-400 focus-visible:ring-emerald-400" : ""}`}
                        placeholder='[ { "text": "Pergunta?", "options": [ { "text": "Opcao 1", "is_correct": true }, ... ] } ]'
                        value={jsonInput}
                        onChange={(e) => handleJsonInputChange(e.target.value)}
                    />
                    {jsonErrors.length > 0 && (
                        <div className="max-h-32 overflow-y-auto space-y-1">
                            {jsonErrors.map((err, i) => (
                                <p key={i} className="text-xs text-red-500 flex items-start gap-1">
                                    <span className="shrink-0">•</span>
                                    <span>{err}</span>
                                </p>
                            ))}
                        </div>
                    )}
                    {jsonInput.trim() && jsonErrors.length === 0 && (
                        <p className="text-xs text-emerald-600">JSON válido e pronto para importar.</p>
                    )}
                    <DialogFooter>
                        <Button
                            variant="outline"
                            onClick={() => { setIsImportDialogOpen(false); resetJson() }}
                        >
                            Cancelar
                        </Button>
                        <Button
                            onClick={handleImportJson}
                            disabled={!jsonIsValid}
                        >
                            Importar Agora
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    )
}

export { CreateQuizPage }
