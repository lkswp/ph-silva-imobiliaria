import Link from 'next/link'
import { getDbPool } from '@/lib/db'
import { Imovel } from '@/types'
import Button from '@/components/ui/Button'

async function getImoveis(): Promise<Imovel[]> {
  const pool = getDbPool()
  const [rows] = await pool.execute(
    `SELECT i.*, 
      (SELECT JSON_ARRAYAGG(JSON_OBJECT('id', id, 'url', url, 'ordem', ordem))
       FROM imovel_fotos WHERE imovel_id = i.id ORDER BY ordem LIMIT 1) as fotos_json
    FROM imoveis i 
    ORDER BY i.created_at DESC`
  ) as any[]

  return rows.map((row: any) => ({
    ...row,
    fotos: row.fotos_json ? JSON.parse(row.fotos_json) : [],
  }))
}

export default async function AdminImoveisPage() {
  const imoveis = await getImoveis()

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Imóveis</h1>
        <Link href="/admin/imoveis/novo">
          <Button>Novo Imóvel</Button>
        </Link>
      </div>

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">ID</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Título</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Cidade</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tipo</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Preço</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {imoveis.map((imovel) => (
              <tr key={imovel.id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{imovel.id}</td>
                <td className="px-6 py-4 text-sm text-gray-900">{imovel.titulo}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{imovel.cidade}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{imovel.tipo}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  R$ {imovel.preco.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    imovel.status === 'disponivel' ? 'bg-green-100 text-green-800' :
                    imovel.status === 'reservado' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {imovel.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  <Link href={`/admin/imoveis/${imovel.id}`} className="text-primary hover:underline mr-4">
                    Editar
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
