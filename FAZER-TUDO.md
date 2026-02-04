# Fazer tudo: .env.local, GitHub, Vercel e Railway

Siga esta ordem no **terminal** (PowerShell ou CMD) na pasta do projeto.

---

## 1. Criar/atualizar o .env.local

O arquivo **`.env.local`** já foi criado. Faça o seguinte:

**a) Gerar um NEXTAUTH_SECRET válido (recomendado):**

Se você tem **Node/npm** no PATH:
```bash
npm run setup:env
```

Se **npm não é reconhecido**, use o script em PowerShell (não precisa de Node):
```powershell
.\scripts\setup-env.ps1
```

**b) Abra o arquivo `.env.local`** e substitua:
- `COLE_A_URL_DO_RAILWAY_AQUI` → pela **URL do MySQL** que você copiou no Railway  
  (Railway → seu projeto → MySQL → Variables → **MYSQL_URL** ou **DATABASE_URL** → Copy)

Salve o arquivo.

---

## 2. Criar as tabelas no MySQL (Railway)

Com a `DATABASE_URL` já preenchida no `.env.local`:

```bash
npm install
npm run db:init
```

Deve aparecer: **Tabelas criadas com sucesso no Railway!**

---

## 3. Enviar o projeto para o GitHub

**a) Execute o script (PowerShell):**
```powershell
.\scripts\enviar-github.ps1
```

Se der erro de permissão, rode antes:
```powershell
Set-ExecutionPolicy -Scope CurrentUser -ExecutionPolicy RemoteSigned
```

**b) Crie o repositório no GitHub:**
- Acesse: https://github.com/new  
- Nome: `ph-silva-imobiliaria` (ou outro)  
- **Não** marque “Add a README file”  
- Clique em **Create repository**

**c) Conecte e envie (troque `SEU_USUARIO` pelo seu usuário do GitHub):**
```bash
git remote add origin https://github.com/SEU_USUARIO/ph-silva-imobiliaria.git
git push -u origin main
```

Se já tiver configurado outro `origin`, ajuste antes:
```bash
git remote set-url origin https://github.com/SEU_USUARIO/ph-silva-imobiliaria.git
git push -u origin main
```

---

## 4. Deploy na Vercel

1. Acesse https://vercel.com e faça login (recomendado com GitHub).
2. **Add New...** → **Project** → importe o repositório **ph-silva-imobiliaria**.
3. Em **Environment Variables** adicione:

| Nome | Valor |
|------|--------|
| `DATABASE_URL` | A **mesma URL** do Railway (a que está no seu `.env.local`) |
| `NEXTAUTH_SECRET` | O mesmo valor que está no seu `.env.local` |
| `NEXTAUTH_URL` | `https://seu-projeto.vercel.app` (troque pelo domínio que a Vercel mostrar) |
| `NEXT_PUBLIC_SITE_URL` | Mesmo valor de `NEXTAUTH_URL` |

4. Clique em **Deploy**.
5. Depois do deploy: em **Settings** → **Environment Variables** atualize `NEXTAUTH_URL` e `NEXT_PUBLIC_SITE_URL` com a URL final do projeto e faça **Redeploy**.

---

## 5. Criar o usuário admin

No seu PC, no mesmo projeto (com `.env.local` com a URL do Railway). **Nunca coloque a senha no código** – passe sempre pela linha de comando:

```bash
node scripts/create-admin.js admin@seusite.com.br SuaSenhaSegura "Seu Nome"
```

Acesse: **https://seu-projeto.vercel.app/admin/login**

---

## Resumo

| Passo | Comando / Ação |
|-------|-----------------|
| 1 | `npm run setup:env` e editar `.env.local` (colar URL do Railway) |
| 2 | `npm run db:init` |
| 3 | `.\scripts\enviar-github.ps1` → criar repo no GitHub → `git remote add origin ...` → `git push -u origin main` |
| 4 | Vercel: importar repo, colocar variáveis, Deploy |
| 5 | `node scripts/create-admin.js email senha "Nome"` (senha só no comando, nunca no código) |

Se algo falhar, veja **CONECTAR-VERCEL-RAILWAY.md** para mais detalhes.
