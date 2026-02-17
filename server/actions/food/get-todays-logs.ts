'use server'

import dbConnect from '@/lib/mongodb'
import FoodLog from '@/models/FoodLog'
import Food from '@/models/Food'
import { Types } from 'mongoose'
import { startOfDay, endOfDay } from 'date-fns'

export async function getTodaysLogs(userId: string) {
    try {
        await dbConnect()

        const today = new Date()

        const foodLogs = await FoodLog.find({
            userId: new Types.ObjectId(userId),
            loggedAt: {
                $gte: startOfDay(today),
                $lte: endOfDay(today),
            },
        })
            .sort({ loggedAt: 1 })
            .lean()

        const logsWithFood = await Promise.all(
            foodLogs.map(async (log) => {
                const food = await Food.findById(log.foodId).lean()
                return { ...log, food }
            })
        )

        let totalCalories = 0
        let totalProtein = 0
        let totalCarbs = 0
        let totalFats = 0

        logsWithFood.forEach((log) => {
            if (log.food) {
                totalCalories += log.food.calories * log.servings
                totalProtein += log.food.protein * log.servings
                totalCarbs += log.food.carbs * log.servings
                totalFats += log.food.fats * log.servings
            }
        })

        return {
            success: true,
            logs: JSON.parse(JSON.stringify(logsWithFood)),
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
            logs: [],
            totals: { calories: 0, protein: 0, carbs: 0, fats: 0 },
        }
    }
}