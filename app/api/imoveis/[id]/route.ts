import { NextRequest, NextResponse } from 'next/server'
import { getDbPool } from '@/lib/db'
import { auth } from '@clerk/nextjs/server'
import { z } from 'zod'

const imovelUpdateSchema = z.object({
  titulo: z.string().min(1).optional(),
  descricao: z.string().optional(),
  tipo: z.enum(['casa', 'apartamento', 'terreno', 'comercial', 'chacara', 'fazenda', 'sitio']).optional(),
  operacao: z.enum(['venda', 'aluguel']).optional(),
  cidade: z.string().min(1).optional(),
  bairro: z.string().optional(),
  endereco: z.string().optional(),
  numero: z.string().optional(),
  cep: z.string().optional(),
  latitude: z.number().nullable().optional(),
  longitude: z.number().nullable().optional(),
  preco: z.number().positive().optional(),
  area_total: z.number().positive().nullable().optional(),
  area_construida: z.number().positive().nullable().optional(),
  quartos: z.number().int().positive().nullable().optional(),
  banheiros: z.number().int().positive().nullable().optional(),
  vagas: z.number().int().positive().nullable().optional(),
  destaque: z.boolean().optional(),
  em_condominio: z.boolean().optional(),
  status: z.enum(['disponivel', 'reservado', 'vendido']).optional(),
})

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const pool = getDbPool()
    const [rows] = await pool.execute(
      `SELECT i.*, 
        (SELECT JSON_ARRAYAGG(JSON_OBJECT('id', id, 'url', url, 'ordem', ordem))
         FROM imovel_fotos WHERE imovel_id = i.id ORDER BY ordem) as fotos_json
      FROM imoveis i 
      WHERE i.id = ?`,
      [params.id]
    ) as any[]

    if (rows.length === 0) {
      return NextResponse.json(
        { error: 'Imóvel não encontrado' },
        { status: 404 }
      )
    }

    const row = rows[0]
    const imovel = {
      ...row,
      fotos: row.fotos_json ? JSON.parse(row.fotos_json) : [],
    }

    return NextResponse.json(imovel)
  } catch (error) {
    console.error('Erro ao buscar imóvel:', error)
    return NextResponse.json(
      { error: 'Erro ao buscar imóvel' },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { userId } = await auth()
    if (!userId) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
    }

    const body = await request.json()
    const data = imovelUpdateSchema.parse(body)

    const pool = getDbPool()
    const fields: string[] = []
    const values: any[] = []

    Object.entries(data).forEach(([key, value]) => {
      if (value !== undefined) {
        fields.push(`${key} = ?`)
        values.push(value)
      }
    })

    if (fields.length === 0) {
      return NextResponse.json({ error: 'Nenhum campo para atualizar' }, { status: 400 })
    }

    values.push(params.id)

    await pool.execute(
      `UPDATE imoveis SET ${fields.join(', ')} WHERE id = ?`,
      values
    )

    return NextResponse.json({ success: true })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors }, { status: 400 })
    }
    console.error('Erro ao atualizar imóvel:', error)
    return NextResponse.json(
      { error: 'Erro ao atualizar imóvel' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { userId } = await auth()
    if (!userId) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
    }

    const pool = getDbPool()
    await pool.execute('DELETE FROM imoveis WHERE id = ?', [params.id])

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Erro ao excluir imóvel:', error)
    return NextResponse.json(
      { error: 'Erro ao excluir imóvel' },
      { status: 500 }
    )
  }
}
