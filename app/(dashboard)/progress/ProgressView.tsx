'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { WeightChart } from '@/components/progress/WeightChart'
import { StatsCards } from '@/components/progress/StatsCards'
import { WeightHistory } from '@/components/progress/WeightHistory'
import { LogWeightModal } from '@/components/progress/LogWeightModal'

interface ProgressViewProps {
    userId: string
    profile: any
    weightLogs: any[]
}

export function ProgressView({ userId, profile, weightLogs }: ProgressViewProps) {
    const [showLogModal, setShowLogModal] = useState(false)

    const currentWeight = weightLogs.length > 0
        ? weightLogs[weightLogs.length - 1].weight
        : profile.currentWeight

    const startWeight = profile.currentWeight
    const targetWeight = profile.targetWeight

    return (
        <div className="max-w-6xl mx-auto space-y-6">
            {/* Header */}
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-2xl font-bold text-gray-900">Progress</h2>
                    <p className="text-sm text-gray-600">Track your fitness journey</p>
                </div>
                <Button
                    onClick={() => setShowLogModal(true)}
                    className="bg-green-600 hover:bg-green-700"
                >
                    + Log Weight
                </Button>
            </div>

            {/* Stats Cards */}
            <StatsCards
                currentWeight={currentWeight}
                startWeight={startWeight}
                targetWeight={targetWeight}
                weightLogs={weightLogs}
            />

            {/* Weight Chart */}
            <WeightChart logs={weightLogs} targetWeight={targetWeight} />

            {/* AI Insights */}
            {weightLogs.length >= 3 && (
                <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-6 border-2 border-purple-200">
                    <div className="flex items-start gap-3">
                        <span className="text-2xl">✨</span>
                        <div>
                            <h4 className="font-semibold text-gray-900 mb-1">Progress Insight</h4>
                            <p className="text-sm text-gray-700">
                                {currentWeight < startWeight
                                    ? `Great job! You've lost ${(startWeight - currentWeight).toFixed(1)}kg so far. Keep up the consistency!`
                                    : currentWeight > startWeight
                                        ? `You've gained ${(currentWeight - startWeight).toFixed(1)}kg. ${profile.goalType === 'gain_muscle' ? 'Perfect for muscle building!' : 'Stay focused on your calorie deficit.'}`
                                        : 'Your weight is stable. Keep tracking to maintain consistency!'}
                            </p>
                        </div>
                    </div>
                </div>
            )}

            {/* Weight History */}
            <div className="bg-white rounded-xl p-6 shadow-sm">
                <h3 className="font-bold text-gray-900 mb-4">Recent Logs</h3>
                <WeightHistory logs={weightLogs.slice().reverse()} />
            </div>

            {/* Log Weight Modal */}
            {showLogModal && (
                <LogWeightModal
                    userId={userId}
                    onClose={() => setShowLogModal(false)}
                />
            )}
        </div>
    )
}