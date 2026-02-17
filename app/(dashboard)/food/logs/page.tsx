
import { auth } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { getTodaysLogs } from '@/server/actions/food/get-todays-logs'
import { MealSection } from '@/components/food/MealSection'
import { DailyTotalsBar } from '@/components/food/DailyTotalsBar'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { getUserProfile } from '@/server/actions/Profile/get-profile'

export default async function FoodLogsPage() {
    const session = await auth();

    if (!session?.user?.id) redirect('/login')

    const profileResult = await getUserProfile(session.user.id)
    if (!profileResult.success || !profileResult.profile) redirect('/onboarding')

    const profile = profileResult.profile
    const logsResult = await getTodaysLogs(session.user.id)
    const { logs, totals } = logsResult

    // Group logs by meal type
    const grouped = {
        breakfast: logs.filter((log: any) => log.mealType === 'breakfast'),
        lunch: logs.filter((log: any) => log.mealType === 'lunch'),
        dinner: logs.filter((log: any) => log.mealType === 'dinner'),
        snack: logs.filter((log: any) => log.mealType === 'snack'),
    }

    const targets = {
        calories: profile.targetCalories,
        protein: profile.targetProtein,
        carbs: profile.targetCarbs,
        fats: profile.targetFats,
    }

    const totalItems = logs.length

    return (
        <div className="max-w-2xl mx-auto space-y-6">
            {/* Header */}
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-2xl font-bold text-gray-900">Food Log</h2>
                    <p className="text-sm text-gray-600">
                        {new Date().toLocaleDateString('en-US', {
                            weekday: 'long',
                            month: 'long',
                            day: 'numeric',
                        })}
                        {totalItems > 0 && ` • ${totalItems} item${totalItems !== 1 ? 's' : ''}`}
                    </p>
                </div>
                <Link href="/food/add">
                    <Button className="bg-green-600 hover:bg-green-700">
                        + Add Food
                    </Button>
                </Link>
            </div>

            {/* Daily Summary */}
            <DailyTotalsBar totals={totals} targets={targets} />

            {/* Meal Sections */}
            <div className="space-y-4">
                {(['breakfast', 'lunch', 'dinner', 'snack'] as const).map((mealType) => (
                    <MealSection
                        key={mealType}
                        mealType={mealType}
                        logs={grouped[mealType]}
                    />
                ))}
            </div>

            {/* Empty State */}
            {totalItems === 0 && (
                <div className="text-center py-8">
                    <p className="text-4xl mb-3">🍽️</p>
                    <h3 className="font-semibold text-gray-900 mb-1">Nothing logged yet today!</h3>
                    <p className="text-sm text-gray-600 mb-4">
                        Start by adding your breakfast
                    </p>
                    <Link href="/food/add?meal=breakfast">
                        <Button className="bg-green-600 hover:bg-green-700">
                            + Log Breakfast
                        </Button>
                    </Link>
                </div>
            )}
        </div>
    )
}