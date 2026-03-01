import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

async function main() {
    const pool = mysql.createPool(process.env.DATABASE_URL);
    const [rows] = await pool.query('SELECT id, titulo, cidade, bairro, preco from imoveis');
    console.log(JSON.stringify(rows, null, 2));
    process.exit(0);
}
main();
