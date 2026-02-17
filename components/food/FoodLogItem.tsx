'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { deleteFoodLog } from '@/server/actions/food/delete-log'
import { updateFoodLog } from '@/server/actions/food/update-log'

interface FoodLogItemProps {
    log: {
        _id: string
        servings: number
        mealType: string
        food: {
            name: string
            brand?: string
            calories: number
            protein: number
            carbs: number
            fats: number
            servingSize: number
            servingUnit: string
        }
    }
}

export function FoodLogItem({ log }: FoodLogItemProps) {
    const router = useRouter()
    const [isEditing, setIsEditing] = useState(false)
    const [servings, setServings] = useState(log.servings.toString())
    const [isDeleting, setIsDeleting] = useState(false)
    const [isSaving, setIsSaving] = useState(false)

    const totalCalories = Math.round(log.food.calories * log.servings)
    const totalProtein = Math.round(log.food.protein * log.servings)
    const totalCarbs = Math.round(log.food.carbs * log.servings)
    const totalFats = Math.round(log.food.fats * log.servings)

    const handleDelete = async () => {
        if (!confirm(`Remove ${log.food.name} from your log?`)) return

        setIsDeleting(true)
        const result = await deleteFoodLog(log._id)
        setIsDeleting(false)

        if (result.success) {
            router.refresh()
        } else {
            alert(result.error || 'Failed to delete')
        }
    }

    const handleSave = async () => {
        const newServings = parseFloat(servings)

        if (isNaN(newServings) || newServings <= 0) {
            alert('Please enter a valid serving amount')
            return
        }

        setIsSaving(true)
        const result = await updateFoodLog(log._id, newServings)
        setIsSaving(false)

        if (result.success) {
            setIsEditing(false)
            router.refresh()
        } else {
            alert(result.error || 'Failed to update')
        }
    }

    return (
        <div className="bg-white rounded-xl p-4 border border-gray-200 hover:border-gray-300 transition-colors">
            <div className="flex justify-between items-start gap-3">
                {/* Food Info */}
                <div className="flex-1 min-w-0">
                    <p className="font-semibold text-gray-900 truncate">{log.food.name}</p>
                    {log.food.brand && (
                        <p className="text-xs text-gray-500">{log.food.brand}</p>
                    )}

                    {/* Servings */}
                    {isEditing ? (
                        <div className="flex items-center gap-2 mt-2">
                            <Input
                                type="number"
                                step="0.5"
                                min="0.5"
                                value={servings}
                                onChange={(e) => setServings(e.target.value)}
                                className="w-20 h-8 text-sm"
                                autoFocus
                            />
                            <span className="text-xs text-gray-500">
                                × {log.food.servingSize}{log.food.servingUnit}
                            </span>
                            <Button
                                size="sm"
                                onClick={handleSave}
                                disabled={isSaving}
                                className="h-8 text-xs bg-green-600 hover:bg-green-700"
                            >
                                {isSaving ? '...' : 'Save'}
                            </Button>
                            <Button
                                size="sm"
                                variant="outline"
                                onClick={() => {
                                    setIsEditing(false)
                                    setServings(log.servings.toString())
                                }}
                                className="h-8 text-xs"
                            >
                                Cancel
                            </Button>
                        </div>
                    ) : (
                        <button
                            onClick={() => setIsEditing(true)}
                            className="text-sm text-gray-500 hover:text-green-600 mt-1 transition-colors"
                        >
                            {log.servings} serving{log.servings !== 1 ? 's' : ''} ×{' '}
                            {log.food.servingSize}{log.food.servingUnit}{' '}
                            <span className="text-xs text-green-600">(edit)</span>
                        </button>
                    )}

                    {/* Macros */}
                    <div className="flex gap-3 mt-2 text-xs">
                        <span className="text-gray-600">
                            <span className="font-semibold text-gray-900">{totalCalories}</span> cal
                        </span>
                        <span className="text-green-600">
                            <span className="font-semibold">{totalProtein}g</span> P
                        </span>
                        <span className="text-blue-600">
                            <span className="font-semibold">{totalCarbs}g</span> C
                        </span>
                        <span className="text-orange-600">
                            <span className="font-semibold">{totalFats}g</span> F
                        </span>
                    </div>
                </div>

                {/* Delete Button */}
                <button
                    onClick={handleDelete}
                    disabled={isDeleting}
                    className="text-gray-400 hover:text-red-500 transition-colors p-1 flex-shrink-0"
                    title="Remove from log"
                >
                    {isDeleting ? '...' : '🗑️'}
                </button>
            </div>
        </div>
    )
}