'use client'

import { useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useUser } from '@/hooks/use-user'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card } from '@/components/ui/card'
import { searchFood } from '@/server/actions/food/search-food'
import { logFood } from '@/server/actions/food/log-food'

interface Food {
    _id: string
    name: string
    brand?: string
    servingSize: number
    servingUnit: string
    calories: number
    protein: number
    carbs: number
    fats: number
}

export default function AddFoodPage() {
    const router = useRouter()
    const searchParams = useSearchParams()
    const mealType = searchParams.get('meal') || 'breakfast'
    const { user } = useUser()

    const [searchQuery, setSearchQuery] = useState('')
    const [foods, setFoods] = useState<Food[]>([])
    const [isSearching, setIsSearching] = useState(false)
    const [selectedFood, setSelectedFood] = useState<Food | null>(null)
    const [servings, setServings] = useState('1')
    const [isLogging, setIsLogging] = useState(false)

    const handleSearch = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!searchQuery.trim()) return

        setIsSearching(true)
        const result = await searchFood(searchQuery)
        setIsSearching(false)

        if (result.success) {
            setFoods(result.foods)
        }
    }

    const handleSelectFood = (food: Food) => {
        setSelectedFood(food)
    }

    const handleLogFood = async () => {
        if (!selectedFood || !user?.id) return

        setIsLogging(true)

        const result = await logFood({
            userId: user.id,
            foodId: selectedFood._id,
            servings: parseFloat(servings),
            mealType: mealType as 'breakfast' | 'lunch' | 'dinner' | 'snack',
        })

        setIsLogging(false)

        if (result.success) {
            router.push('/dashboard')
            router.refresh()
        }
    }

    const calculatedNutrition = selectedFood && {
        calories: Math.round(selectedFood.calories * parseFloat(servings || '1')),
        protein: Math.round(selectedFood.protein * parseFloat(servings || '1')),
        carbs: Math.round(selectedFood.carbs * parseFloat(servings || '1')),
        fats: Math.round(selectedFood.fats * parseFloat(servings || '1')),
    }

    return (
        <div className="max-w-2xl mx-auto space-y-6">
            {/* Header */}
            <div className="flex items-center gap-4">
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => router.back()}
                >
                    ← Back
                </Button>
                <div>
                    <h2 className="text-2xl font-bold text-gray-900">Add Food</h2>
                    <p className="text-sm text-gray-600 capitalize">{mealType}</p>
                </div>
            </div>

            {/* Search */}
            <Card className="p-6">
                <form onSubmit={handleSearch} className="space-y-4">
                    <div>
                        <Input
                            type="text"
                            placeholder="Search for food... (e.g., chicken, rice, banana)"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="text-lg"
                        />
                    </div>
                    <Button type="submit" disabled={isSearching} className="w-full">
                        {isSearching ? 'Searching...' : 'Search'}
                    </Button>
                </form>
            </Card>

            {/* Search Results */}
            {foods.length > 0 && !selectedFood && (
                <div className="space-y-2">
                    <h3 className="font-semibold text-gray-900">Results ({foods.length})</h3>
                    {foods.map((food) => (
                        <Card
                            key={food._id}
                            className="p-4 cursor-pointer hover:border-green-500 transition-colors"
                            onClick={() => handleSelectFood(food)}
                        >
                            <div className="flex justify-between items-start">
                                <div>
                                    <h4 className="font-semibold text-gray-900">{food.name}</h4>
                                    {food.brand && (
                                        <p className="text-sm text-gray-600">{food.brand}</p>
                                    )}
                                    <p className="text-xs text-gray-500 mt-1">
                                        Per {food.servingSize}{food.servingUnit}
                                    </p>
                                </div>
                                <div className="text-right">
                                    <p className="font-semibold text-gray-900">{food.calories} cal</p>
                                    <p className="text-xs text-gray-600">
                                        P: {food.protein}g | C: {food.carbs}g | F: {food.fats}g
                                    </p>
                                </div>
                            </div>
                        </Card>
                    ))}
                </div>
            )}

            {/* Selected Food - Servings */}
            {selectedFood && (
                <Card className="p-6 space-y-6">
                    <div>
                        <div className="flex justify-between items-start mb-4">
                            <div>
                                <h3 className="text-xl font-bold text-gray-900">{selectedFood.name}</h3>
                                {selectedFood.brand && (
                                    <p className="text-sm text-gray-600">{selectedFood.brand}</p>
                                )}
                            </div>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setSelectedFood(null)}
                            >
                                Change
                            </Button>
                        </div>

                        {/* Servings */}
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700">
                                Number of Servings
                            </label>
                            <div className="flex gap-2 items-center">
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => setServings((parseFloat(servings) - 0.5).toString())}
                                    disabled={parseFloat(servings) <= 0.5}
                                >
                                    -
                                </Button>
                                <Input
                                    type="number"
                                    step="0.5"
                                    min="0.5"
                                    value={servings}
                                    onChange={(e) => setServings(e.target.value)}
                                    className="text-center text-lg font-semibold w-24"
                                />
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => setServings((parseFloat(servings) + 0.5).toString())}
                                >
                                    +
                                </Button>
                                <span className="text-sm text-gray-600 ml-2">
                                    × {selectedFood.servingSize}{selectedFood.servingUnit}
                                </span>
                            </div>
                        </div>

                        {/* Nutrition Summary */}
                        {calculatedNutrition && (
                            <div className="bg-green-50 rounded-lg p-4 mt-4">
                                <h4 className="font-semibold text-gray-900 mb-3">Nutrition</h4>
                                <div className="grid grid-cols-4 gap-4 text-center">
                                    <div>
                                        <p className="text-2xl font-bold text-gray-900">
                                            {calculatedNutrition.calories}
                                        </p>
                                        <p className="text-xs text-gray-600">Calories</p>
                                    </div>
                                    <div>
                                        <p className="text-2xl font-bold text-green-600">
                                            {calculatedNutrition.protein}g
                                        </p>
                                        <p className="text-xs text-gray-600">Protein</p>
                                    </div>
                                    <div>
                                        <p className="text-2xl font-bold text-blue-600">
                                            {calculatedNutrition.carbs}g
                                        </p>
                                        <p className="text-xs text-gray-600">Carbs</p>
                                    </div>
                                    <div>
                                        <p className="text-2xl font-bold text-orange-600">
                                            {calculatedNutrition.fats}g
                                        </p>
                                        <p className="text-xs text-gray-600">Fats</p>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    <Button
                        onClick={handleLogFood}
                        disabled={isLogging}
                        className="w-full bg-green-600 hover:bg-green-700"
                    >
                        {isLogging ? 'Adding...' : `Add to ${mealType}`}
                    </Button>
                </Card>
            )}
        </div>
    )
}