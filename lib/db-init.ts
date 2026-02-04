import { initDatabase } from './db'

// Script para inicializar o banco de dados
// Execute: npx tsx lib/db-init.ts

initDatabase()
  .then(() => {
    console.log('Banco de dados inicializado com sucesso!')
    process.exit(0)
  })
  .catch((error) => {
    console.error('Erro ao inicializar banco de dados:', error)
    process.exit(1)
  })
