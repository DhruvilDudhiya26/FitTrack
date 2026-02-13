import { CalorieProgress } from '@/components/dashboard/CalorieProgress'
import { MacroCard } from '@/components/dashboard/MacroCard'
import { QuickActions } from '@/components/dashboard/QuickActions'
import { auth, authOptions } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { TodaysMeals } from '@/components/dashboard/TodaysMeal'
import { getUserProfile } from '@/server/actions/Profile/get-profile'

export default async function DashboardPage() {
    const session = await auth();

    if (!session?.user?.id) {
        redirect('/login')
    }

    const profileResult = await getUserProfile(session.user.id)

    if (!profileResult.success || !profileResult.profile) {
        redirect('/onboarding')
    }

    const profile = profileResult.profile

    // TODO: Get today's food logs - for now using mock data
    const todayCalories = 0 // Will be replaced with real data
    const todayProtein = 0
    const todayCarbs = 0
    const todayFats = 0

    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <h2 className="text-2xl font-bold text-gray-900">Today</h2>
                <p className="text-sm text-gray-600">
                    {new Date().toLocaleDateString('en-US', {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                    })}
                </p>
            </div>

            {/* Calorie Progress - NOW USING REAL DATA */}
            <CalorieProgress
                current={todayCalories}
                target={profile.targetCalories}
            />

            {/* Macros - NOW USING REAL DATA */}
            <div className="bg-white rounded-2xl p-6 shadow-sm space-y-4">
                <h3 className="font-bold text-gray-900">Macros</h3>
                <MacroCard
                    label="Protein"
                    current={todayProtein}
                    target={profile.targetProtein}
                    color="green"
                />
                <MacroCard
                    label="Carbs"
                    current={todayCarbs}
                    target={profile.targetCarbs}
                    color="blue"
                />
                <MacroCard
                    label="Fats"
                    current={todayFats}
                    target={profile.targetFats}
                    color="orange"
                />
            </div>

            {/* Quick Actions */}
            <QuickActions />

            {/* Today's Meals */}
            <div className="bg-white rounded-2xl p-6 shadow-sm">
                <TodaysMeals meals={[]} />
            </div>

            {/* Goal Info */}
            <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-6 border-2 border-purple-200">
                <div className="flex items-start gap-3">
                    <span className="text-2xl">🎯</span>
                    <div>
                        <h4 className="font-semibold text-gray-900 mb-1">Your Goal</h4>
                        <p className="text-sm text-gray-700">
                            {profile.goalType === 'lose_weight' && 'Lose weight - '}
                            {profile.goalType === 'gain_muscle' && 'Build muscle - '}
                            {profile.goalType === 'maintain' && 'Maintain weight - '}
                            Target: {profile.targetWeight}kg
                        </p>
                        <p className="text-xs text-gray-600 mt-1">
                            Daily calories: {profile.targetCalories} | TDEE: {profile.tdee}
                        </p>
                    </div>
                </div>
            </div>

            {/* Tip Card */}
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-6 border-2 border-green-200">
                <div className="flex items-start gap-3">
                    <span className="text-2xl">💡</span>
                    <div>
                        <h4 className="font-semibold text-gray-900 mb-1">Daily Tip</h4>
                        <p className="text-sm text-gray-700">
                            Start logging your meals to see your progress! Aim to hit your protein target first.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
}