'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { WorkoutDayView } from '@/components/workouts/WorkoutDayView'
import { Button } from '@/components/ui/button'
import { regenerateDay } from '@/server/actions/workouts/regenerate-workout-day'

interface WorkoutPlanViewProps {
    workoutPlan: any
    userId: string
}

export function WorkoutPlanView({ workoutPlan, userId }: WorkoutPlanViewProps) {
    const router = useRouter()
    const dayKeys = Object.keys(workoutPlan.workouts)
    const [selectedDayKey, setSelectedDayKey] = useState(dayKeys[0])
    const [isRegenerating, setIsRegenerating] = useState(false)

    const selectedDay = workoutPlan.workouts[selectedDayKey]

    const handleRegenerate = async () => {
        setIsRegenerating(true)

        const result = await regenerateDay(
            userId,
            workoutPlan._id,
            selectedDayKey,
            selectedDay.day
        )

        setIsRegenerating(false)

        if (result.success) {
            router.refresh()
        } else {
            alert(result.error || 'Failed to regenerate')
        }
    }

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            {/* Header */}
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-2xl font-bold text-gray-900">
                        {workoutPlan.name}
                    </h2>
                    <p className="text-sm text-gray-600 mt-1">
                        {workoutPlan.daysPerWeek} days/week •{' '}
                        {workoutPlan.experienceLevel} level •{' '}
                        AI-generated
                    </p>
                </div>
                <Button
                    variant="outline"
                    onClick={() => router.push('/workouts/generate')}
                >
                    New Plan
                </Button>
            </div>

            {/* Plan Info */}
            <div className="grid grid-cols-3 gap-4">
                <div className="bg-green-50 rounded-xl p-4 text-center border-2 border-green-200">
                    <p className="text-2xl font-bold text-green-600">
                        {workoutPlan.daysPerWeek}
                    </p>
                    <p className="text-sm text-gray-600">Days/Week</p>
                </div>
                <div className="bg-blue-50 rounded-xl p-4 text-center border-2 border-blue-200">
                    <p className="text-lg font-bold text-blue-600 capitalize">
                        {workoutPlan.experienceLevel}
                    </p>
                    <p className="text-sm text-gray-600">Level</p>
                </div>
                <div className="bg-purple-50 rounded-xl p-4 text-center border-2 border-purple-200">
                    <p className="text-2xl font-bold text-purple-600">
                        {Object.keys(workoutPlan.workouts).length}
                    </p>
                    <p className="text-sm text-gray-600">Workouts</p>
                </div>
            </div>

            {/* Day Tabs */}
            <div className="bg-white rounded-xl p-4 shadow-sm">
                <div className="flex gap-2 overflow-x-auto pb-1">
                    {dayKeys.map((key) => {
                        const day = workoutPlan.workouts[key]
                        return (
                            <button
                                key={key}
                                onClick={() => setSelectedDayKey(key)}
                                className={`px-4 py-2 rounded-lg font-medium whitespace-nowrap transition-colors flex-shrink-0 ${selectedDayKey === key
                                    ? 'bg-green-600 text-white'
                                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                    }`}
                            >
                                {day.day}
                            </button>
                        )
                    })}
                </div>
            </div>

            {/* Selected Day */}
            {selectedDay && (
                <WorkoutDayView
                    day={selectedDay}
                    dayKey={selectedDayKey}
                    planId={workoutPlan._id}
                    userId={userId}
                    onRegenerate={handleRegenerate}
                    isRegenerating={isRegenerating}
                />
            )}
        </div>
    )
}