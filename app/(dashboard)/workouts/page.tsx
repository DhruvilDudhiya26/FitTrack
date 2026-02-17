import { auth } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { getActiveWorkoutPlan } from '@/server/actions/workouts/get-workout-plan'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { WorkoutPlanView } from './WorkoutPlanView'

export default async function WorkoutsPage() {
    const session = await auth();

    if (!session?.user?.id) redirect('/login')

    const result = await getActiveWorkoutPlan(session.user.id)

    if (!result.success || !result.workoutPlan) {
        return (
            <div className="max-w-4xl mx-auto space-y-6">
                <h2 className="text-2xl font-bold text-gray-900">Workouts</h2>

                <div className="bg-white rounded-2xl p-12 text-center">
                    <p className="text-6xl mb-4">💪</p>
                    <h3 className="text-2xl font-semibold text-gray-900 mb-2">
                        No Workout Plan Yet
                    </h3>
                    <p className="text-gray-600 mb-6">
                        Generate a personalized workout plan with AI based on your goals, experience, and available equipment.
                    </p>
                    <Link href="/workouts/generate">
                        <Button size="lg" className="bg-green-600 hover:bg-green-700">
                            ✨ Generate Workout Plan
                        </Button>
                    </Link>
                </div>
            </div>
        )
    }

    return (
        <WorkoutPlanView
            workoutPlan={result.workoutPlan}
            userId={session.user.id}
        />
    )
}