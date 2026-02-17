import { auth } from '@/lib/auth'
import { getUserProfile } from '@/server/actions/Profile/get-profile';
import { redirect } from 'next/navigation'
import { SettingsView } from './SettingsView';

export default async function SettingsPage() {
    const session = await auth();
    if (!session?.user?.id) redirect('/login')

    const profileResult = await getUserProfile(session.user.id)
    if (!profileResult.success || !profileResult.profile) redirect('/onboarding')

    return (
        <SettingsView
            userId={session.user.id}
            profile={profileResult.profile}
        />
    )
}