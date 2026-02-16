import { auth } from '@/lib/auth'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { MealPlanView } from './MealPlanView'
import { getActiveMealPlan } from '@/server/actions/meals/get-active-plan'

export default async function MealsPage() {
    const session = await auth();

    if (!session?.user?.id) {
        redirect('/login')
    }

    const result = await getActiveMealPlan(session.user.id)

    if (!result.success || !result.mealPlan) {
        return (
            <div className="max-w-4xl mx-auto space-y-6">
                <h2 className="text-2xl font-bold text-gray-900">Meal Plans</h2>

                <div className="bg-white rounded-2xl p-12 text-center">
                    <p className="text-6xl mb-4">🍴</p>
                    <h3 className="text-2xl font-semibold text-gray-900 mb-2">
                        No Meal Plan Yet
                    </h3>
                    <p className="text-gray-600 mb-6">
                        Generate a personalized 7-day meal plan with AI based on your goals and preferences.
                    </p>
                    <Link href="/meals/generate">
                        <Button size="lg" className="bg-green-600 hover:bg-green-700">
                            ✨ Generate Meal Plan
                        </Button>
                    </Link>
                </div>
            </div>
        )
    }

    return <MealPlanView mealPlan={result.mealPlan} userId={session.user.id} />
}