interface CalorieProgressProps {
    current: number
    target: number
}

export function CalorieProgress({ current, target }: CalorieProgressProps) {
    const percentage = Math.min(Math.round((current / target) * 100), 100)
    const remaining = Math.max(target - current, 0)

    return (
        <div className="bg-gradient-to-br from-green-500 to-blue-500 rounded-2xl p-6 text-white">
            <div className="flex items-center justify-between mb-4">
                <div>
                    <p className="text-sm opacity-90">Calories</p>
                    <p className="text-3xl font-bold">
                        {current.toLocaleString()}
                        <span className="text-xl font-normal opacity-90"> / {target.toLocaleString()}</span>
                    </p>
                </div>
                <div className="relative w-24 h-24">
                    {/* Simple circular progress */}
                    <svg className="transform -rotate-90 w-24 h-24">
                        <circle
                            cx="48"
                            cy="48"
                            r="40"
                            stroke="currentColor"
                            strokeWidth="8"
                            fill="transparent"
                            className="text-white/30"
                        />
                        <circle
                            cx="48"
                            cy="48"
                            r="40"
                            stroke="currentColor"
                            strokeWidth="8"
                            fill="transparent"
                            strokeDasharray={`${2 * Math.PI * 40}`}
                            strokeDashoffset={`${2 * Math.PI * 40 * (1 - percentage / 100)}`}
                            className="text-white"
                            strokeLinecap="round"
                        />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-2xl font-bold">{percentage}%</span>
                    </div>
                </div>
            </div>
            <p className="text-sm opacity-90">
                {remaining > 0 ? `${remaining} calories remaining` : 'Goal reached! 🎉'}
            </p>
        </div>
    )
}