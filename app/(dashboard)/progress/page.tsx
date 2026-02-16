import { auth } from '@/lib/auth'
import { getUserProfile } from '@/server/actions/Profile/get-profile';
import { getWeightLogs } from '@/server/actions/progress/get-weight-log';
import { redirect } from 'next/navigation'
import { ProgressView } from './ProgressView';


export default async function ProgressPage() {
    const session = await auth();

    if (!session?.user?.id) {
        redirect('/login')
    }

    const profileResult = await getUserProfile(session.user.id)

    if (!profileResult.success || !profileResult.profile) {
        redirect('/onboarding')
    }

    const profile = profileResult.profile
    const weightLogsResult = await getWeightLogs(session.user.id, 90)

    return (
        <ProgressView
            userId={session.user.id}
            profile={profile}
            weightLogs={weightLogsResult.logs}
        />
    )
}