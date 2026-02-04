import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { handleFileUpload } from '@/lib/upload'

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
    }

    const urls = await handleFileUpload(request)

    return NextResponse.json({ urls })
  } catch (error) {
    console.error('Erro ao fazer upload:', error)
    return NextResponse.json(
      { error: 'Erro ao fazer upload' },
      { status: 500 }
    )
  }
}
