'use server'

import dbConnect from '@/lib/mongodb'
import WeightLog from '@/models/WeightLog'
import { Types } from 'mongoose'
import { revalidatePath } from 'next/cache'

export async function deleteWeightLog(logId: string) {
    try {
        await dbConnect()

        await WeightLog.findByIdAndDelete(new Types.ObjectId(logId))

        revalidatePath('/progress')

        return {
            success: true,
        }
    } catch (error) {
        console.error('Error deleting weight log:', error)
        return {
            success: false,
            error: 'Failed to delete weight log',
        }
    }
}