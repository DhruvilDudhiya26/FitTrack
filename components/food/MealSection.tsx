import Link from 'next/link'
import { FoodLogItem } from './FoodLogItem'

interface MealSectionProps {
    mealType: 'breakfast' | 'lunch' | 'dinner' | 'snack'
    logs: any[]
}

const MEAL_ICONS: Record<string, string> = {
    breakfast: '🌅',
    lunch: '🌞',
    dinner: '🌙',
    snack: '🍎',
}

const MEAL_COLORS: Record<string, string> = {
    breakfast: 'from-orange-50 to-yellow-50 border-orange-200',
    lunch: 'from-blue-50 to-cyan-50 border-blue-200',
    dinner: 'from-purple-50 to-indigo-50 border-purple-200',
    snack: 'from-green-50 to-emerald-50 border-green-200',
}

export function MealSection({ mealType, logs }: MealSectionProps) {
    const icon = MEAL_ICONS[mealType]
    const colorClass = MEAL_COLORS[mealType]

    // Calculate meal totals
    const mealTotals = logs.reduce(
        (acc, log) => {
            if (log.food) {
                acc.calories += log.food.calories * log.servings
                acc.protein += log.food.protein * log.servings
                acc.carbs += log.food.carbs * log.servings
                acc.fats += log.food.fats * log.servings
            }
            return acc
        },
        { calories: 0, protein: 0, carbs: 0, fats: 0 }
    )

    const roundedTotals = {
        calories: Math.round(mealTotals.calories),
        protein: Math.round(mealTotals.protein),
        carbs: Math.round(mealTotals.carbs),
        fats: Math.round(mealTotals.fats),
    }

    return (
        <div className={`rounded-2xl border-2 bg-gradient-to-br ${colorClass} overflow-hidden`}>
            {/* Meal Header */}
            <div className="px-4 py-3 flex justify-between items-center">
                <div className="flex items-center gap-2">
                    <span className="text-2xl">{icon}</span>
                    <div>
                        <h3 className="font-bold text-gray-900 capitalize">{mealType}</h3>
                        {logs.length > 0 && (
                            <p className="text-xs text-gray-600">
                                {roundedTotals.calories} cal • P:{roundedTotals.protein}g • C:{roundedTotals.carbs}g • F:{roundedTotals.fats}g
                            </p>
                        )}
                    </div>
                </div>
                <Link
                    href={`/food/add?meal=${mealType}`}
                    className="text-sm font-semibold text-green-600 hover:text-green-700 bg-white px-3 py-1 rounded-lg border border-green-200 hover:border-green-300 transition-colors"
                >
                    + Add
                </Link>
            </div>

            {/* Food Items */}
            <div className="px-4 pb-4 space-y-2">
                {logs.length === 0 ? (
                    <div className="text-center py-4">
                        <p className="text-sm text-gray-500">Nothing logged yet</p>
                        <Link
                            href={`/food/add?meal=${mealType}`}
                            className="text-sm text-green-600 hover:text-green-700 font-medium"
                        >
                            + Add {mealType}
                        </Link>
                    </div>
                ) : (
                    logs.map((log) => (
                        <FoodLogItem key={log._id} log={log} />
                    ))
                )}
            </div>
        </div>
    )
}