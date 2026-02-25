import { getDbPool } from '@/lib/db'
import { Plus, Trash2, Edit } from 'lucide-react'
import RegionManagerClient from './RegionManagerClient'

async function getRegioes() {
    const pool = getDbPool()
    const [rows] = await pool.execute('SELECT * FROM regioes ORDER BY nome ASC') as any[]
    return rows
}

export default async function RegioesPage() {
    const regioes = await getRegioes()

    return (
        <div className="space-y-8">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold mb-2 font-heading text-white">Regiões</h1>
                    <p className="text-neutral-400">Gerencie as cidades e regiões publicadas na busca de imóveis.</p>
                </div>
            </div>

            <RegionManagerClient initialRegions={regioes} />
        </div>
    )
}
