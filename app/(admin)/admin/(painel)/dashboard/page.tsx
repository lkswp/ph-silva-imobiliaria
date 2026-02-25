import { getDbPool } from '@/lib/db'
import { Home, CheckCircle, Mail, Users, MapPin } from 'lucide-react'

async function getEstatisticas() {
  const pool = getDbPool()

  const [imoveisTotal] = await pool.execute('SELECT COUNT(*) as total FROM imoveis') as any[]
  const [imoveisDisponiveis] = await pool.execute("SELECT COUNT(*) as total FROM imoveis WHERE status = 'disponivel'") as any[]
  const [contatosTotal] = await pool.execute('SELECT COUNT(*) as total FROM contatos') as any[]
  const [usuariosTotal] = await pool.execute('SELECT COUNT(*) as total FROM usuarios') as any[]
  const [regioesTotal] = await pool.execute('SELECT COUNT(*) as total FROM regioes') as any[]

  return {
    imoveisTotal: imoveisTotal[0]?.total || 0,
    imoveisDisponiveis: imoveisDisponiveis[0]?.total || 0,
    contatosTotal: contatosTotal[0]?.total || 0,
    usuariosTotal: usuariosTotal[0]?.total || 0,
    regioesTotal: regioesTotal[0]?.total || 0,
  }
}

export default async function DashboardPage() {
  const stats = await getEstatisticas()

  const cards = [
    {
      title: 'Total de Imóveis',
      value: stats.imoveisTotal,
      icon: Home,
      color: 'text-blue-400 bg-blue-400/10 border-blue-400/20',
    },
    {
      title: 'Imóveis Disponíveis',
      value: stats.imoveisDisponiveis,
      icon: CheckCircle,
      color: 'text-green-400 bg-green-400/10 border-green-400/20',
    },
    {
      title: 'Contatos Recebidos',
      value: stats.contatosTotal,
      icon: Mail,
      color: 'text-purple-400 bg-purple-400/10 border-purple-400/20',
    },
    {
      title: 'Usuários Cadastrados',
      value: stats.usuariosTotal,
      icon: Users,
      color: 'text-orange-400 bg-orange-400/10 border-orange-400/20',
    },
    {
      title: 'Regiões Atendidas',
      value: stats.regioesTotal,
      icon: MapPin,
      color: 'text-pink-400 bg-pink-400/10 border-pink-400/20',
    },
  ]

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold mb-2 font-heading text-white">Dashboard</h1>
        <p className="text-neutral-400">Visão geral do sistema e métricas principais.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
        {cards.map((card) => {
          const Icon = card.icon
          return (
            <div key={card.title} className="bg-background-lighter p-6 rounded-2xl border border-white/5 shadow-glass flex flex-col justify-between">
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center border ${card.color} mb-6`}>
                <Icon className="w-6 h-6" />
              </div>
              <div>
                <p className="text-3xl font-bold text-white mb-1">{card.value}</p>
                <p className="text-neutral-400 text-sm font-medium">{card.title}</p>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
