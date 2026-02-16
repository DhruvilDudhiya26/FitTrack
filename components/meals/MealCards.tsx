import { Card } from '@/components/ui/card'

interface Meal {
    name: string
    description: string
    calories: number
    protein: number
    carbs: number
    fats: number
    ingredients?: string[]
    instructions?: string[]
}

interface MealCardProps {
    meal: Meal
    mealType: string
}

export function MealCard({ meal, mealType }: MealCardProps) {
    return (
        <Card className="p-4">
            <div className="mb-3">
                <div className="flex justify-between items-start mb-2">
                    <div>
                        <h4 className="font-semibold text-gray-900">{meal.name}</h4>
                        <p className="text-sm text-gray-600 mt-1">{meal.description}</p>
                    </div>
                </div>

                {/* Macros */}
                <div className="flex gap-4 mt-3 text-sm">
                    <div>
                        <span className="text-gray-600">Calories:</span>
                        <span className="font-semibold text-gray-900 ml-1">{meal.calories}</span>
                    </div>
                    <div>
                        <span className="text-gray-600">P:</span>
                        <span className="font-semibold text-green-600 ml-1">{meal.protein}g</span>
                    </div>
                    <div>
                        <span className="text-gray-600">C:</span>
                        <span className="font-semibold text-blue-600 ml-1">{meal.carbs}g</span>
                    </div>
                    <div>
                        <span className="text-gray-600">F:</span>
                        <span className="font-semibold text-orange-600 ml-1">{meal.fats}g</span>
                    </div>
                </div>
            </div>

            {/* Expandable details */}
            <details className="mt-3">
                <summary className="cursor-pointer text-sm text-green-600 font-medium hover:text-green-700">
                    View Details
                </summary>
                <div className="mt-3 space-y-3">
                    {meal.ingredients && meal.ingredients.length > 0 && (
                        <div>
                            <h5 className="font-semibold text-gray-900 text-sm mb-2">Ingredients:</h5>
                            <ul className="text-sm text-gray-700 space-y-1">
                                {meal.ingredients.map((ingredient, idx) => (
                                    <li key={idx} className="flex items-start">
                                        <span className="text-green-600 mr-2">•</span>
                                        {ingredient}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}

                    {meal.instructions && meal.instructions.length > 0 && (
                        <div>
                            <h5 className="font-semibold text-gray-900 text-sm mb-2">Instructions:</h5>
                            <ol className="text-sm text-gray-700 space-y-1">
                                {meal.instructions.map((instruction, idx) => (
                                    <li key={idx} className="flex items-start">
                                        <span className="font-semibold text-green-600 mr-2">{idx + 1}.</span>
                                        {instruction}
                                    </li>
                                ))}
                            </ol>
                        </div>
                    )}
                </div>
            </details>
        </Card>
    )
}