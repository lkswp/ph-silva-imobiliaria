import FormularioImovel from '@/components/admin/FormularioImovel'

export default function NovoImovelPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold mb-2 font-heading text-white">Novo Imóvel</h1>
        <p className="text-neutral-400">Preencha os dados abaixo para cadastrar uma nova propriedade.</p>
      </div>
      <FormularioImovel />
    </div>
  )
}
