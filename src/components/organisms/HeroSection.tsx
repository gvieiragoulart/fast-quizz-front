import { Rocket } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface HeroSectionProps {
  onCreateQuiz: () => void
}

const stats = [
  { value: '500+', label: 'Quizzes Criados' },
  { value: '10k+', label: 'Respostas' },
  { value: '1k+', label: 'Usuários Ativos' },
]

export default function HeroSection({ onCreateQuiz }: HeroSectionProps) {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-blue-600 to-purple-700 text-white py-20">
      {/* decorative circles */}
      <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-white/10 pointer-events-none" />
      <div className="absolute -bottom-36 -left-36 w-[500px] h-[500px] rounded-full bg-white/10 pointer-events-none" />

      <div className="container mx-auto px-4 text-center relative z-10">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">
          Crie e Compartilhe Quizzes Incríveis!
        </h1>
        <p className="text-lg md:text-xl opacity-90 mb-8 max-w-2xl mx-auto">
          Teste seus conhecimentos ou desafie seus amigos com quizzes personalizados
        </p>

        <Button
          size="lg"
          className="bg-emerald-500 hover:bg-emerald-600 text-white font-bold px-8 py-6 text-lg shadow-lg transition-transform hover:scale-105"
          onClick={onCreateQuiz}
        >
          <Rocket className="mr-2 w-5 h-5" />
          Criar Meu Quiz Agora
        </Button>

        <div className="grid grid-cols-3 gap-8 mt-16 max-w-lg mx-auto">
          {stats.map((stat) => (
            <div key={stat.label}>
              <p className="text-4xl font-bold">{stat.value}</p>
              <p className="text-sm opacity-80 mt-1">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
