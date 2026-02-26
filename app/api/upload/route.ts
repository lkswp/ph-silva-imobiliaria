import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { put } from '@vercel/blob'

// Tell Next.js not to parse the body so we can stream it securely to Vercel Blob
export const runtime = 'nodejs'

export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth()
    if (!userId) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const filename = searchParams.get('filename') || 'image.jpg'

    // Format unique name
    const timestamp = Date.now()
    const randomStr = Math.random().toString(36).substring(2, 8)
    const extension = filename.split('.').pop() || 'jpg'
    const uniqueFilename = `imoveis/${timestamp}-${randomStr}.${extension}`

    if (!request.body) {
      throw new Error('No body provided')
    }

    // Stream directly to Vercel Blob bypassing formData memory limits
    const blob = await put(uniqueFilename, request.body, {
      access: 'public',
    })

    return NextResponse.json({ url: blob.url })
  } catch (error) {
    console.error('Erro ao fazer upload:', error)
    return NextResponse.json(
      { error: 'Erro ao fazer upload' },
      { status: 500 }
    )
  }
}
