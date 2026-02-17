'use client'

import { useState } from 'react'
import { Card } from '@/components/ui/card'

interface Exercise {
    name: string
    sets: number
    reps: string
    rest: string
    muscleGroups: string[]
    instructions: string[]
    tips?: string
}

interface ExerciseCardProps {
    exercise: Exercise
    index: number
}

export function ExerciseCard({ exercise, index }: ExerciseCardProps) {
    const [expanded, setExpanded] = useState(false)

    return (
        <Card className="p-4">
            <div
                className="cursor-pointer"
                onClick={() => setExpanded(!expanded)}
            >
                <div className="flex justify-between items-start">
                    <div className="flex items-start gap-3">
                        <div className="w-8 h-8 bg-green-600 text-white rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">
                            {index + 1}
                        </div>
                        <div>
                            <h4 className="font-semibold text-gray-900">{exercise.name}</h4>
                            <div className="flex flex-wrap gap-2 mt-1">
                                <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded">
                                    {exercise.sets} sets
                                </span>
                                <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded">
                                    {exercise.reps} reps
                                </span>
                                <span className="text-xs bg-orange-100 text-orange-700 px-2 py-0.5 rounded">
                                    {exercise.rest} rest
                                </span>
                            </div>
                            <div className="flex flex-wrap gap-1 mt-2">
                                {exercise.muscleGroups.map((muscle) => (
                                    <span
                                        key={muscle}
                                        className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded"
                                    >
                                        {muscle}
                                    </span>
                                ))}
                            </div>
                        </div>
                    </div>
                    <span className="text-gray-400 text-lg">
                        {expanded ? '▲' : '▼'}
                    </span>
                </div>
            </div>

            {expanded && (
                <div className="mt-4 pt-4 border-t border-gray-100 space-y-3">
                    <div>
                        <h5 className="font-semibold text-gray-900 text-sm mb-2">
                            Instructions:
                        </h5>
                        <ol className="space-y-1">
                            {exercise.instructions.map((step, idx) => (
                                <li key={idx} className="flex items-start gap-2 text-sm text-gray-700">
                                    <span className="font-semibold text-green-600 flex-shrink-0">
                                        {idx + 1}.
                                    </span>
                                    {step}
                                </li>
                            ))}
                        </ol>
                    </div>

                    {exercise.tips && (
                        <div className="bg-yellow-50 rounded-lg p-3">
                            <p className="text-sm text-yellow-800">
                                <span className="font-semibold">💡 Tip: </span>
                                {exercise.tips}
                            </p>
                        </div>
                    )}
                </div>
            )}
        </Card>
    )
}