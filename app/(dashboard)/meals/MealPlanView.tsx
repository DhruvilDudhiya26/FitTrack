'use client'

import { useState, useEffect } from 'react'
import { DayMeals } from '@/components/meals/DayMeals'
import { Button } from '@/components/ui/button'
import { useRouter } from 'next/navigation'
import { regenerateDay } from '@/server/actions/meals/regenerate-day'

interface MealPlanViewProps {
    mealPlan: any
    userId: string
}

// Helper function to get today's day name in lowercase
function getTodayDayName(): string {
    const days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday']
    return days[new Date().getDay()]
}

export function MealPlanView({ mealPlan, userId }: MealPlanViewProps) {
    const router = useRouter()
    const todayDay = getTodayDayName()
    const [selectedDay, setSelectedDay] = useState(todayDay)
    const [isRegenerating, setIsRegenerating] = useState(false)

    // Ensure selectedDay is set to today when component mounts
    useEffect(() => {
        setSelectedDay(todayDay)
    }, [todayDay])

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
            <div>
                <h2 className="text-2xl font-bold text-gray-900">Your Meal Plan</h2>
                <p className="text-sm text-gray-600">
                    AI-generated • {new Date(mealPlan.startDate).toLocaleDateString()} - {new Date(mealPlan.endDate).toLocaleDateString()}
                </p>
            </div>

            {/* Day Selector */}
            <div className="bg-white rounded-xl p-4">
                <div className="grid grid-cols-7 gap-2">
                    {days.map((day) => {
                        const isToday = day === todayDay
                        const isSelected = selectedDay === day
                        return (
                            <button
                                key={day}
                                onClick={() => setSelectedDay(day)}
                                className={`px-2 py-2 rounded-lg font-medium text-sm transition-colors ${isSelected
                                    ? 'bg-green-600 text-white'
                                    : isToday
                                        ? 'bg-green-100 text-green-700 border-2 border-green-500'
                                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                    }`}
                            >
                                <div className="flex flex-col items-center">
                                    <span>{day.charAt(0).toUpperCase() + day.slice(1, 3)}</span>
                                    {isToday && !isSelected && <span className="text-xs mt-0.5">•</span>}
                                </div>
                            </button>
                        )
                    })}
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