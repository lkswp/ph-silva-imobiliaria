# Guia de Configuração - PH SILVA Imobiliária

## Pré-requisitos

- Node.js 18+ instalado
- MySQL 8.0+ instalado e rodando
- Conta no Google Cloud para API do Google Maps (opcional)

## Passo a Passo

### 1. Instalar Dependências

```bash
npm install
```

### 2. Configurar Banco de Dados

1. Crie um banco de dados MySQL:
```sql
CREATE DATABASE ph_silva CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

2. Execute o script SQL:
```bash
mysql -u seu_usuario -p ph_silva < lib/schema.sql
```

Ou execute manualmente o conteúdo do arquivo `lib/schema.sql` no MySQL.

### 3. Configurar Variáveis de Ambiente

Copie o arquivo `.env.local.example` para `.env.local`:

```bash
cp .env.local.example .env.local
```

Edite `.env.local` com suas configurações:

```env
DATABASE_URL=mysql://usuario:senha@localhost:3306/ph_silva
NEXTAUTH_SECRET=gerar_um_secret_aleatorio_aqui
NEXTAUTH_URL=http://localhost:3000
GOOGLE_MAPS_API_KEY=sua_chave_google_maps
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=seu_email@gmail.com
SMTP_PASS=sua_senha_app
WHATSAPP_NUMBER=5511999999999
NEXT_PUBLIC_WHATSAPP_NUMBER=5511999999999
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=sua_chave_google_maps
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

**Importante:**
- `NEXTAUTH_SECRET`: Gere um secret aleatório. Você pode usar: `openssl rand -base64 32`
- `GOOGLE_MAPS_API_KEY`: Obtenha em https://console.cloud.google.com/
- `SMTP_PASS`: Use uma senha de app do Gmail (não sua senha normal)
- `WHATSAPP_NUMBER`: Formato: código do país + DDD + número (ex: 5511999999999)

### 4. Criar Usuário Admin

Por padrão, o script SQL cria um usuário admin:
- Email: `admin@phsilva.com.br`
- Senha: `admin123`

**IMPORTANTE:** Altere a senha após o primeiro login!

Para criar um novo usuário admin, você pode usar este script Node.js:

```javascript
const bcrypt = require('bcryptjs');
const hash = bcrypt.hashSync('sua_senha_aqui', 10);
console.log(hash);
```

Depois insira no banco:
```sql
INSERT INTO usuarios (email, senha_hash, nome) VALUES 
('seu_email@exemplo.com', 'hash_gerado_acima', 'Seu Nome');
```

### 5. Executar Aplicação

```bash
npm run dev
```

Acesse: http://localhost:3000

### 6. Acessar Painel Admin

Acesse: http://localhost:3000/admin/login

## Estrutura de Pastas

- `app/` - Rotas e páginas (Next.js App Router)
- `components/` - Componentes React
- `lib/` - Utilitários e configurações
- `public/` - Arquivos estáticos
- `types/` - Definições TypeScript

## Deploy na Vercel

1. Faça push do código para um repositório Git (GitHub, GitLab, etc.)
2. Conecte o repositório na Vercel
3. Configure as variáveis de ambiente na Vercel
4. Configure o banco de dados MySQL (use um serviço como PlanetScale, Railway, ou similar)
5. Faça o deploy!

## Troubleshooting

### Erro de conexão com MySQL
- Verifique se o MySQL está rodando
- Confirme as credenciais no `.env.local`
- Teste a conexão: `mysql -u usuario -p -h localhost`

### Erro ao fazer upload de imagens
- Certifique-se de que a pasta `public/uploads` existe e tem permissões de escrita
- No Windows, pode ser necessário criar a pasta manualmente

### Google Maps não aparece
- Verifique se a API Key está configurada corretamente
- Confirme que a API do Google Maps está habilitada no Google Cloud Console
- Verifique os limites de uso da API

### Emails não são enviados
- Verifique as configurações SMTP no `.env.local`
- Para Gmail, use uma senha de app (não a senha normal)
- Teste as configurações SMTP separadamente

## Suporte

Para dúvidas ou problemas, consulte a documentação do Next.js ou entre em contato com o desenvolvedor.
