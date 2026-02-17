'use server'

import dbConnect from '@/lib/mongodb'
import FoodLog from '@/models/FoodLog'
import { Types } from 'mongoose'
import { revalidatePath } from 'next/cache'

export async function deleteFoodLog(logId: string) {
    try {
        await dbConnect()

        await FoodLog.findByIdAndDelete(new Types.ObjectId(logId))

        revalidatePath('/dashboard')
        revalidatePath('/food/logs')

        return { success: true }
    } catch (error) {
        console.error('Error deleting food log:', error)
        return { success: false, error: 'Failed to delete entry' }
    }
}