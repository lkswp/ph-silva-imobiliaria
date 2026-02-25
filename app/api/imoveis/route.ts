import { NextRequest, NextResponse } from 'next/server'
import { getDbPool } from '@/lib/db'
import { auth } from '@clerk/nextjs/server'
import { z } from 'zod'

const imovelSchema = z.object({
  titulo: z.string().min(1),
  descricao: z.string(),
  tipo: z.enum(['casa', 'apartamento', 'terreno', 'comercial']),
  operacao: z.enum(['venda', 'aluguel']),
  cidade: z.string().min(1),
  bairro: z.string().optional(),
  endereco: z.string().optional(),
  numero: z.string().optional(),
  cep: z.string().optional(),
  latitude: z.number().nullable().optional(),
  longitude: z.number().nullable().optional(),
  preco: z.number().positive(),
  area_total: z.number().positive().nullable().optional(),
  area_construida: z.number().positive().nullable().optional(),
  quartos: z.number().int().positive().nullable().optional(),
  banheiros: z.number().int().positive().nullable().optional(),
  vagas: z.number().int().positive().nullable().optional(),
  destaque: z.boolean().optional(),
  status: z.enum(['disponivel', 'reservado', 'vendido']).optional(),
  fotos: z.array(z.string()).optional(),
})

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const pool = getDbPool()

    const cidade = searchParams.get('cidade')
    const tipo = searchParams.get('tipo')
    const operacao = searchParams.get('operacao')
    const preco_min = searchParams.get('preco_min')
    const preco_max = searchParams.get('preco_max')
    const quartos = searchParams.get('quartos')
    const banheiros = searchParams.get('banheiros')
    const vagas = searchParams.get('vagas')
    const busca = searchParams.get('busca')
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '12')
    const offset = (page - 1) * limit

    let query = `
      SELECT i.*, 
        (SELECT JSON_ARRAYAGG(JSON_OBJECT('id', id, 'url', url, 'ordem', ordem))
         FROM imovel_fotos WHERE imovel_id = i.id ORDER BY ordem) as fotos_json
      FROM imoveis i 
      WHERE 1=1
    `
    const params: any[] = []

    if (cidade) {
      query += ' AND LOWER(i.cidade) = LOWER(?)'
      params.push(cidade)
    }

    if (tipo) {
      query += ' AND i.tipo = ?'
      params.push(tipo)
    }

    if (operacao) {
      query += ' AND i.operacao = ?'
      params.push(operacao)
    }

    if (preco_min) {
      query += ' AND i.preco >= ?'
      params.push(parseFloat(preco_min))
    }

    if (preco_max) {
      query += ' AND i.preco <= ?'
      params.push(parseFloat(preco_max))
    }

    if (quartos) {
      query += ' AND i.quartos >= ?'
      params.push(parseInt(quartos))
    }

    if (banheiros) {
      query += ' AND i.banheiros >= ?'
      params.push(parseInt(banheiros))
    }

    if (vagas) {
      query += ' AND i.vagas >= ?'
      params.push(parseInt(vagas))
    }

    if (busca) {
      query += ' AND (MATCH(i.titulo, i.descricao) AGAINST(? IN NATURAL LANGUAGE MODE) OR i.titulo LIKE ? OR i.descricao LIKE ?)'
      const buscaTerm = `%${busca}%`
      params.push(busca, buscaTerm, buscaTerm)
    }

    // Contar total
    const countQuery = query.replace(/SELECT i\.\*,.*?FROM/, 'SELECT COUNT(*) as total FROM')
    const [countRows] = await pool.execute(countQuery, params) as any[]
    const total = countRows[0]?.total || 0

    // Buscar imóveis
    query += ' ORDER BY i.destaque DESC, i.created_at DESC LIMIT ? OFFSET ?'
    params.push(limit, offset)

    const [rows] = await pool.execute(query, params) as any[]

    const imoveis = rows.map((row: any) => ({
      ...row,
      fotos: row.fotos_json ? JSON.parse(row.fotos_json) : [],
    }))

    return NextResponse.json({
      imoveis,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    })
  } catch (error) {
    console.error('Erro ao buscar imóveis:', error)
    return NextResponse.json(
      { error: 'Erro ao buscar imóveis' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth()
    if (!userId) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
    }

    const body = await request.json()
    const data = imovelSchema.parse(body)

    const pool = getDbPool()
    const connection = await pool.getConnection()

    try {
      await connection.beginTransaction()

      const [result] = await connection.execute(
        `INSERT INTO imoveis (
          titulo, descricao, tipo, operacao, cidade, bairro, endereco, numero, cep,
          latitude, longitude, preco, area_total, area_construida,
          quartos, banheiros, vagas, destaque, status
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          data.titulo,
          data.descricao || '',
          data.tipo,
          data.operacao,
          data.cidade,
          data.bairro || null,
          data.endereco || null,
          data.numero || null,
          data.cep || null,
          data.latitude || null,
          data.longitude || null,
          data.preco,
          data.area_total || null,
          data.area_construida || null,
          data.quartos || null,
          data.banheiros || null,
          data.vagas || null,
          data.destaque || false,
          data.status || 'disponivel',
        ]
      ) as any

      const imovelId = result.insertId

      // Inserir fotos
      if (data.fotos && data.fotos.length > 0) {
        for (let i = 0; i < data.fotos.length; i++) {
          await connection.execute(
            'INSERT INTO imovel_fotos (imovel_id, url, ordem) VALUES (?, ?, ?)',
            [imovelId, data.fotos[i], i]
          )
        }
      }

      await connection.commit()

      return NextResponse.json({ id: imovelId }, { status: 201 })
    } catch (error) {
      await connection.rollback()
      throw error
    } finally {
      connection.release()
    }
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors }, { status: 400 })
    }
    console.error('Erro ao criar imóvel:', error)
    return NextResponse.json(
      { error: 'Erro ao criar imóvel' },
      { status: 500 }
    )
  }
}
