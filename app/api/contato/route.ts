import { NextRequest, NextResponse } from 'next/server'
import { getDbPool } from '@/lib/db'
import nodemailer from 'nodemailer'
import { z } from 'zod'

const contatoSchema = z.object({
  imovel_id: z.number().nullable().optional(),
  nome: z.string().min(2),
  email: z.string().email(),
  telefone: z.string().min(10),
  mensagem: z.string().min(10),
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const data = contatoSchema.parse(body)

    const pool = getDbPool()

    // Salvar no banco
    await pool.execute(
      'INSERT INTO contatos (imovel_id, nome, email, telefone, mensagem) VALUES (?, ?, ?, ?, ?)',
      [data.imovel_id || null, data.nome, data.email, data.telefone, data.mensagem]
    )

    // Enviar email
    try {
      const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: parseInt(process.env.SMTP_PORT || '587'),
        secure: false,
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS,
        },
      })

      await transporter.sendMail({
        from: process.env.SMTP_USER,
        to: process.env.SMTP_USER,
        subject: `Novo contato - ${data.imovel_id ? 'Interesse em imóvel' : 'Contato geral'}`,
        html: `
          <h2>Novo contato recebido</h2>
          <p><strong>Nome:</strong> ${data.nome}</p>
          <p><strong>Email:</strong> ${data.email}</p>
          <p><strong>Telefone:</strong> ${data.telefone}</p>
          ${data.imovel_id ? `<p><strong>Imóvel ID:</strong> ${data.imovel_id}</p>` : ''}
          <p><strong>Mensagem:</strong></p>
          <p>${data.mensagem}</p>
        `,
      })
    } catch (emailError) {
      console.error('Erro ao enviar email:', emailError)
      // Não falhar se o email não for enviado
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors }, { status: 400 })
    }
    console.error('Erro ao processar contato:', error)
    return NextResponse.json(
      { error: 'Erro ao processar contato' },
      { status: 500 }
    )
  }
}
