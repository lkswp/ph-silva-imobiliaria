# PH SILVA Imobiliária

Site institucional e sistema de gestão de imóveis para a imobiliária PH SILVA, especializada na região de São Paulo (Igaratá, Santa Isabel, Mogi das Cruzes e arredores).

## 🚀 Funcionalidades

- ✅ Sistema completo de CRUD de imóveis
- ✅ Busca avançada com filtros (cidade, tipo, preço, quartos, etc.)
- ✅ Galeria de fotos para cada imóvel
- ✅ Integração com Google Maps
- ✅ Botão flutuante WhatsApp
- ✅ Formulários de contato
- ✅ Painel administrativo protegido
- ✅ SEO otimizado (meta tags, structured data, sitemap)
- ✅ Design responsivo e moderno

## 🛠️ Tecnologias

- **Next.js 14** - Framework React com App Router
- **TypeScript** - Tipagem estática
- **Tailwind CSS** - Estilização
- **MySQL** - Banco de dados
- **NextAuth.js** - Autenticação
- **Google Maps API** - Localização de imóveis
- **React Hook Form** - Formulários
- **Zod** - Validação de dados

## 📦 Instalação Rápida

Para instruções detalhadas, consulte [SETUP.md](./SETUP.md)

1. **Instale as dependências:**
```bash
npm install
```

2. **Configure as variáveis de ambiente:**
```bash
cp .env.local.example .env.local
# Edite .env.local com suas credenciais
```

3. **Configure o banco de dados:**
```bash
mysql -u seu_usuario -p < lib/schema.sql
```

4. **Crie o usuário admin:**
```bash
node scripts/create-admin.js
```

5. **Execute o servidor:**
```bash
npm run dev
```

Acesse [http://localhost:3000](http://localhost:3000)

## 📁 Estrutura do Projeto

```
ph-silva-imobiliaria/
├── app/                    # Rotas e páginas (App Router)
│   ├── (public)/          # Rotas públicas
│   ├── (admin)/           # Rotas administrativas
│   └── api/               # API Routes
├── components/            # Componentes React
│   ├── ui/               # Componentes reutilizáveis
│   └── admin/            # Componentes do admin
├── lib/                   # Utilitários e configurações
├── types/                 # Definições TypeScript
├── public/                # Arquivos estáticos
└── scripts/               # Scripts auxiliares
```

## 🔐 Acesso Admin

Após criar o usuário admin, acesse:
- URL: `/admin/login`
- Use as credenciais criadas com o script `create-admin.js`

## 🌐 Deploy

O projeto está configurado para deploy na Vercel:

1. Faça push do código para um repositório Git
2. Conecte o repositório na Vercel
3. Configure as variáveis de ambiente
4. Configure o banco MySQL (use PlanetScale, Railway ou similar)
5. Deploy automático!

## 📝 Licença

Este projeto foi desenvolvido para a PH SILVA Imobiliária.
