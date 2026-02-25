'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import Button from './ui/Button'
import { Send, Loader2 } from 'lucide-react'

const contatoSchema = z.object({
  nome: z.string().min(3, 'Nome deve ter no mínimo 3 caracteres'),
  email: z.string().email('E-mail inválido'),
  telefone: z.string().min(10, 'Telefone inválido').optional().or(z.literal('')),
  mensagem: z.string().min(10, 'Mensagem deve ter no mínimo 10 caracteres'),
})

type ContatoFormData = z.infer<typeof contatoSchema>

export default function FormularioContato() {
  const [enviando, setEnviando] = useState(false)
  const [sucesso, setSucesso] = useState(false)
  const [erro, setErro] = useState('')

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ContatoFormData>({
    resolver: zodResolver(contatoSchema),
  })

  const onSubmit = async (data: ContatoFormData) => {
    setEnviando(true)
    setErro('')

    try {
      const response = await fetch('/api/contato', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        throw new Error('Falha ao enviar mensagem')
      }

      setSucesso(true)
      reset()

      setTimeout(() => {
        setSucesso(false)
      }, 5000)
    } catch (err) {
      setErro('Ocorreu um erro ao enviar sua mensagem. Tente novamente ou use o WhatsApp.')
    } finally {
      setEnviando(false)
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {sucesso && (
        <div className="p-4 bg-green-500/10 border border-green-500/20 text-green-400 rounded-xl text-sm font-medium">
          Mensagem enviada com sucesso! Entraremos em contato em breve.
        </div>
      )}

      {erro && (
        <div className="p-4 bg-red-500/10 border border-red-500/20 text-red-400 rounded-xl text-sm font-medium">
          {erro}
        </div>
      )}

      <div className="space-y-4">
        <div>
          <label htmlFor="nome" className="block text-sm font-medium text-neutral-300 mb-1.5">
            Nome Completo
          </label>
          <input
            {...register('nome')}
            id="nome"
            className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
            placeholder="Seu nome"
          />
          {errors.nome && (
            <span className="text-red-400 text-xs mt-1 block px-1">{errors.nome.message}</span>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-neutral-300 mb-1.5">
              E-mail
            </label>
            <input
              {...register('email')}
              id="email"
              type="email"
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
              placeholder="seu@email.com"
            />
            {errors.email && (
              <span className="text-red-400 text-xs mt-1 block px-1">{errors.email.message}</span>
            )}
          </div>

          <div>
            <label htmlFor="telefone" className="block text-sm font-medium text-neutral-300 mb-1.5">
              Telefone / WhatsApp
            </label>
            <input
              {...register('telefone')}
              id="telefone"
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
              placeholder="(11) 99999-9999"
            />
            {errors.telefone && (
              <span className="text-red-400 text-xs mt-1 block px-1">{errors.telefone.message}</span>
            )}
          </div>
        </div>

        <div>
          <label htmlFor="mensagem" className="block text-sm font-medium text-neutral-300 mb-1.5">
            O que você procura?
          </label>
          <textarea
            {...register('mensagem')}
            id="mensagem"
            rows={5}
            className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all resize-none"
            placeholder="Ex: Procuro uma casa em Igaratá com vista para a represa..."
          />
          {errors.mensagem && (
            <span className="text-red-400 text-xs mt-1 block px-1">{errors.mensagem.message}</span>
          )}
        </div>
      </div>

      <button
        type="submit"
        disabled={enviando}
        className="w-full h-12 rounded-xl bg-primary text-white font-semibold hover:bg-primary-dark hover:shadow-glow transition-all active:scale-[0.98] disabled:opacity-70 disabled:pointer-events-none flex items-center justify-center gap-2"
      >
        {enviando ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin" />
            Enviando...
          </>
        ) : (
          <>
            <Send className="w-5 h-5" />
            Enviar Mensagem
          </>
        )}
      </button>
    </form>
  )
}
