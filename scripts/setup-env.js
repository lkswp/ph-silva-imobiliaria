/**
 * Cria ou atualiza o .env.local com NEXTAUTH_SECRET gerado.
 * Execute: node scripts/setup-env.js
 * Depois edite .env.local e cole a DATABASE_URL do Railway.
 */

const fs = require('fs')
const path = require('path')
const crypto = require('crypto')

const envPath = path.join(__dirname, '..', '.env.local')
const examplePath = path.join(__dirname, '..', '.env.local.example')

const secret = crypto.randomBytes(32).toString('base64')

let content
if (fs.existsSync(envPath)) {
  content = fs.readFileSync(envPath, 'utf8')
  if (content.includes('NEXTAUTH_SECRET=')) {
    content = content.replace(/NEXTAUTH_SECRET=.*/m, `NEXTAUTH_SECRET=${secret}`)
  } else {
    content = `NEXTAUTH_SECRET=${secret}\n` + content
  }
} else if (fs.existsSync(examplePath)) {
  content = fs.readFileSync(examplePath, 'utf8')
  content = content.replace(/NEXTAUTH_SECRET=.*/m, `NEXTAUTH_SECRET=${secret}`)
  content = content.replace(/DATABASE_URL=.*/m, 'DATABASE_URL=COLE_A_URL_DO_RAILWAY_AQUI')
} else {
  content = `# Cole a URL do Railway (MySQL)
DATABASE_URL=COLE_A_URL_DO_RAILWAY_AQUI

NEXTAUTH_SECRET=${secret}
NEXTAUTH_URL=http://localhost:3000
NEXT_PUBLIC_SITE_URL=http://localhost:3000
`
}

fs.writeFileSync(envPath, content, 'utf8')
console.log('✅ .env.local criado/atualizado em:', envPath)
console.log('   NEXTAUTH_SECRET foi gerado automaticamente.')
console.log('')
console.log('📌 Próximo passo: abra .env.local e substitua')
console.log('   DATABASE_URL=COLE_A_URL_DO_RAILWAY_AQUI')
console.log('   pela URL do MySQL que você copiou do Railway.')
console.log('')
console.log('   Depois rode: npm run db:init')
console.log('')
