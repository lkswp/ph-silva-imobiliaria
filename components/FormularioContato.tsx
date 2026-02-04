'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import Input from './ui/Input'
import Button from './ui/Button'

const contatoSchema = z.object({
  nome: z.string().min(2, 'Nome deve ter pelo menos 2 caracteres'),
  email: z.string().email('Email inválido'),
  telefone: z.string().min(10, 'Telefone inválido'),
  mensagem: z.string().min(10, 'Mensagem deve ter pelo menos 10 caracteres'),
})

type ContatoFormData = z.infer<typeof contatoSchema>

interface FormularioContatoProps {
  imovelId?: number
}

export default function FormularioContato({ imovelId }: FormularioContatoProps) {
  const [enviando, setEnviando] = useState(false)
  const [enviado, setEnviado] = useState(false)
  const [erro, setErro] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ContatoFormData>({
    resolver: zodResolver(contatoSchema),
  })

  const onSubmit = async (data: ContatoFormData) => {
    setEnviando(true)
    setErro(null)

    try {
      const response = await fetch('/api/contato', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...data,
          imovel_id: imovelId,
        }),
      })

      if (!response.ok) {
        throw new Error('Erro ao enviar mensagem')
      }

      setEnviado(true)
      reset()
      setTimeout(() => setEnviado(false), 5000)
    } catch (error) {
      setErro('Erro ao enviar mensagem. Tente novamente.')
    } finally {
      setEnviando(false)
    }
  }

  if (enviado) {
    return (
      <div className="bg-green-50 border border-green-200 text-green-800 p-4 rounded-input text-sm">
        Mensagem enviada com sucesso! Entraremos em contato em breve.
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <Input
        label="Nome"
        {...register('nome')}
        error={errors.nome?.message}
      />
      <Input
        label="Email"
        type="email"
        {...register('email')}
        error={errors.email?.message}
      />
      <Input
        label="Telefone"
        type="tel"
        {...register('telefone')}
        error={errors.telefone?.message}
      />
      <div>
        <label className="block text-sm font-medium text-neutral-700 mb-1.5">
          Mensagem
        </label>
        <textarea
          {...register('mensagem')}
          rows={4}
          className="w-full px-4 py-2.5 border border-neutral-300 rounded-input text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:border-transparent"
        />
        {errors.mensagem && (
          <p className="mt-1.5 text-sm text-red-600">{errors.mensagem.message}</p>
        )}
      </div>

      {erro && (
        <div className="bg-red-50 border border-red-200 text-red-800 p-3 rounded-input text-sm">
          {erro}
        </div>
      )}

      <Button type="submit" disabled={enviando} className="w-full">
        {enviando ? 'Enviando...' : 'Enviar Mensagem'}
      </Button>
    </form>
  )
}
