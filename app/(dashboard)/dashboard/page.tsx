import { CalorieProgress } from '@/components/dashboard/CalorieProgress'
import { MacroCard } from '@/components/dashboard/MacroCard'
import { QuickActions } from '@/components/dashboard/QuickActions'
import { TodaysMeals } from '@/components/dashboard/TodaysMeal'
import { WaterTracker } from '@/components/dashboard/WaterTracker'
import { auth } from '@/lib/auth'
import { getTodaysLogs } from '@/server/actions/food/get-todays-logs'
import { getUserProfile } from '@/server/actions/Profile/get-profile'
import { getTodaysWater } from '@/server/actions/water/log-water'
import Link from 'next/link'
import { redirect } from 'next/navigation'

export default async function DashboardPage() {
    const session = await auth()

    const waterResult = await getTodaysWater(session?.user?.id)

    if (!session?.user?.id) {
        redirect('/login')
    }

    const profileResult = await getUserProfile(session.user.id)

    if (!profileResult.success || !profileResult.profile) {
        redirect('/onboarding')
    }

    const profile = profileResult.profile

    // Get today's food logs - REAL DATA!
    const logsResult = await getTodaysLogs(session.user.id)
    if (!logsResult.success || !logsResult.totals || !logsResult.logs) {
        redirect('/dashboard')
    }
    const { totals, logs } = logsResult

    // Group logs by meal type
    const mealGroups = {
        breakfast: logs.filter((log: any) => log.mealType === 'breakfast'),
        lunch: logs.filter((log: any) => log.mealType === 'lunch'),
        dinner: logs.filter((log: any) => log.mealType === 'dinner'),
        snack: logs.filter((log: any) => log.mealType === 'snack'),
    }

    // Convert to meals array for component
    const meals = Object.entries(mealGroups)
        .filter(([_, items]) => items.length > 0)
        .map(([type, items]: [string, any[]]) => {
            const mealCalories = items.reduce((sum, item) => {
                return sum + (item.food ? item.food.calories * item.servings : 0)
            }, 0)

            return {
                id: type,
                type,
                items: items.length,
                calories: Math.round(mealCalories),
            }
        })

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

            {/* Calorie Progress - REAL DATA */}
            <CalorieProgress
                current={totals.calories}
                target={profile.targetCalories}
            />

            {/* Macros - REAL DATA */}
            <div className="bg-white rounded-2xl p-6 shadow-sm space-y-4">
                <h3 className="font-bold text-gray-900">Macros</h3>
                <MacroCard
                    label="Protein"
                    current={totals.protein}
                    target={profile.targetProtein}
                    color="green"
                />
                <MacroCard
                    label="Carbs"
                    current={totals.carbs}
                    target={profile.targetCarbs}
                    color="blue"
                />
                <MacroCard
                    label="Fats"
                    current={totals.fats}
                    target={profile.targetFats}
                    color="orange"
                />
            </div>

            {/* Quick Actions */}
            <QuickActions />

            {/* Water Tracker */}
            <WaterTracker
                userId={session.user.id}
                initialGlasses={waterResult.glasses}
                goal={8}
            />

            {/* Today's Meals - REAL DATA */}
            <div className="bg-white rounded-2xl p-6 shadow-sm">
                <TodaysMeals meals={meals} />
            </div>

            {/* Goal Info */}
            {/* Goal Info */}
            <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-6 border-2 border-purple-200">
                <div className="flex items-start gap-3">
                    <span className="text-2xl">🎯</span>
                    <div className="flex-1">
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
                        <Link href="/progress" className="text-sm text-purple-600 hover:text-purple-700 font-medium mt-2 inline-block">
                            View Progress →
                        </Link>
                    </div>
                </div>
            </div>

            {/* Tip Card */}
            {totals.calories === 0 && (
                <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-6 border-2 border-green-200">
                    <div className="flex items-start gap-3">
                        <span className="text-2xl">💡</span>
                        <div>
                            <h4 className="font-semibold text-gray-900 mb-1">Get Started!</h4>
                            <p className="text-sm text-gray-700">
                                Click "Log Meal" to start tracking your food. Try logging your breakfast first!
                            </p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}