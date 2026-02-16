interface StatsCardsProps {
    currentWeight: number
    startWeight: number
    targetWeight: number
    weightLogs: any[]
}

export function StatsCards({ currentWeight, startWeight, targetWeight, weightLogs }: StatsCardsProps) {
    const weightChange = currentWeight - startWeight
    const remainingWeight = currentWeight - targetWeight
    const progressPercent = Math.round(((startWeight - currentWeight) / (startWeight - targetWeight)) * 100)

    // Calculate average weekly change
    let avgWeeklyChange = 0
    if (weightLogs.length >= 2) {
        const firstLog = weightLogs[0]
        const lastLog = weightLogs[weightLogs.length - 1]
        const daysDiff = Math.max(1, Math.floor((new Date(lastLog.loggedAt).getTime() - new Date(firstLog.loggedAt).getTime()) / (1000 * 60 * 60 * 24)))
        const weeksDiff = daysDiff / 7
        avgWeeklyChange = (lastLog.weight - firstLog.weight) / Math.max(1, weeksDiff)
    }

    // Estimate weeks to goal
    let weeksToGoal = 0
    if (avgWeeklyChange !== 0 && Math.sign(avgWeeklyChange) === Math.sign(targetWeight - currentWeight)) {
        weeksToGoal = Math.abs(remainingWeight / avgWeeklyChange)
    }

    return (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-4 border-2 border-green-200">
                <p className="text-sm text-gray-600 mb-1">Current Weight</p>
                <p className="text-3xl font-bold text-gray-900">{currentWeight}</p>
                <p className="text-xs text-gray-600 mt-1">kg</p>
            </div>

            <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-4 border-2 border-blue-200">
                <p className="text-sm text-gray-600 mb-1">Weight Change</p>
                <p className={`text-3xl font-bold ${weightChange < 0 ? 'text-green-600' : 'text-orange-600'}`}>
                    {weightChange > 0 ? '+' : ''}{weightChange.toFixed(1)}
                </p>
                <p className="text-xs text-gray-600 mt-1">kg</p>
            </div>

            <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-4 border-2 border-purple-200">
                <p className="text-sm text-gray-600 mb-1">To Goal</p>
                <p className="text-3xl font-bold text-gray-900">{Math.abs(remainingWeight).toFixed(1)}</p>
                <p className="text-xs text-gray-600 mt-1">kg remaining</p>
            </div>

            <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl p-4 border-2 border-orange-200">
                <p className="text-sm text-gray-600 mb-1">Progress</p>
                <p className="text-3xl font-bold text-gray-900">{Math.max(0, progressPercent)}</p>
                <p className="text-xs text-gray-600 mt-1">% to goal</p>
            </div>
        </div>
    )
}