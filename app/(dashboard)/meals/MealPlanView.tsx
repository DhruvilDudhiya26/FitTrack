'use client'

import { useState } from 'react'
import { DayMeals } from '@/components/meals/DayMeals'
import { Button } from '@/components/ui/button'
import { useRouter } from 'next/navigation'
import { regenerateDay } from '@/server/actions/meals/regenerate-day'

interface MealPlanViewProps {
    mealPlan: any
    userId: string
}

export function MealPlanView({ mealPlan, userId }: MealPlanViewProps) {
    const router = useRouter()
    const [selectedDay, setSelectedDay] = useState('monday')
    const [isRegenerating, setIsRegenerating] = useState(false)

    const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday']
    const dayData = mealPlan.meals[selectedDay]

    const handleRegenerate = async () => {
        setIsRegenerating(true)

        const result = await regenerateDay(userId, mealPlan._id, selectedDay)

        setIsRegenerating(false)

        if (result.success) {
            router.refresh()
        } else {
            alert(result.error || 'Failed to regenerate day')
        }
    }

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            {/* Header */}
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-2xl font-bold text-gray-900">Your Meal Plan</h2>
                    <p className="text-sm text-gray-600">
                        AI-generated • {new Date(mealPlan.startDate).toLocaleDateString()} - {new Date(mealPlan.endDate).toLocaleDateString()}
                    </p>
                </div>
                <Button
                    variant="outline"
                    onClick={() => router.push('/meals/generate')}
                >
                    Generate New Plan
                </Button>
            </div>

            {/* Day Selector */}
            <div className="bg-white rounded-xl p-4">
                <div className="flex gap-2 overflow-x-auto pb-2">
                    {days.map((day) => (
                        <button
                            key={day}
                            onClick={() => setSelectedDay(day)}
                            className={`px-4 py-2 rounded-lg font-medium whitespace-nowrap transition-colors ${selectedDay === day
                                ? 'bg-green-600 text-white'
                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                }`}
                        >
                            {day.charAt(0).toUpperCase() + day.slice(1)}
                        </button>
                    ))}
                </div>
            </div>

            {/* Day Meals */}
            {dayData && (
                <DayMeals
                    day={dayData}
                    onRegenerate={handleRegenerate}
                    isRegenerating={isRegenerating}
                />
            )}
        </div>
    )
}