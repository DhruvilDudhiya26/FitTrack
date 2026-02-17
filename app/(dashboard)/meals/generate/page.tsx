'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useUser } from '@/hooks/use-user'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { generateAIMealPlan } from '@/server/actions/meals/generate-plan'
import { getActiveMealPlan } from '@/server/actions/meals/get-active-plan'

export default function GenerateMealPlanPage() {
    const router = useRouter()
    const { user } = useUser()
    const [isGenerating, setIsGenerating] = useState(false)
    const [error, setError] = useState('')
    const [isChecking, setIsChecking] = useState(true)

    // Check if meal plan already exists on mount
    useEffect(() => {
        async function checkExistingPlan() {
            if (!user?.id) return

            const result = await getActiveMealPlan(user.id)
            if (result.success && result.mealPlan) {
                // Redirect to meals page if plan exists
                router.push('/meals')
                return
            }
            setIsChecking(false)
        }
        checkExistingPlan()
    }, [user?.id, router])

    const handleGenerate = async () => {
        if (!user?.id) return

        setIsGenerating(true)
        setError('')

        try {
            const result = await generateAIMealPlan(user.id)

            if (!result.success) {
                setError(result.error || 'Failed to generate meal plan')
                setIsGenerating(false)
                return
            }

            // Success! Redirect to meal plan view
            router.push('/meals')
            router.refresh()
        } catch (error) {
            setError('Something went wrong. Please try again.')
            setIsGenerating(false)
        }
    }

    // Show loading while checking for existing plan
    if (isChecking) {
        return (
            <div className="max-w-2xl mx-auto space-y-6">
                <div className="bg-white rounded-2xl p-12 text-center">
                    <div className="animate-spin text-4xl mb-4">⏳</div>
                    <p className="text-gray-600">Checking for existing meal plan...</p>
                </div>
            </div>
        )
    }

    return (
        <div className="max-w-2xl mx-auto space-y-6">
            <div>
                <h2 className="text-2xl font-bold text-gray-900">Generate Meal Plan</h2>
                <p className="text-gray-600 mt-1">
                    AI will create a personalized 7-day meal plan based on your profile
                </p>
            </div>

            <Card className="p-8">
                <div className="text-center space-y-6">
                    <div className="text-6xl">✨</div>

                    <div>
                        <h3 className="text-xl font-semibold text-gray-900 mb-2">
                            Ready to Generate?
                        </h3>
                        <p className="text-gray-600">
                            Your meal plan will include:
                        </p>
                    </div>

                    <div className="grid grid-cols-2 gap-4 text-left">
                        <div className="p-3 bg-green-50 rounded-lg">
                            <div className="font-semibold text-gray-900 mb-1">🎯 Personalized</div>
                            <div className="text-sm text-gray-600">Matches your macros & goals</div>
                        </div>
                        <div className="p-3 bg-blue-50 rounded-lg">
                            <div className="font-semibold text-gray-900 mb-1">📅 7 Days</div>
                            <div className="text-sm text-gray-600">Complete week of meals</div>
                        </div>
                        <div className="p-3 bg-purple-50 rounded-lg">
                            <div className="font-semibold text-gray-900 mb-1">🍳 Detailed</div>
                            <div className="text-sm text-gray-600">Ingredients & instructions</div>
                        </div>
                        <div className="p-3 bg-orange-50 rounded-lg">
                            <div className="font-semibold text-gray-900 mb-1">🔄 Flexible</div>
                            <div className="text-sm text-gray-600">Regenerate any day</div>
                        </div>
                    </div>

                    {error && (
                        <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                            {error}
                        </div>
                    )}

                    <Button
                        onClick={handleGenerate}
                        disabled={isGenerating}
                        size="lg"
                        className="w-full bg-green-600 hover:bg-green-700"
                    >
                        {isGenerating ? (
                            <span className="flex items-center gap-2">
                                <span className="animate-spin">⏳</span>
                                Generating... (this may take 30-60 seconds)
                            </span>
                        ) : (
                            '✨ Generate My Meal Plan'
                        )}
                    </Button>

                    <div className="text-center">
                        <Link href="/meals">
                            <Button variant="outline" className="w-full">
                                ← Back to Meal Plans
                            </Button>
                        </Link>
                    </div>

                    <p className="text-xs text-gray-500">
                        Note: Generation takes 30-60 seconds. Please be patient!
                    </p>
                </div>
            </Card>
        </div>
    )
}