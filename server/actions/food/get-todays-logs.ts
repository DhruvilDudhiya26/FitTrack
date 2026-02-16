'use server'

import dbConnect from '@/lib/mongodb'
import FoodLog from '@/models/FoodLog'
import { Types } from 'mongoose'
import { startOfDay, endOfDay } from 'date-fns'

export async function getTodaysFoodLogs(userId: string) {
    try {
        await dbConnect()

        const today = new Date()
        const startDate = startOfDay(today)
        const endDate = endOfDay(today)

        const foodLogs = await FoodLog.find({
            userId: new Types.ObjectId(userId),
            loggedAt: {
                $gte: startDate,
                $lte: endDate,
            },
        })
            .populate('foodId')
            .sort({ loggedAt: -1 })
            .lean()

        // Calculate totals
        let totalCalories = 0
        let totalProtein = 0
        let totalCarbs = 0
        let totalFats = 0

        foodLogs.forEach((log: any) => {
            const food = log.foodId
            if (food) {
                totalCalories += food.calories * log.servings
                totalProtein += food.protein * log.servings
                totalCarbs += food.carbs * log.servings
                totalFats += food.fats * log.servings
            }
        })

        return {
            success: true,
            logs: JSON.parse(JSON.stringify(foodLogs)),
            totals: {
                calories: Math.round(totalCalories),
                protein: Math.round(totalProtein),
                carbs: Math.round(totalCarbs),
                fats: Math.round(totalFats),
            },
        }
    } catch (error) {
        console.error('Error getting food logs:', error)
        return {
            success: false,
            error: 'Failed to get food logs',
        }
    }
}