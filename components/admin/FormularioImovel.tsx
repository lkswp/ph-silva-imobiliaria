'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Imovel } from '@/types'
import Input from '@/components/ui/Input'
import Button from '@/components/ui/Button'

const imovelSchema = z.object({
  titulo: z.string().min(1, 'Título é obrigatório'),
  descricao: z.string(),
  tipo: z.enum(['casa', 'apartamento', 'terreno', 'comercial', 'chacara', 'fazenda', 'sitio']),
  operacao: z.enum(['venda', 'aluguel']),
  cidade: z.string().min(1, 'Cidade é obrigatória'),
  bairro: z.string().optional(),
  endereco: z.string().optional(),
  numero: z.string().optional(),
  cep: z.string().optional(),
  latitude: z.string().optional(),
  longitude: z.string().optional(),
  preco: z.string().min(1, 'Preço é obrigatório'),
  area_total: z.string().optional(),
  area_construida: z.string().optional(),
  quartos: z.string().optional(),
  banheiros: z.string().optional(),
  vagas: z.string().optional(),
  destaque: z.boolean().optional(),
  em_condominio: z.boolean().optional(),
  status: z.enum(['disponivel', 'reservado', 'vendido']).optional(),
})

type ImovelFormData = z.infer<typeof imovelSchema>

interface FormularioImovelProps {
  imovel?: Imovel
}

export default function FormularioImovel({ imovel }: FormularioImovelProps) {
  const router = useRouter()
  const [enviando, setEnviando] = useState(false)
  const [erro, setErro] = useState<string | null>(null)
  const [fotos, setFotos] = useState<string[]>(imovel?.fotos?.map(f => f.url) || [])

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<ImovelFormData>({
    resolver: zodResolver(imovelSchema),
    defaultValues: imovel ? {
      titulo: imovel.titulo,
      descricao: imovel.descricao,
      tipo: imovel.tipo,
      operacao: imovel.operacao,
      cidade: imovel.cidade,
      bairro: imovel.bairro || '',
      endereco: imovel.endereco || '',
      numero: imovel.numero || '',
      cep: imovel.cep || '',
      latitude: imovel.latitude?.toString() || '',
      longitude: imovel.longitude?.toString() || '',
      preco: imovel.preco.toString(),
      area_total: imovel.area_total?.toString() || '',
      area_construida: imovel.area_construida?.toString() || '',
      quartos: imovel.quartos?.toString() || '',
      banheiros: imovel.banheiros?.toString() || '',
      vagas: imovel.vagas?.toString() || '',
      destaque: imovel.destaque,
      em_condominio: imovel.em_condominio,
      status: imovel.status,
    } : {},
  })

  const handleFileUpload = async (files: FileList) => {
    try {
      const newUrls: string[] = []

      for (let i = 0; i < files.length; i++) {
        const file = files[i]
        const response = await fetch(`/api/upload?filename=${encodeURIComponent(file.name)}`, {
          method: 'POST',
          body: file,
        })

        if (!response.ok) throw new Error('Erro ao fazer upload')

        const data = await response.json()
        newUrls.push(data.url)
      }

      setFotos((prevFotos) => [...prevFotos, ...newUrls])
    } catch (error) {
      setErro('Erro ao fazer upload das imagens')
    }
  }

  const onSubmit = async (data: ImovelFormData) => {
    setEnviando(true)
    setErro(null)

    try {
      const payload = {
        ...data,
        preco: parseFloat(data.preco),
        latitude: data.latitude ? parseFloat(data.latitude) : null,
        longitude: data.longitude ? parseFloat(data.longitude) : null,
        area_total: data.area_total ? parseFloat(data.area_total) : null,
        area_construida: data.area_construida ? parseFloat(data.area_construida) : null,
        quartos: data.quartos ? parseInt(data.quartos) : null,
        banheiros: data.banheiros ? parseInt(data.banheiros) : null,
        vagas: data.vagas ? parseInt(data.vagas) : null,
        fotos,
      }

      const url = imovel ? `/api/imoveis/${imovel.id}` : '/api/imoveis'
      const method = imovel ? 'PUT' : 'POST'

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      })

      if (!response.ok) {
        throw new Error('Erro ao salvar imóvel')
      }

      router.push('/admin/imoveis')
      router.refresh()
    } catch (error) {
      setErro('Erro ao salvar imóvel. Tente novamente.')
    } finally {
      setEnviando(false)
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="bg-background-lighter p-8 rounded-3xl border border-white/5 shadow-glass space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Input
          label="Título *"
          {...register('titulo')}
          error={errors.titulo?.message}
        />
        <div>
          <label className="block text-sm font-medium text-neutral-400 mb-2">
            Tipo *
          </label>
          <select {...register('tipo')} className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-primary transition-all">
            <option value="casa" className="text-neutral-900">Casa</option>
            <option value="apartamento" className="text-neutral-900">Apartamento</option>
            <option value="terreno" className="text-neutral-900">Terreno</option>
            <option value="comercial" className="text-neutral-900">Comercial</option>
            <option value="chacara" className="text-neutral-900">Chácara</option>
            <option value="fazenda" className="text-neutral-900">Fazenda</option>
            <option value="sitio" className="text-neutral-900">Sítio</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-neutral-400 mb-2">
            Operação *
          </label>
          <select {...register('operacao')} className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-primary transition-all">
            <option value="venda" className="text-neutral-900">Venda</option>
            <option value="aluguel" className="text-neutral-900">Aluguel</option>
          </select>
        </div>
        <Input
          label="Cidade *"
          {...register('cidade')}
          error={errors.cidade?.message}
        />
        <Input
          label="Bairro"
          {...register('bairro')}
        />
        <Input
          label="Endereço"
          {...register('endereco')}
        />
        <Input
          label="Número"
          {...register('numero')}
        />
        <Input
          label="CEP"
          {...register('cep')}
        />
        <Input
          label="Preço *"
          type="number"
          step="0.01"
          {...register('preco')}
          error={errors.preco?.message}
        />
        <Input
          label="Área Total (m²)"
          type="number"
          step="0.01"
          {...register('area_total')}
        />
        <Input
          label="Área Construída (m²)"
          type="number"
          step="0.01"
          {...register('area_construida')}
        />
        <Input
          label="Quartos"
          type="number"
          {...register('quartos')}
        />
        <Input
          label="Banheiros"
          type="number"
          {...register('banheiros')}
        />
        <Input
          label="Vagas"
          type="number"
          {...register('vagas')}
        />
        <Input
          label="Latitude"
          type="number"
          step="any"
          {...register('latitude')}
        />
        <Input
          label="Longitude"
          type="number"
          step="any"
          {...register('longitude')}
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-neutral-400 mb-2">
          Descrição
        </label>
        <textarea
          {...register('descricao')}
          rows={6}
          className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-primary transition-all"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-neutral-400 mb-2">
          Fotos
        </label>
        <div className="relative">
          <input
            type="file"
            multiple
            accept="image/*"
            onChange={(e) => e.target.files && handleFileUpload(e.target.files)}
            className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-neutral-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-white hover:file:bg-primary-dark transition-all cursor-pointer"
          />
        </div>
        {fotos.length > 0 && (
          <div className="grid grid-cols-4 gap-2 mt-4">
            {fotos.map((url, index) => (
              <div key={index} className="relative">
                <img src={url} alt={`Foto ${index + 1}`} className="w-full h-24 object-cover rounded" />
                <button
                  type="button"
                  onClick={() => setFotos(fotos.filter((_, i) => i !== index))}
                  className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="flex flex-col sm:flex-row gap-6 p-6 bg-white/5 rounded-2xl border border-white/5">
        <div className="flex items-center">
          <label className="flex items-center gap-3 cursor-pointer mb-3">
            <input
              type="checkbox"
              {...register('destaque')}
              className="w-5 h-5 rounded border-white/20 bg-white/5 text-primary focus:ring-primary focus:ring-offset-0 focus:ring-2 focus:outline-none transition-all shadow-glow accent-primary"
            />
            <span className="text-white font-medium">Destacar (Banner Principal)</span>
          </label>
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              {...register('em_condominio')}
              className="w-5 h-5 rounded border-white/20 bg-white/5 text-secondary focus:ring-secondary focus:ring-offset-0 focus:ring-2 focus:outline-none transition-all shadow-glow accent-secondary"
            />
            <span className="text-white font-medium">Em Condomínio Fechado</span>
          </label>
        </div>
        <div className="flex-1 w-full max-w-xs">
          <label className="block text-sm font-medium text-neutral-400 mb-2">
            Status
          </label>
          <select {...register('status')} className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-primary transition-all">
            <option value="disponivel" className="text-neutral-900">Disponível</option>
            <option value="reservado" className="text-neutral-900">Reservado</option>
            <option value="vendido" className="text-neutral-900">Vendido</option>
          </select>
        </div>
      </div>

      {erro && (
        <div className="bg-red-50 border border-red-200 text-red-800 p-3 rounded-lg text-sm">
          {erro}
        </div>
      )}

      <div className="flex gap-4 pt-4 border-t border-white/5">
        <button type="submit" disabled={enviando} className="flex-1 sm:flex-none px-8 py-3 bg-primary hover:bg-primary-dark text-white rounded-xl font-semibold transition-colors disabled:opacity-50 tracking-wide shadow-glow">
          {enviando ? 'Salvando...' : 'Salvar Imóvel'}
        </button>
        <button
          type="button"
          onClick={() => router.push('/admin/imoveis')}
          className="flex-1 sm:flex-none px-8 py-3 bg-white/5 hover:bg-white/10 text-white rounded-xl font-semibold border border-white/10 transition-colors"
        >
          Cancelar
        </button>
      </div>
    </form>
  )
}
