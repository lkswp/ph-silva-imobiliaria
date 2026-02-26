import { config } from 'dotenv';
config({ path: '.env.local' });
import { getDbPool } from './lib/db';

async function run() {
    const pool = getDbPool();
    try {
        let query = `
      SELECT i.*, 
        (SELECT JSON_ARRAYAGG(JSON_OBJECT('id', id, 'url', url, 'ordem', ordem))
         FROM imovel_fotos WHERE imovel_id = i.id) as fotos_json
      FROM imoveis i 
      WHERE i.status = 'disponivel'
    `;
        const [rows] = await pool.execute(query) as any[];
        console.log("Returned rows length:", rows.length);
        console.dir(rows, { depth: null });

        const imoveis = rows.map((row: any) => ({
            ...row,
            fotos: row.fotos_json ? (typeof row.fotos_json === 'string' ? JSON.parse(row.fotos_json) : row.fotos_json).filter((f: any) => f && f.id).sort((a: any, b: any) => a.ordem - b.ordem) : [],
        }));

        console.log("Mapped success", imoveis.length);
    } catch (err) {
        console.error("Mapping error:", err);
    } finally {
        process.exit(0);
    }
}
run();
