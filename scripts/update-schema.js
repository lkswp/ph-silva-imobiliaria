const mysql = require('mysql2/promise')
require('dotenv').config({ path: '.env.local' })

async function updateSchema() {
    const connection = await mysql.createConnection({
        uri: process.env.DATABASE_URL
    })

    try {
        console.log('Running ALTER TABLE for property types ENUM...')
        await connection.execute(`
      ALTER TABLE imoveis 
      MODIFY COLUMN tipo ENUM('casa', 'apartamento', 'terreno', 'comercial', 'chacara', 'fazenda', 'sitio') NOT NULL;
    `)
        console.log('✅ ENUM types updated successfully.')

        console.log('Checking if em_condominio column exists...')
        const [columns] = await connection.execute("SHOW COLUMNS FROM imoveis LIKE 'em_condominio'")

        if (columns.length === 0) {
            console.log('Column em_condominio not found. Adding it...')
            await connection.execute(`
        ALTER TABLE imoveis 
        ADD COLUMN em_condominio BOOLEAN DEFAULT FALSE AFTER destaque;
      `)
            console.log('✅ Column em_condominio added successfully.')
        } else {
            console.log('ℹ️ Column em_condominio already exists. Skipping addition.')
        }

    } catch (error) {
        console.error('❌ Migration failed:', error)
    } finally {
        await connection.end()
    }
}

updateSchema()
