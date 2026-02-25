import { NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { getDbPool } from '@/lib/db'

export async function POST(req: Request) {
    try {
        const { nome, email, password } = await req.json()

        if (!nome || !email || !password) {
            return NextResponse.json({ message: 'Todos os campos são obrigatórios' }, { status: 400 })
        }

        const pool = getDbPool()

        // Verifica se usuário já existe
        const [existing] = await pool.execute('SELECT id FROM usuarios WHERE email = ?', [email]) as any[]

        if (existing.length > 0) {
            return NextResponse.json({ message: 'Este e-mail já está em uso.' }, { status: 400 })
        }

        const salt = await bcrypt.genSalt(10)
        const hash = await bcrypt.hash(password, salt)

        await pool.execute(
            'INSERT INTO usuarios (nome, email, senha_hash, role) VALUES (?, ?, ?, ?)',
            [nome, email, hash, 'user']
        )

        return NextResponse.json({ message: 'Usuário cadastrado com sucesso.' }, { status: 201 })
    } catch (error) {
        console.error('Erro no cadastro:', error)
        return NextResponse.json({ message: 'Erro interno no servidor' }, { status: 500 })
    }
}
