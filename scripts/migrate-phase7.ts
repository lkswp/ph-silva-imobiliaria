import { config } from 'dotenv'
import { resolve } from 'path'

config({ path: resolve(process.cwd(), '.env.local') })
config({ path: resolve(process.cwd(), '.env') })
import { getDbPool } from '../lib/db'

async function migrate() {
    const pool = getDbPool()
    const connection = await pool.getConnection()

    try {
        console.log('🔄 Iniciando migração do Phase 7...')

        // Create regioes table
        await connection.query(`
      CREATE TABLE IF NOT EXISTS regioes (
        id INT AUTO_INCREMENT PRIMARY KEY,
        nome VARCHAR(100) NOT NULL,
        slug VARCHAR(100) UNIQUE NOT NULL,
        icone VARCHAR(50) DEFAULT 'MapPin',
        ativo BOOLEAN DEFAULT TRUE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `)
        console.log('✅ Tabela regioes verificada/criada.')

        // Seed regioes
        const seedRegioes = [
            { nome: 'Igaratá', slug: 'igarata', icone: 'Mountain' },
            { nome: 'Santa Isabel', slug: 'santa-isabel', icone: 'TreePine' },
            { nome: 'Mogi das Cruzes', slug: 'mogi-das-cruzes', icone: 'MapPin' },
        ]

        for (const regiao of seedRegioes) {
            await connection.query(
                'INSERT IGNORE INTO regioes (nome, slug, icone) VALUES (?, ?, ?)',
                [regiao.nome, regiao.slug, regiao.icone]
            )
        }
        console.log('✅ Regiões iniciais inseridas (IGNORE).')

        // Add role to usuarios
        try {
            await connection.query(`
        ALTER TABLE usuarios 
        ADD COLUMN role ENUM('admin', 'user') DEFAULT 'user' AFTER nome;
      `)
            console.log('✅ Coluna role adicionada em usuarios.')

            // Update existing admin to have admin role
            await connection.query(`
        UPDATE usuarios SET role = 'admin' WHERE email LIKE '%admin%';
      `)
            console.log('✅ Usuários admin atualizados.')
        } catch (e: any) {
            if (e.code === 'ER_DUP_FIELDNAME') {
                console.log('⚠️ Coluna role já existe em usuarios. Ignorando.')
            } else {
                throw e
            }
        }

        console.log('🎉 Migração concluída com sucesso!')
        process.exit(0)
    } catch (error) {
        console.error('❌ Erro na migração:', error)
        process.exit(1)
    } finally {
        connection.release()
    }
}

migrate()
