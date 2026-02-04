/**
 * Script para criar usuário admin.
 * NUNCA coloque senha no código – sempre passe pela linha de comando.
 *
 * Uso: node scripts/create-admin.js <email> <senha> [nome]
 * Exemplo: node scripts/create-admin.js admin@site.com MinHaS3nha "Meu Nome"
 */

const bcrypt = require('bcryptjs')
const mysql = require('mysql2/promise')
require('dotenv').config({ path: '.env.local' })
require('dotenv').config({ path: '.env' })

function showUsage() {
  console.error('Uso: node scripts/create-admin.js <email> <senha> [nome]')
  console.error('Exemplo: node scripts/create-admin.js admin@site.com MinHaS3nha "Administrador"')
  process.exit(1)
}

async function createAdmin() {
  const email = process.argv[2]
  const password = process.argv[3]
  const nome = process.argv[4] || 'Administrador'

  if (!email || !password) {
    console.error('Erro: email e senha são obrigatórios. Nunca coloque senha no código.')
    showUsage()
  }

  const connectionString = process.env.DATABASE_URL || process.env.MYSQL_URL || ''
  const url = new URL(connectionString)
  const database = url.pathname.slice(1).split('?')[0] // Remove query string (Railway às vezes adiciona)
  
  const isRailway = url.hostname.includes('railway')
  const ssl = isRailway ? { rejectUnauthorized: false } : undefined

  const connection = await mysql.createConnection({
    host: url.hostname,
    port: parseInt(url.port) || 3306,
    user: url.username,
    password: url.password,
    database,
    ...(ssl && { ssl }),
  })

  try {
    const senhaHash = await bcrypt.hash(password, 10)

    await connection.execute(
      'INSERT INTO usuarios (email, senha_hash, nome) VALUES (?, ?, ?) ON DUPLICATE KEY UPDATE senha_hash = ?, nome = ?',
      [email, senhaHash, nome, senhaHash, nome]
    )

    console.log('Usuário admin criado/atualizado com sucesso!')
    console.log('Email:', email)
    console.log('Use a senha que você informou no comando.')
    console.log('Recomendado: altere a senha após o primeiro login no painel.')
  } catch (error) {
    console.error('❌ Erro ao criar usuário:', error.message)
    process.exit(1)
  } finally {
    await connection.end()
  }
}

createAdmin()
