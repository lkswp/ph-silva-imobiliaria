import { getDbPool } from '@/lib/db'
import { User, ShieldAlert, Mail } from 'lucide-react'

async function getUsuarios() {
    const pool = getDbPool()
    const [rows] = await pool.execute('SELECT id, nome, email, role, created_at FROM usuarios ORDER BY created_at DESC') as any[]
    return rows
}

export default async function UsuariosPage() {
    const usuarios = await getUsuarios()

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold mb-2 font-heading text-white">Usuários</h1>
                <p className="text-neutral-400">Listagem de clientes cadastrados na plataforma e administradores.</p>
            </div>

            <div className="bg-background-lighter rounded-2xl border border-white/5 shadow-glass overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-white/5 border-b border-white/5 text-neutral-400 text-sm font-medium">
                                <th className="px-6 py-4 whitespace-nowrap">ID</th>
                                <th className="px-6 py-4">Usuário</th>
                                <th className="px-6 py-4">E-mail</th>
                                <th className="px-6 py-4">Nível de Acesso</th>
                                <th className="px-6 py-4 whitespace-nowrap">Data de Cadastro</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {usuarios.map((user: any) => (
                                <tr key={user.id} className="hover:bg-white/5 transition-colors">
                                    <td className="px-6 py-4 text-neutral-500">#{user.id}</td>
                                    <td className="px-6 py-4 font-medium text-white flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center shrink-0">
                                            <User className="w-4 h-4 text-neutral-400" />
                                        </div>
                                        {user.nome}
                                    </td>
                                    <td className="px-6 py-4 text-neutral-400">
                                        <div className="flex items-center gap-2">
                                            <Mail className="w-4 h-4 text-neutral-500" />
                                            {user.email}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        {user.role === 'admin' ? (
                                            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-secondary/10 text-secondary text-xs font-semibold">
                                                <ShieldAlert className="w-3.5 h-3.5" /> Admin
                                            </span>
                                        ) : (
                                            <span className="inline-block px-3 py-1 bg-white/10 text-neutral-400 rounded-full text-xs font-semibold">
                                                User
                                            </span>
                                        )}
                                    </td>
                                    <td className="px-6 py-4 text-neutral-400 whitespace-nowrap">
                                        {new Date(user.created_at).toLocaleDateString('pt-BR')}
                                    </td>
                                </tr>
                            ))}
                            {usuarios.length === 0 && (
                                <tr>
                                    <td colSpan={5} className="px-6 py-12 text-center text-neutral-500">
                                        Nenhum usuário cadastrado.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}
