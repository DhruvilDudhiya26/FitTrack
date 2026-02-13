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
            <h3 className="font-bold text-gray-800 mb-3">Today's Meals</h3>
            <div className="space-y-2">
                {mealTypes.map((type) => {
                    const meal = meals.find((m) => m.type.toLowerCase() === type)

                    if (meal) {
                        return (
                            <div
                                key={type}
                                className="p-4 bg-gray-50 rounded-lg flex justify-between items-center"
                            >
                                <div>
                                    <p className="font-semibold text-gray-800 capitalize">{type}</p>
                                    <p className="text-sm text-gray-600">
                                        {meal.calories} cal • {meal.items} items
                                    </p>
                                </div>
                                <span className="text-green-600 text-xl">✓</span>
                            </div>
                        )
                    }

                    return (
                        <div
                            key={type}
                            className="p-4 border-2 border-dashed border-gray-300 rounded-lg text-center text-gray-500 hover:border-green-500 hover:text-green-600 cursor-pointer transition-colors"
                        >
                            + Add {type.charAt(0).toUpperCase() + type.slice(1)}
                        </div>
                    )
                })}
            </div>
        </div>
    )
}