'use server'

import dbConnect from '@/lib/mongodb'
import WaterLog from '@/models/WaterLog'
import { Types } from 'mongoose'
import { format } from 'date-fns'
import { revalidatePath } from 'next/cache'

export async function logWater(userId: string, glasses: number) {
    try {
        await dbConnect()

        const today = format(new Date(), 'yyyy-MM-dd')

        // Upsert: create or update today's water log
        await WaterLog.findOneAndUpdate(
            { userId: new Types.ObjectId(userId), date: today },
            { glasses: Math.max(0, Math.min(20, glasses)) },
            { upsert: true, new: true }
        )

        revalidatePath('/dashboard')

        return { success: true }
    } catch (error) {
        console.error('Error logging water:', error)
        return { success: false, error: 'Failed to log water' }
    }
}

export async function getTodaysWater(userId?: string) {
    try {
        await dbConnect()

        const today = format(new Date(), 'yyyy-MM-dd')

        const waterLog = await WaterLog.findOne({
            userId: new Types.ObjectId(userId),
            date: today,
        }).lean()

        return {
            success: true,
            glasses: waterLog ? waterLog.glasses : 0,
        }
    } catch (error) {
        return { success: true, glasses: 0 }
    }
}