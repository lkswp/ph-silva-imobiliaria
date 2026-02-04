import { getDbPool } from '@/lib/db'

async function getEstatisticas() {
  const pool = getDbPool()
  
  const [imoveisTotal] = await pool.execute('SELECT COUNT(*) as total FROM imoveis') as any[]
  const [imoveisDisponiveis] = await pool.execute("SELECT COUNT(*) as total FROM imoveis WHERE status = 'disponivel'") as any[]
  const [contatosTotal] = await pool.execute('SELECT COUNT(*) as total FROM contatos') as any[]
  const [contatosHoje] = await pool.execute('SELECT COUNT(*) as total FROM contatos WHERE DATE(created_at) = CURDATE()') as any[]

  return {
    imoveisTotal: imoveisTotal[0]?.total || 0,
    imoveisDisponiveis: imoveisDisponiveis[0]?.total || 0,
    contatosTotal: contatosTotal[0]?.total || 0,
    contatosHoje: contatosHoje[0]?.total || 0,
  }
}

export default async function DashboardPage() {
  const stats = await getEstatisticas()

  const cards = [
    {
      title: 'Total de Imóveis',
      value: stats.imoveisTotal,
      icon: '🏠',
      color: 'bg-blue-500',
    },
    {
      title: 'Imóveis Disponíveis',
      value: stats.imoveisDisponiveis,
      icon: '✅',
      color: 'bg-green-500',
    },
    {
      title: 'Total de Contatos',
      value: stats.contatosTotal,
      icon: '📧',
      color: 'bg-purple-500',
    },
    {
      title: 'Contatos Hoje',
      value: stats.contatosHoje,
      icon: '📅',
      color: 'bg-orange-500',
    },
  ]

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {cards.map((card) => (
          <div key={card.title} className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm mb-1">{card.title}</p>
                <p className="text-3xl font-bold">{card.value}</p>
              </div>
              <div className={`${card.color} p-4 rounded-full text-3xl`}>
                {card.icon}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
