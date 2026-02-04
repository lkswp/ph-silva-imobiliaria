/**
 * Script para criar as tabelas no MySQL do Railway (ou qualquer MySQL remoto).
 * Execute após configurar DATABASE_URL no .env.local com a URL do Railway.
 *
 * Uso: npm run db:init
 * ou: npx tsx scripts/init-db-railway.ts
 */

import { config } from 'dotenv'
import { resolve } from 'path'

// Carregar .env.local (Next.js) ou .env
config({ path: resolve(process.cwd(), '.env.local') })
config({ path: resolve(process.cwd(), '.env') })
import { initDatabase } from '../lib/db'

async function main() {
  const connectionString = process.env.DATABASE_URL || process.env.MYSQL_URL
  if (!connectionString) {
    console.error('❌ DATABASE_URL ou MYSQL_URL não está definida no .env.local')
    process.exit(1)
  }

  try {
    await initDatabase()
    console.log('✅ Tabelas criadas com sucesso no Railway!')
    process.exit(0)
  } catch (error) {
    console.error('❌ Erro ao criar tabelas:', error)
    process.exit(1)
  }
}

main()
