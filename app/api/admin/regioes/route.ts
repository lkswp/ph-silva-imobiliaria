import { NextResponse } from 'next/server'
import { getDbPool } from '@/lib/db'
import { auth, clerkClient } from '@clerk/nextjs/server'
import { z } from 'zod'

// Helper para verificar se é admin
async function isAdmin() {
    const { userId } = await auth()
    if (!userId) return false

    const client = await clerkClient()
    const user = await client.users.getUser(userId)
    return user.publicMetadata?.role === 'admin'
}

export async function POST(req: Request) {
    if (!(await isAdmin())) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    try {
        const { nome, slug, icone } = await req.json()
        const pool = getDbPool()
        const [result] = await pool.execute(
            'INSERT INTO regioes (nome, slug, icone) VALUES (?, ?, ?)',
            [nome, slug, icone || 'MapPin']
        ) as any[]

        return NextResponse.json({ id: result.insertId, nome, slug, icone, ativo: true })
    } catch (error) {
        return NextResponse.json({ error: 'Erro ao criar região' }, { status: 500 })
    }
}

export async function PUT(req: Request) {
    if (!(await isAdmin())) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    try {
        const { id, nome, slug, icone, ativo } = await req.json()
        const pool = getDbPool()
        await pool.execute(
            'UPDATE regioes SET nome = ?, slug = ?, icone = ?, ativo = ? WHERE id = ?',
            [nome, slug, icone, ativo ? 1 : 0, id]
        )
        return NextResponse.json({ success: true })
    } catch (error) {
        return NextResponse.json({ error: 'Erro ao atualizar região' }, { status: 500 })
    }
}

export async function DELETE(req: Request) {
    if (!(await isAdmin())) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    try {
        const { searchParams } = new URL(req.url)
        const id = searchParams.get('id')
        if (!id) return NextResponse.json({ error: 'Missing ID' }, { status: 400 })

        const pool = getDbPool()
        await pool.execute('DELETE FROM regioes WHERE id = ?', [id])
        return NextResponse.json({ success: true })
    } catch (error) {
        return NextResponse.json({ error: 'Erro ao deletar região' }, { status: 500 })
    }
}
