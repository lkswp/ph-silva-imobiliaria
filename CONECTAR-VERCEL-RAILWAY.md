# Conectar no Vercel + Railway MySQL

Checklist rápido para deixar o site no ar usando **Vercel** (front/API) e **MySQL no Railway**.

---

## 1. Railway – MySQL

1. Acesse **[railway.app](https://railway.app)** e faça login.
2. **New Project** → **Empty Project** (ou Deploy from GitHub).
3. **+ New** → **Database** → **MySQL**.
4. Clique no serviço **MySQL** → aba **Variables** ou **Connect**.
5. Copie o valor de **`MYSQL_URL`** (ou **`DATABASE_URL`**).  
   Exemplo: `mysql://root:senha@containers-us-west-xxx.railway.app:6543/railway`

Guarde essa URL; você vai usar no `.env.local` e na Vercel.

---

## 2. Criar tabelas no MySQL (Railway)

No seu PC, na pasta do projeto:

1. Crie o arquivo **`.env.local`** (copie de `.env.local.example`):
   ```env
   DATABASE_URL=cole_aqui_a_url_que_voce_copiou_do_railway
   ```

2. Instale e rode o script que cria as tabelas:
   ```bash
   npm install
   npm run db:init
   ```

Se der certo, aparece: **Tabelas criadas com sucesso no Railway!**

---

## 3. Vercel – Deploy

1. Suba o código no **GitHub** (se ainda não subiu):
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/SEU_USUARIO/ph-silva-imobiliaria.git
   git push -u origin main
   ```

2. Acesse **[vercel.com](https://vercel.com)** → **Add New...** → **Project**.
3. Importe o repositório **ph-silva-imobiliaria**.
4. **Antes de dar Deploy**, abra **Environment Variables** e adicione:

| Nome | Valor | Onde colar |
|------|--------|------------|
| `DATABASE_URL` | A **mesma URL** do Railway (MYSQL_URL) | Production, Preview, Development |
| `NEXTAUTH_SECRET` | Gere com: `openssl rand -base64 32` | Production, Preview, Development |
| `NEXTAUTH_URL` | `https://seu-projeto.vercel.app` *(troque pelo domínio que a Vercel mostrar)* | Production, Preview, Development |
| `NEXT_PUBLIC_SITE_URL` | Mesmo valor de `NEXTAUTH_URL` | Production, Preview, Development |

5. Clique em **Deploy**.

---

## 4. Ajustar URL após o primeiro deploy

A Vercel vai dar uma URL tipo: `https://ph-silva-imobiliaria-xxx.vercel.app`

1. Em **Settings** → **Environment Variables**, edite:
   - `NEXTAUTH_URL` = `https://ph-silva-imobiliaria-xxx.vercel.app`
   - `NEXT_PUBLIC_SITE_URL` = `https://ph-silva-imobiliaria-xxx.vercel.app`
2. **Deployments** → no último deploy → **⋯** → **Redeploy**.

---

## 5. Criar usuário admin

No seu PC, com o mesmo **`.env.local`** (com `DATABASE_URL` do Railway):

```bash
node scripts/create-admin.js admin@seusite.com.br SuaSenhaSegura "Seu Nome"
```

Depois acesse: **https://seu-projeto.vercel.app/admin/login**

---

## Resumo

| Onde | O que fazer |
|------|-------------|
| **Railway** | Criar projeto → Add MySQL → Copiar `MYSQL_URL` |
| **Local** | `.env.local` com `DATABASE_URL` = URL do Railway → `npm run db:init` |
| **Vercel** | Importar repo → Variáveis: `DATABASE_URL`, `NEXTAUTH_SECRET`, `NEXTAUTH_URL`, `NEXT_PUBLIC_SITE_URL` → Deploy |
| **Vercel** | Após deploy: atualizar `NEXTAUTH_URL` e `NEXT_PUBLIC_SITE_URL` com a URL final → Redeploy |
| **Local** | `node scripts/create-admin.js email senha "Nome"` para criar o admin |

O projeto já está preparado: **lib/db.ts** usa `DATABASE_URL` ou `MYSQL_URL` e ativa SSL automaticamente para conexões com o Railway.
