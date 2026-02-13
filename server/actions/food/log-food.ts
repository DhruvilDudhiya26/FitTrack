'use server'

import dbConnect from '@/lib/mongodb'
import FoodLog from '@/models/FoodLog'
import { Types } from 'mongoose'
import { revalidatePath } from 'next/cache'

interface LogFoodData {
    userId: string
    foodId: string
    servings: number
    mealType: 'breakfast' | 'lunch' | 'dinner' | 'snack'
}

export async function logFood(data: LogFoodData) {
    try {
        await dbConnect()

        const foodLog = await FoodLog.create({
            userId: new Types.ObjectId(data.userId),
            foodId: new Types.ObjectId(data.foodId),
            servings: data.servings,
            mealType: data.mealType,
        })

        revalidatePath('/dashboard')

        return {
            success: true,
            foodLog: JSON.parse(JSON.stringify(foodLog)),
        }
    } catch (error) {
        console.error('Error logging food:', error)
        return {
            success: false,
            error: 'Failed to log food',
        }
    }
}