'use client'

import { useState } from 'react'
import { Plus, Trash2, Edit, Save, X, Loader2, KeySquare } from 'lucide-react'
import { useRouter } from 'next/navigation'

export default function RegionManagerClient({ initialRegions }: { initialRegions: any[] }) {
    const router = useRouter()
    const [regions, setRegions] = useState(initialRegions)
    const [loading, setLoading] = useState(false)
    const [editingId, setEditingId] = useState<number | null>(null)
    const [editForm, setEditForm] = useState({ nome: '', slug: '', icone: '', ativo: true })

    const [isAdding, setIsAdding] = useState(false)
    const [addForm, setAddForm] = useState({ nome: '', slug: '', icone: 'MapPin', ativo: true })

    const handleSaveAdd = async () => {
        setLoading(true)
        try {
            const res = await fetch('/api/admin/regioes', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(addForm),
            })
            if (!res.ok) throw new Error('Erro ao adicionar')
            const newRegion = await res.json()
            setRegions([...regions, newRegion])
            setIsAdding(false)
            setAddForm({ nome: '', slug: '', icone: 'MapPin', ativo: true })
            router.refresh()
        } catch (e) {
            alert('Erro ao salvar região.')
        } finally {
            setLoading(false)
        }
    }

    const handleSaveEdit = async (id: number) => {
        setLoading(true)
        try {
            const res = await fetch(`/api/admin/regioes`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id, ...editForm }),
            })
            if (!res.ok) throw new Error('Erro ao atualizar')

            const updatedRegions = regions.map(r => r.id === id ? { ...r, ...editForm } : r)
            setRegions(updatedRegions)
            setEditingId(null)
            router.refresh()
        } catch (e) {
            alert('Erro ao atualizar região.')
        } finally {
            setLoading(false)
        }
    }

    const handleDelete = async (id: number) => {
        if (!confirm('Excluir esta região? Se houver imóveis nela, os filtros podem quebrar.')) return
        setLoading(true)
        try {
            const res = await fetch(`/api/admin/regioes?id=${id}`, { method: 'DELETE' })
            if (!res.ok) throw new Error('Erro ao deletar')
            setRegions(regions.filter(r => r.id !== id))
            router.refresh()
        } catch (e) {
            alert('Erro ao excluir região.')
        } finally {
            setLoading(false)
        }
    }

    const inputClass = "w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-primary text-sm"

    return (
        <div className="bg-background-lighter rounded-2xl border border-white/5 shadow-glass p-6">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-white">Regiões Cadastradas</h2>
                {!isAdding && (
                    <button
                        onClick={() => setIsAdding(true)}
                        className="flex items-center gap-2 px-4 py-2 bg-primary hover:bg-primary-dark text-white rounded-xl transition-colors font-medium text-sm"
                    >
                        <Plus className="w-4 h-4" /> Nova Região
                    </button>
                )}
            </div>

            <div className="space-y-4">
                {/* ADD FORM */}
                {isAdding && (
                    <div className="p-4 bg-white/5 border border-white/10 rounded-xl flex flex-col md:flex-row gap-4 items-start md:items-end animate-in fade-in slide-in-from-top-4">
                        <div className="flex-1 w-full space-y-1">
                            <label className="text-xs text-neutral-400">Nome (Ex: Igaratá)</label>
                            <input
                                className={inputClass}
                                value={addForm.nome}
                                onChange={e => setAddForm({ ...addForm, nome: e.target.value, slug: e.target.value.toLowerCase().replace(/\s+/g, '-') })}
                                placeholder="Nome da região"
                            />
                        </div>
                        <div className="flex-1 w-full space-y-1">
                            <label className="text-xs text-neutral-400">Slug (URL amigável)</label>
                            <input className={inputClass} value={addForm.slug} onChange={e => setAddForm({ ...addForm, slug: e.target.value })} placeholder="nome-da-regiao" />
                        </div>
                        <div className="flex-1 w-full space-y-1">
                            <label className="text-xs text-neutral-400">Ícone (lucide-react)</label>
                            <input className={inputClass} value={addForm.icone} onChange={e => setAddForm({ ...addForm, icone: e.target.value })} placeholder="MapPin, Mountain..." />
                        </div>
                        <div className="flex gap-2 w-full md:w-auto">
                            <button disabled={loading} onClick={handleSaveAdd} className="flex-1 md:flex-none px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg flex justify-center items-center">
                                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                            </button>
                            <button disabled={loading} onClick={() => setIsAdding(false)} className="flex-1 md:flex-none px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg flex justify-center items-center">
                                <X className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                )}

                {/* LIST */}
                <div className="grid gap-3">
                    {regions.map((regiao) => (
                        <div key={regiao.id} className="p-4 bg-white/5 border border-white/5 rounded-xl flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-white/10 transition-colors">

                            {editingId === regiao.id ? (
                                <div className="flex flex-col md:flex-row gap-4 flex-1 items-start md:items-center w-full">
                                    <input className={inputClass} value={editForm.nome} onChange={e => setEditForm({ ...editForm, nome: e.target.value })} />
                                    <input className={inputClass} value={editForm.slug} onChange={e => setEditForm({ ...editForm, slug: e.target.value })} />
                                    <input className={inputClass} value={editForm.icone} onChange={e => setEditForm({ ...editForm, icone: e.target.value })} />
                                </div>
                            ) : (
                                <div className="flex items-center gap-4 flex-1">
                                    <div className="w-10 h-10 rounded-lg bg-primary/20 text-primary-light flex items-center justify-center border border-primary/20 shrink-0">
                                        {/* Placeholder icone preview */}
                                        <KeySquare className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <h3 className="text-white font-bold">{regiao.nome}</h3>
                                        <div className="text-xs text-neutral-400 flex items-center gap-3 mt-1">
                                            <span>Slug: <strong className="text-neutral-300">{regiao.slug}</strong></span>
                                            <span>Ícone: <strong className="text-neutral-300">{regiao.icone}</strong></span>
                                        </div>
                                    </div>
                                </div>
                            )}

                            <div className="flex items-center gap-2 shrink-0">
                                {editingId === regiao.id ? (
                                    <>
                                        <button disabled={loading} onClick={() => handleSaveEdit(regiao.id)} className="p-2 bg-green-500 hover:bg-green-600 text-white rounded-lg">
                                            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                                        </button>
                                        <button disabled={loading} onClick={() => setEditingId(null)} className="p-2 bg-white/10 hover:bg-white/20 text-white rounded-lg">
                                            <X className="w-4 h-4" />
                                        </button>
                                    </>
                                ) : (
                                    <>
                                        <button
                                            onClick={() => {
                                                setEditForm({ nome: regiao.nome, slug: regiao.slug, icone: regiao.icone, ativo: regiao.ativo })
                                                setEditingId(regiao.id)
                                            }}
                                            className="p-2 bg-white/5 hover:bg-white/10 text-neutral-300 rounded-lg transition-colors"
                                        >
                                            <Edit className="w-4 h-4" />
                                        </button>
                                        <button
                                            onClick={() => handleDelete(regiao.id)}
                                            className="p-2 bg-red-500/10 hover:bg-red-500/20 text-red-500 rounded-lg transition-colors border border-red-500/20"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </>
                                )}
                            </div>
                        </div>
                    ))}

                    {regions.length === 0 && !isAdding && (
                        <div className="text-center py-10 text-neutral-500">
                            Nenhuma região cadastrada.
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
