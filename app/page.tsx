import Link from "next/link"
import { Button } from "@/components/ui/button"
import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"

export default async function Home() {
  const session = await auth()

  // If user is logged in, redirect to dashboard
  if (session) {
    redirect('/dashboard')
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24 bg-gradient-to-br from-green-50 to-blue-50">
      <div className="text-center max-w-3xl">
        <h1 className="text-6xl font-bold text-gray-900 mb-4">
          🏋️ FitTrack
        </h1>
        <p className="text-2xl text-gray-600 mb-2">
          AI-Powered Fitness & Nutrition Tracking
        </p>
        <p className="text-lg text-gray-500 mb-8">
          Track your meals, generate personalized workout plans, and reach your goals with AI assistance
        </p>
        <div className="flex gap-4 justify-center">
          <Link href="/login">
            <Button size="lg" variant="outline">
              Login
            </Button>
          </Link>
          <Link href="/signup">
            <Button size="lg" className="bg-green-600 hover:bg-green-700">
              Get Started Free
            </Button>
          </Link>
        </div>

        <div className="mt-12 grid grid-cols-3 gap-6 text-left">
          <div className="p-4 bg-white rounded-lg shadow-sm">
            <div className="text-3xl mb-2">🍎</div>
            <h3 className="font-semibold text-gray-900 mb-1">Food Tracking</h3>
            <p className="text-sm text-gray-600">Log meals with barcode scanning</p>
          </div>
          <div className="p-4 bg-white rounded-lg shadow-sm">
            <div className="text-3xl mb-2">🤖</div>
            <h3 className="font-semibold text-gray-900 mb-1">AI Meal Plans</h3>
            <p className="text-sm text-gray-600">Personalized nutrition plans</p>
          </div>
          <div className="p-4 bg-white rounded-lg shadow-sm">
            <div className="text-3xl mb-2">💪</div>
            <h3 className="font-semibold text-gray-900 mb-1">Workout Plans</h3>
            <p className="text-sm text-gray-600">AI-generated workouts</p>
          </div>
        </div>
      </div>
    </main>
  )
}