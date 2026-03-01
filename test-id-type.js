import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

async function main() {
    const pool = mysql.createPool(process.env.DATABASE_URL);
    const [rows] = await pool.query('SELECT * from imoveis');
    rows.forEach(row => {
        console.log(`Type of ID for id ${row.id}:`, typeof row.id, row.id);
    });
    process.exit(0);
}
main();
