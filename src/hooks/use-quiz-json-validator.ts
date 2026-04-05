import { useState, useCallback } from "react"

function validateQuizJson(input: string): string[] {
    if (!input.trim()) return []

    const errors: string[] = []

    let parsed: unknown
    try {
        parsed = JSON.parse(input)
    } catch {
        return [
            "JSON inválido. Verifique a sintaxe (chaves, vírgulas, aspas).",
        ]
    }

    if (!Array.isArray(parsed)) {
        return [
            "O JSON deve ser um array de perguntas. Ex: [ { ... }, { ... } ]",
        ]
    }

    if (parsed.length === 0) {
        return ["O array está vazio. Adicione pelo menos uma pergunta."]
    }

    ;(parsed as Record<string, unknown>[]).forEach((q, i) => {
        const num = i + 1

        if (!q || typeof q !== "object") {
            errors.push(`Pergunta ${num}: deve ser um objeto.`)
            return
        }

        if (!q.text || typeof q.text !== "string" || !q.text.trim()) {
            errors.push(`Pergunta ${num}: campo "text" é obrigatório.`)
        }

        if (!Array.isArray(q.options)) {
            errors.push(
                `Pergunta ${num}: campo "options" deve ser um array.`,
            )
            return
        }

        if (q.options.length < 2) {
            errors.push(`Pergunta ${num}: deve ter pelo menos 2 opções.`)
        }

        if (q.options.length > 6) {
            errors.push(`Pergunta ${num}: máximo de 6 opções permitidas.`)
        }

        const opts = q.options as Record<string, unknown>[]
        opts.forEach((opt, j) => {
            if (!opt || typeof opt !== "object") {
                errors.push(
                    `Pergunta ${num}, opção ${j + 1}: deve ser um objeto.`,
                )
                return
            }
            if (
                !opt.text ||
                typeof opt.text !== "string" ||
                !(opt.text as string).trim()
            ) {
                errors.push(
                    `Pergunta ${num}, opção ${j + 1}: campo "text" é obrigatório.`,
                )
            }
        })

        const hasCorrect = opts.some((opt) => opt.is_correct === true)
        const hasCorrectAnswer = typeof q.correct_answer === "number"
        if (!hasCorrect && !hasCorrectAnswer) {
            errors.push(
                `Pergunta ${num}: nenhuma opção marcada como correta. Use "is_correct": true em uma opção ou defina "correct_answer".`,
            )
        }
    })

    return errors
}

export function useQuizJsonValidator() {
    const [jsonInput, setJsonInput] = useState("")
    const [errors, setErrors] = useState<string[]>([])

    const handleChange = useCallback((value: string) => {
        setJsonInput(value)
        setErrors(validateQuizJson(value))
    }, [])

    const validate = useCallback(() => {
        const result = validateQuizJson(jsonInput)
        setErrors(result)
        return result
    }, [jsonInput])

    const reset = useCallback(() => {
        setJsonInput("")
        setErrors([])
    }, [])

    const isValid = jsonInput.trim().length > 0 && errors.length === 0

    return { jsonInput, errors, isValid, handleChange, validate, reset }
}
