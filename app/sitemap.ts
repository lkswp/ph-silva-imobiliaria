import { MetadataRoute } from 'next'
import { getDbPool } from '@/lib/db'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'

  const staticPages = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 1,
    },
    {
      url: `${baseUrl}/imoveis`,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 0.9,
    },
    {
      url: `${baseUrl}/sobre`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    },
    {
      url: `${baseUrl}/contato`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    },
  ]

  // Páginas de cidades
  const cidades = ['igarata', 'santa-isabel', 'mogi-das-cruzes']
  const cidadePages = cidades.map((cidade) => ({
    url: `${baseUrl}/imoveis?cidade=${cidade}`,
    lastModified: new Date(),
    changeFrequency: 'daily' as const,
    priority: 0.8,
  }))

  // Páginas de imóveis
  let imovelPages: MetadataRoute.Sitemap = []
  try {
    const pool = getDbPool()
    const [rows] = await pool.execute(
      'SELECT id, updated_at FROM imoveis WHERE status = "disponivel"'
    ) as any[]

    imovelPages = rows.map((row: any) => ({
      url: `${baseUrl}/imoveis/${row.id}`,
      lastModified: new Date(row.updated_at),
      changeFrequency: 'weekly' as const,
      priority: 0.6,
    }))
  } catch (error) {
    console.error('Erro ao gerar sitemap:', error)
  }

  return [...staticPages, ...cidadePages, ...imovelPages]
}
