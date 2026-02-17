'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { logWater } from '@/server/actions/water/log-water'

interface WaterTrackerProps {
    userId: string
    initialGlasses: number
    goal?: number
}

export function WaterTracker({ userId, initialGlasses, goal = 8 }: WaterTrackerProps) {
    const router = useRouter()
    const [glasses, setGlasses] = useState(initialGlasses)
    const [isUpdating, setIsUpdating] = useState(false)

    const percent = Math.min(Math.round((glasses / goal) * 100), 100)

    const handleUpdate = async (newGlasses: number) => {
        if (newGlasses < 0 || newGlasses > 20) return
        setIsUpdating(true)
        setGlasses(newGlasses)

        await logWater(userId, newGlasses)

        setIsUpdating(false)
        router.refresh()
    }

    return (
        <div className="bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 rounded-2xl p-5 border-2 border-blue-200 dark:border-blue-800">
            <div className="flex justify-between items-center mb-3">
                <div className="flex items-center gap-2">
                    <span className="text-2xl">💧</span>
                    <div>
                        <h3 className="font-bold text-gray-900 dark:text-white">Water Intake</h3>
                        <p className="text-xs text-gray-600 dark:text-gray-400">{glasses} / {goal} glasses</p>
                    </div>
                </div>
                <span className={`text-lg font-bold ${percent >= 100 ? 'text-green-600' : 'text-blue-600'}`}>
                    {percent}%
                </span>
            </div>

            {/* Glass Icons */}
            <div className="flex gap-1 flex-wrap mb-3">
                {Array.from({ length: goal }).map((_, i) => (
                    <button
                        key={i}
                        onClick={() => handleUpdate(i < glasses ? i : i + 1)}
                        disabled={isUpdating}
                        className={`text-xl transition-all hover:scale-110 ${i < glasses ? 'opacity-100' : 'opacity-30'
                            }`}
                        title={i < glasses ? 'Click to remove' : 'Click to add'}
                    >
                        💧
                    </button>
                ))}
            </div>

            {/* Progress Bar */}
            <div className="w-full bg-blue-100 dark:bg-blue-900/40 rounded-full h-2 mb-3">
                <div
                    className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${percent}%` }}
                />
            </div>

            {/* Controls */}
            <div className="flex gap-2">
                <button
                    onClick={() => handleUpdate(glasses - 1)}
                    disabled={glasses === 0 || isUpdating}
                    className="flex-1 py-2 rounded-lg border-2 border-blue-200 dark:border-blue-700 text-blue-600 font-bold hover:bg-blue-100 dark:hover:bg-blue-900/40 disabled:opacity-40 transition-colors"
                >
                    -
                </button>
                <button
                    onClick={() => handleUpdate(glasses + 1)}
                    disabled={glasses >= 20 || isUpdating}
                    className="flex-1 py-2 rounded-lg bg-blue-500 text-white font-bold hover:bg-blue-600 disabled:opacity-40 transition-colors"
                >
                    + Add Glass
                </button>
            </div>

            {percent >= 100 && (
                <p className="text-center text-green-600 font-semibold text-sm mt-2">
                    🎉 Daily goal reached!
                </p>
            )}
        </div>
    )
}