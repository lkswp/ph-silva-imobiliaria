import { writeFile, mkdir } from 'fs/promises'
import { join } from 'path'
import { NextRequest } from 'next/server'

export async function saveUploadedFile(
  file: File,
  folder: string = 'imoveis'
): Promise<string> {
  const bytes = await file.arrayBuffer()
  const buffer = Buffer.from(bytes)

  // Criar pasta se não existir
  const uploadDir = join(process.cwd(), 'public', 'uploads', folder)
  await mkdir(uploadDir, { recursive: true })

  // Gerar nome único
  const timestamp = Date.now()
  const randomStr = Math.random().toString(36).substring(2, 15)
  const extension = file.name.split('.').pop()
  const filename = `${timestamp}-${randomStr}.${extension}`

  const filepath = join(uploadDir, filename)
  await writeFile(filepath, buffer)

  return `/uploads/${folder}/${filename}`
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
