import { auth, clerkClient } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import Sidebar from '@/components/admin/Sidebar'

export default async function PainelLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { userId } = await auth()

  if (!userId) {
    redirect('/login')
  }

  const client = await clerkClient()
  const user = await client.users.getUser(userId)

  if (user.publicMetadata?.role !== 'admin') {
    redirect('/login')
  }

  return (
    <div className="min-h-screen bg-background text-neutral-300 relative overflow-x-hidden">
      {/* Background glow for admin area */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/10 blur-[150px] rounded-full mix-blend-screen pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-secondary/10 blur-[150px] rounded-full mix-blend-screen pointer-events-none" />

      <Sidebar />
      <main className="ml-0 lg:ml-72 p-6 md:p-10 relative z-10 transition-all duration-300">
        {children}
      </main>
    </div>
  )
}
