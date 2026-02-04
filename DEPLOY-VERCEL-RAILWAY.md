# Deploy na Vercel + MySQL no Railway

Guia passo a passo para publicar o site PH SILVA na Vercel e usar o MySQL hospedado no Railway.

---

## Parte 1: MySQL no Railway

### 1.1 Criar conta e projeto

1. Acesse **[railway.app](https://railway.app)** e faça login (GitHub ou email).
2. Clique em **"New Project"**.
3. Escolha **"Deploy from GitHub repo"** (só para criar o projeto) ou **"Empty Project"**.
4. Se escolheu Empty Project, você verá o dashboard do projeto vazio.

### 1.2 Adicionar o MySQL

1. No projeto, clique em **"+ New"** ou **"Add Service"**.
2. Selecione **"Database"**.
3. Escolha **"MySQL"**.
4. Aguarde o deploy (alguns segundos). O Railway vai criar uma instância MySQL.

### 1.3 Copiar a URL de conexão

1. Clique no serviço **MySQL** que apareceu.
2. Vá na aba **"Variables"** ou **"Connect"**.
3. Procure a variável **`MYSQL_URL`** ou **`DATABASE_URL`** (Railway pode mostrar as duas).
4. Clique em **"Copy"** para copiar a URL. Ela será algo como:
   ```
   mysql://root:senha@containers-us-west-xxx.railway.app:6543/railway
   ```

**Importante:** Anote essa URL; você vai colar na Vercel.

### 1.4 Criar as tabelas no MySQL (Railway)

O Railway não executa arquivos SQL automaticamente. Você tem duas opções:

**Opção A – Pelo terminal (recomendado)**

1. No serviço MySQL no Railway, na aba **"Connect"**, use os dados para conectar:
   - **Host:** algo como `containers-us-west-xxx.railway.app`
   - **Port:** número da porta
   - **User:** geralmente `root`
   - **Password:** a senha que aparece nas variáveis
   - **Database:** geralmente `railway`

2. No seu PC, com MySQL client instalado:
   ```bash
   mysql -h containers-us-west-xxx.railway.app -P 6543 -u root -p railway < lib/schema.sql
   ```
   (Troque host, porta, usuário e senha pelos que o Railway mostrou.)

**Opção B – Pelo script Node (após configurar DATABASE_URL)**

1. No seu projeto, crie/use um script que chame `initDatabase()` do `lib/db.ts`.
2. Configure no `.env.local` a mesma `DATABASE_URL` que você vai usar na Vercel (a URL do Railway).
3. Rode o script uma vez localmente para criar as tabelas:
   ```bash
   npx tsx scripts/init-db-railway.ts
   ```
   (Esse script será criado abaixo.)

Depois de rodar o schema ou o script, as tabelas `usuarios`, `imoveis`, `imovel_fotos` e `contatos` estarão criadas no MySQL do Railway.

---

## Parte 2: Deploy na Vercel

### 2.1 Subir o código no GitHub

1. Crie um repositório no **GitHub** (ex: `ph-silva-imobiliaria`).
2. No terminal, na pasta do projeto:
   ```bash
   cd C:\Users\lucas\ph-silva-imobiliaria
   git init
   git add .
   git commit -m "Initial commit - PH SILVA Imobiliária"
   git branch -M main
   git remote add origin https://github.com/SEU_USUARIO/ph-silva-imobiliaria.git
   git push -u origin main
   ```
   Troque `SEU_USUARIO` pelo seu usuário do GitHub.

### 2.2 Conectar o repositório na Vercel

1. Acesse **[vercel.com](https://vercel.com)** e faça login (recomendado: com GitHub).
2. Clique em **"Add New..."** → **"Project"**.
3. Importe o repositório **ph-silva-imobiliaria** (ou o nome que você deu).
4. Em **"Configure Project"**:
   - **Framework Preset:** Next.js (já detectado).
   - **Root Directory:** deixe em branco.
   - **Build Command:** `next build` (padrão).
   - **Output Directory:** padrão.
5. **Não** clique em Deploy ainda; vamos configurar as variáveis antes.

### 2.3 Variáveis de ambiente na Vercel

1. Na mesma tela do projeto, abra **"Environment Variables"**.
2. Adicione cada variável (nome e valor). Use **Production**, **Preview** e **Development** se quiser que funcione em todos os ambientes.

| Nome | Valor | Obrigatório |
|------|--------|-------------|
| `DATABASE_URL` | A URL do MySQL que você copiou do Railway (pode ser `MYSQL_URL` no Railway; use como `DATABASE_URL` na Vercel) | Sim |
| `NEXTAUTH_SECRET` | Uma string aleatória longa (ex: gere com `openssl rand -base64 32`) | Sim |
| `NEXTAUTH_URL` | **https://seu-dominio.vercel.app** (troque pelo domínio que a Vercel der; ex: `https://ph-silva-imobiliaria.vercel.app`) | Sim |
| `NEXT_PUBLIC_SITE_URL` | Mesmo valor de `NEXTAUTH_URL` | Sim |
| `GOOGLE_MAPS_API_KEY` | Sua chave da API Google Maps | Não (mapa pode ficar desabilitado) |
| `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` | Mesma chave (para o front) | Não |
| `WHATSAPP_NUMBER` | Número com DDI, ex: `5511999999999` | Não |
| `NEXT_PUBLIC_WHATSAPP_NUMBER` | Mesmo número | Não |
| `SMTP_HOST` | Ex: `smtp.gmail.com` | Não |
| `SMTP_PORT` | Ex: `587` | Não |
| `SMTP_USER` | Seu email | Não |
| `SMTP_PASS` | Senha de app do email | Não |

**Exemplo de NEXTAUTH_URL e NEXT_PUBLIC_SITE_URL (após o primeiro deploy):**  
`https://ph-silva-imobiliaria.vercel.app`

3. Salve as variáveis e clique em **"Deploy"**.

### 2.4 Após o primeiro deploy

1. A Vercel vai mostrar uma URL tipo: `https://ph-silva-imobiliaria-xxx.vercel.app`.
2. Volte em **Settings → Environment Variables** e atualize:
   - `NEXTAUTH_URL` = `https://ph-silva-imobiliaria-xxx.vercel.app`
   - `NEXT_PUBLIC_SITE_URL` = `https://ph-silva-imobiliaria-xxx.vercel.app`
3. Faça um novo deploy (**Deployments** → menu do último deploy → **Redeploy**) para aplicar as novas variáveis.

---

## Parte 3: Criar o usuário admin (após deploy)

As tabelas já devem estar criadas no Railway (você rodou o `schema.sql` ou o script antes). Agora falta criar um usuário admin:

1. No seu PC, na pasta do projeto, crie um `.env.local` **só com**:
   ```
   DATABASE_URL=cole_aqui_a_mesma_url_do_railway
   ```
2. Instale dependências e rode o script de criar admin:
   ```bash
   npm install
   node scripts/create-admin.js admin@seusite.com.br SuaSenhaSegura "Seu Nome"
   ```
3. Depois disso, acesse no navegador:
   - **Site:** `https://seu-projeto.vercel.app`
   - **Admin:** `https://seu-projeto.vercel.app/admin/login`

Use o email e a senha que você passou no script.

---

## Resumo do fluxo

1. **Railway:** New Project → Add MySQL → Copiar `MYSQL_URL` / `DATABASE_URL`.
2. **Local:** Rodar `lib/schema.sql` no MySQL do Railway (ou script `init-db-railway`) para criar tabelas.
3. **GitHub:** Subir o código do projeto.
4. **Vercel:** Importar o repo → Configurar variáveis (principalmente `DATABASE_URL`, `NEXTAUTH_SECRET`, `NEXTAUTH_URL`, `NEXT_PUBLIC_SITE_URL`) → Deploy.
5. Ajustar `NEXTAUTH_URL` e `NEXT_PUBLIC_SITE_URL` com a URL final e dar Redeploy.
6. **Local:** Rodar `node scripts/create-admin.js` com `DATABASE_URL` do Railway para criar o primeiro admin.

---

## Dicas

- **Railway:** Na aba **Usage** do MySQL você vê conexões e uso; o plano gratuito tem limites.
- **Vercel:** Cada deploy gera uma URL. Domínio customizado pode ser configurado em **Settings → Domains**.
- **Erro de conexão com o banco:** Confira se `DATABASE_URL` na Vercel está igual à URL do Railway e se não há espaços ou quebras de linha.
- **NextAuth:** `NEXTAUTH_URL` deve ser exatamente a URL pública do site (com `https://`).

---

## Checklist rápido

- [ ] Railway: projeto criado e MySQL adicionado
- [ ] Railway: URL de conexão copiada (`MYSQL_URL` ou `DATABASE_URL`)
- [ ] Local: `.env.local` com `DATABASE_URL` = URL do Railway
- [ ] Local: `npm run db:init` (ou `mysql ... < lib/schema.sql`) para criar tabelas
- [ ] Local: `node scripts/create-admin.js` para criar o primeiro admin
- [ ] GitHub: código do projeto em um repositório
- [ ] Vercel: projeto importado do GitHub
- [ ] Vercel: variáveis de ambiente configuradas (principalmente `DATABASE_URL`, `NEXTAUTH_SECRET`, `NEXTAUTH_URL`)
- [ ] Vercel: primeiro deploy concluído
- [ ] Vercel: `NEXTAUTH_URL` e `NEXT_PUBLIC_SITE_URL` atualizadas com a URL final + Redeploy
- [ ] Teste: acessar o site e fazer login em `/admin/login`

Se quiser, na próxima mensagem podemos só revisar as variáveis que você preencheu ou um erro específico que aparecer no deploy ou no login.
