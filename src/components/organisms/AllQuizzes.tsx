import { LibraryBig } from 'lucide-react'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import QuizCard from '@/components/molecules/QuizCard'
import type { Quiz } from '@/types'

interface AllQuizzesProps {
  quizzes: Quiz[] | undefined
  isLoading?: boolean
  isError?: boolean
  onStartQuiz: (id: number | string) => void
  filterCategory: string
  setFilterCategory: (category: string) => void
  filterDifficulty: string
  setFilterDifficulty: (difficulty: string) => void
}

export default function AllQuizzes({
  quizzes,
  isLoading,
  isError,
  onStartQuiz,
  filterCategory,
  setFilterCategory,
  filterDifficulty,
  setFilterDifficulty,
}: AllQuizzesProps) {
  if (isLoading) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center">
        <p className="text-muted-foreground">Carregando quizzes...</p>
      </div>
    )
  }

  if (isError) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center">
        <p className="text-destructive">Falha ao carregar quizzes. Tente novamente.</p>
      </div>
    )
  }

  if (!quizzes) return null

  return (
    <section className="py-12 bg-muted/50">
      <div className="container mx-auto px-4">
        <h2 className="flex items-center gap-2 text-2xl font-bold mb-6">
          <LibraryBig className="w-7 h-7 text-blue-600" />
          Todos os Quizzes
        </h2>

        {/* Filters */}
        <div className="bg-white rounded-lg p-4 mb-8 flex flex-wrap gap-4 items-center shadow-sm">
          <Select value={filterCategory} onValueChange={setFilterCategory}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Categoria" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas</SelectItem>
              <SelectItem value="programming">Programação</SelectItem>
              <SelectItem value="design">Design</SelectItem>
              <SelectItem value="business">Negócios</SelectItem>
            </SelectContent>
          </Select>

          <Select value={filterDifficulty} onValueChange={setFilterDifficulty}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Dificuldade" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas</SelectItem>
              <SelectItem value="easy">Fácil</SelectItem>
              <SelectItem value="medium">Médio</SelectItem>
              <SelectItem value="hard">Difícil</SelectItem>
            </SelectContent>
          </Select>

          <Select defaultValue="recent">
            <SelectTrigger className="w-44">
              <SelectValue placeholder="Ordenar por" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="recent">Mais Recentes</SelectItem>
              <SelectItem value="popular">Mais Populares</SelectItem>
              <SelectItem value="difficulty">Dificuldade</SelectItem>
            </SelectContent>
          </Select>

          <span className="text-sm text-muted-foreground ml-auto">
            {quizzes.length} quizzes encontrados
          </span>
        </div>

        {/* Grid */}
        {quizzes.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-muted-foreground text-lg">
              Nenhum quiz encontrado com os filtros selecionados
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {quizzes.map((quiz) => (
              <QuizCard key={quiz.id} quiz={quiz} onStartQuiz={onStartQuiz} />
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
