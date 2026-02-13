import { Header } from '@/components/layout/Header'
import { BottomNav } from '@/components/layout/BottomNav'
import { getUserProfile } from '@/server/actions/Profile/get-profile'
import { redirect } from 'next/navigation'
import { auth } from '@/lib/auth'

export default async function DashboardLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const session = await auth();

    if (!session?.user?.id) {
        redirect('/login')
    }

    // Check if user has completed onboarding
    const profileResult = await getUserProfile(session.user.id)

    if (!profileResult.success || !profileResult.profile) {
        redirect('/onboarding')
    }
    return (
        <div className="min-h-screen bg-gray-50 pb-20">
            <Header />
            <main className="w-full max-w-lg mx-auto px-3 py-6">
                {children}
            </main>
            <BottomNav />
        </div>
    )
}