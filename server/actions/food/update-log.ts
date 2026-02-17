'use server'

import dbConnect from '@/lib/mongodb'
import FoodLog from '@/models/FoodLog'
import { Types } from 'mongoose'
import { revalidatePath } from 'next/cache'

export async function updateFoodLog(logId: string, servings: number) {
    try {
        await dbConnect()

        if (servings <= 0) {
            return { success: false, error: 'Servings must be greater than 0' }
        }

        await FoodLog.findByIdAndUpdate(
            new Types.ObjectId(logId),
            { servings },
            { new: true }
        )

        revalidatePath('/dashboard')
        revalidatePath('/food/logs')

        return { success: true }
    } catch (error) {
        console.error('Error updating food log:', error)
        return { success: false, error: 'Failed to update entry' }
    }
}