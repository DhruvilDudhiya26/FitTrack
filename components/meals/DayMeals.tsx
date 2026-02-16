
import { Button } from '@/components/ui/button'
import { MealCard } from './MealCards'

interface DayMealsProps {
    day: any
    onRegenerate: () => void
    isRegenerating: boolean
}

export function DayMeals({ day, onRegenerate, isRegenerating }: DayMealsProps) {
    return (
        <div className="space-y-4">
            {/* Day Header */}
            <div className="flex justify-between items-center">
                <div>
                    <h3 className="text-xl font-bold text-gray-900">{day.day}</h3>
                    <p className="text-sm text-gray-600 mt-1">
                        Total: {day.totalCalories} cal | P: {day.totalProtein}g | C: {day.totalCarbs}g | F: {day.totalFats}g
                    </p>
                </div>
                <Button
                    variant="outline"
                    size="sm"
                    onClick={onRegenerate}
                    disabled={isRegenerating}
                >
                    {isRegenerating ? '⏳ Generating...' : '🔄 Regenerate'}
                </Button>
            </div>

            {/* Meals */}
            <div className="space-y-4">
                <div>
                    <h4 className="text-sm font-semibold text-gray-700 mb-2">🌅 BREAKFAST</h4>
                    <MealCard meal={day.breakfast} mealType="breakfast" />
                </div>

                <div>
                    <h4 className="text-sm font-semibold text-gray-700 mb-2">🌞 LUNCH</h4>
                    <MealCard meal={day.lunch} mealType="lunch" />
                </div>

                <div>
                    <h4 className="text-sm font-semibold text-gray-700 mb-2">🌙 DINNER</h4>
                    <MealCard meal={day.dinner} mealType="dinner" />
                </div>

                {day.snacks && day.snacks.length > 0 && (
                    <div>
                        <h4 className="text-sm font-semibold text-gray-700 mb-2">🍎 SNACKS</h4>
                        <div className="space-y-2">
                            {day.snacks.map((snack: any, idx: number) => (
                                <MealCard key={idx} meal={snack} mealType="snack" />
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}