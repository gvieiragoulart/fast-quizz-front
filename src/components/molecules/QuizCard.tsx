import { Clock, BookOpen } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter } from '@/components/ui/card'
import type { Quiz } from '@/types'

interface QuizCardProps {
  quiz: Quiz
  onStartQuiz: (id: number | string) => void
  showNewBadge?: boolean
}

export default function QuizCard({ quiz, onStartQuiz, showNewBadge = false }: QuizCardProps) {
  return (
    <Card className="h-full flex flex-col relative transition-all duration-300 hover:-translate-y-2 hover:shadow-lg">
      {showNewBadge && (
        <Badge className="absolute top-3 right-3 z-10 bg-orange-500 text-white font-bold">
          NOVO
        </Badge>
      )}

      <div className="h-40 bg-gradient-to-br from-blue-500 to-purple-600 rounded-t-lg" />

      <CardContent className="flex-1 pt-4">
        <h3 className="font-bold text-lg mb-1 line-clamp-2">{quiz.title}</h3>
        <p className="text-sm text-muted-foreground mb-3 min-h-[40px] line-clamp-2">
          {quiz.description}
        </p>

        <div className="flex gap-4">
          <span className="flex items-center gap-1 text-sm text-muted-foreground">
            <Clock className="w-4 h-4" />
            {quiz.estimated_time || 'N/A'} min
          </span>
        </div>
      </CardContent>

      <CardFooter className="pt-0">
        <Button
          className="w-full bg-blue-600 hover:bg-blue-700"
          onClick={() => onStartQuiz(quiz.id)}
        >
          Iniciar Quiz
        </Button>
      </CardFooter>
    </Card>
  )
}
