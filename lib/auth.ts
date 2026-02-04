import { NextAuthOptions } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import bcrypt from 'bcryptjs'
import { getDbPool } from './db'

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Senha', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null
        }

        const pool = getDbPool()
        const [rows] = await pool.execute(
          'SELECT * FROM usuarios WHERE email = ?',
          [credentials.email]
        ) as any[]

        if (rows.length === 0) {
          return null
        }

        const user = rows[0]
        const isValid = await bcrypt.compare(credentials.password, user.senha_hash)

        if (!isValid) {
          return null
        }

        return {
          id: user.id.toString(),
          email: user.email,
          name: user.nome,
        }
      },
    }),
  ],
  session: {
    strategy: 'jwt',
  },
  pages: {
    signIn: '/admin/login',
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
      }
      return token
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string
      }
      return session
    },
  },
}
