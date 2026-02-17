import Link from 'next/link'

interface Meal {
    id: string
    type: string
    items: number
    calories: number
}

interface TodaysMealsProps {
    meals: Meal[]
}

export function TodaysMeals({ meals }: TodaysMealsProps) {
    const mealTypes = ['breakfast', 'lunch', 'dinner', 'snack']

    return (
        <div>
            <div className="flex justify-between items-center mb-3">
                <h3 className="font-bold text-gray-800">Today's Meals</h3>
                <Link href="/food/logs" className="text-sm text-green-600 hover:text-green-700 font-medium">
                    View All →
                </Link>
            </div>
            <div className="space-y-2">
                {mealTypes.map((type) => {
                    const meal = meals.find((m) => m.type.toLowerCase() === type)

                    if (meal) {
                        return (
                            <Link
                                key={type}
                                href="/food/logs"
                                className="block p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                            >
                                <div className="flex justify-between items-center">
                                    <div>
                                        <p className="font-semibold text-gray-800 capitalize">{type}</p>
                                        <p className="text-sm text-gray-600">
                                            {meal.calories} cal • {meal.items} {meal.items === 1 ? 'item' : 'items'}
                                        </p>
                                    </div>
                                    <span className="text-green-600 text-xl">✓</span>
                                </div>
                            </Link>
                        )
                    }

                    return (
                        <Link
                            key={type}
                            href={`/food/add?meal=${type}`}
                            className="block p-4 border-2 border-dashed border-gray-300 rounded-lg text-center text-gray-500 hover:border-green-500 hover:text-green-600 cursor-pointer transition-colors"
                        >
                            + Add {type.charAt(0).toUpperCase() + type.slice(1)}
                        </Link>
                    )
                })}
            </div>
        </div>
    )
}