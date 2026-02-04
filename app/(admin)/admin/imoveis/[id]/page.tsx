import { notFound } from 'next/navigation'
import { getDbPool } from '@/lib/db'
import FormularioImovel from '@/components/admin/FormularioImovel'
import { Imovel } from '@/types'

async function getImovel(id: number): Promise<Imovel | null> {
  try {
    const pool = getDbPool()
    const [rows] = await pool.execute(
      `SELECT i.*, 
        (SELECT JSON_ARRAYAGG(JSON_OBJECT('id', id, 'url', url, 'ordem', ordem))
         FROM imovel_fotos WHERE imovel_id = i.id ORDER BY ordem) as fotos_json
      FROM imoveis i 
      WHERE i.id = ?`,
      [id]
    ) as any[]

    if (rows.length === 0) {
      return null
    }

    const row = rows[0]
    return {
      ...row,
      fotos: row.fotos_json ? JSON.parse(row.fotos_json) : [],
    }
  } catch (error) {
    console.error('Erro ao buscar imóvel:', error)
    return null
  }
}

interface PageProps {
  params: {
    id: string
  }
}

export default async function EditarImovelPage({ params }: PageProps) {
  const imovel = await getImovel(parseInt(params.id))

  if (!imovel) {
    notFound()
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">Editar Imóvel</h1>
      <FormularioImovel imovel={imovel} />
    </div>
  )
}
