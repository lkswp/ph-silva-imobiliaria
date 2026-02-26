import { put } from '@vercel/blob'
import { NextRequest } from 'next/server'

export async function saveUploadedFile(
  file: File,
  folder: string = 'imoveis'
): Promise<string> {
  // Gerar nome único para o Vercel Blob
  const timestamp = Date.now()
  const randomStr = Math.random().toString(36).substring(2, 8)
  const extension = file.name.split('.').pop()
  const filename = `${folder}/${timestamp}-${randomStr}.${extension}`

  // Envia diretamente para a nuvem da Vercel (Blob Storage)
  const blob = await put(filename, file, {
    access: 'public',
  })

  // Retorna a URL pública HTTPS pronta para ser salva no banco de dados e usada no <img>
  return blob.url
}

export async function handleFileUpload(request: NextRequest): Promise<string[]> {
  const formData = await request.formData()
  const files = formData.getAll('files') as File[]

  const urls: string[] = []

  for (const file of files) {
    if (file.size > 0) {
      const url = await saveUploadedFile(file)
      urls.push(url)
    }
  }

  return urls
}
