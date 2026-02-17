interface DailyTotalsBarProps {
    totals: {
        calories: number
        protein: number
        carbs: number
        fats: number
    }
    targets: {
        calories: number
        protein: number
        carbs: number
        fats: number
    }
}

export function DailyTotalsBar({ totals, targets }: DailyTotalsBarProps) {
    const getPercent = (current: number, target: number) =>
        Math.min(Math.round((current / target) * 100), 100)

    const getColor = (percent: number) => {
        if (percent >= 100) return 'bg-green-500'
        if (percent >= 75) return 'bg-blue-500'
        if (percent >= 50) return 'bg-yellow-500'
        return 'bg-gray-300'
    }

    return (
        <div className="bg-white rounded-2xl p-5 shadow-sm space-y-4">
            <h3 className="font-bold text-gray-900">Daily Summary</h3>

            {/* Calories */}
            <div>
                <div className="flex justify-between text-sm mb-1">
                    <span className="font-semibold text-gray-900">Calories</span>
                    <span className="text-gray-600">
                        {totals.calories} / {targets.calories} kcal
                    </span>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-3">
                    <div
                        className={`h-3 rounded-full transition-all ${getColor(getPercent(totals.calories, targets.calories))}`}
                        style={{ width: `${getPercent(totals.calories, targets.calories)}%` }}
                    />
                </div>
                <p className="text-xs text-gray-500 mt-1">
                    {Math.max(0, targets.calories - totals.calories)} calories remaining
                </p>
            </div>

            {/* Macros Grid */}
            <div className="grid grid-cols-3 gap-3">
                {[
                    { label: 'Protein', current: totals.protein, target: targets.protein, color: 'bg-green-500', unit: 'g' },
                    { label: 'Carbs', current: totals.carbs, target: targets.carbs, color: 'bg-blue-500', unit: 'g' },
                    { label: 'Fats', current: totals.fats, target: targets.fats, color: 'bg-orange-500', unit: 'g' },
                ].map((macro) => {
                    const percent = getPercent(macro.current, macro.target)
                    return (
                        <div key={macro.label} className="text-center">
                            <div className="relative w-14 h-14 mx-auto mb-1">
                                <svg className="transform -rotate-90 w-14 h-14">
                                    <circle cx="28" cy="28" r="22" stroke="#e5e7eb" strokeWidth="5" fill="transparent" />
                                    <circle
                                        cx="28"
                                        cy="28"
                                        r="22"
                                        stroke={macro.color.replace('bg-', '').includes('green') ? '#10b981' : macro.color.includes('blue') ? '#3b82f6' : '#f97316'}
                                        strokeWidth="5"
                                        fill="transparent"
                                        strokeDasharray={`${2 * Math.PI * 22}`}
                                        strokeDashoffset={`${2 * Math.PI * 22 * (1 - percent / 100)}`}
                                        strokeLinecap="round"
                                    />
                                </svg>
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <span className="text-xs font-bold text-gray-900">{percent}%</span>
                                </div>
                            </div>
                            <p className="text-xs font-semibold text-gray-900">
                                {macro.current}{macro.unit}
                            </p>
                            <p className="text-xs text-gray-500">{macro.label}</p>
                            <p className="text-xs text-gray-400">/ {macro.target}{macro.unit}</p>
                        </div>
                    )
                })}
            </div>
        </div>
    )
}