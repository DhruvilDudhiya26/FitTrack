'use server'

import dbConnect from "@/lib/mongodb"
import WeightLog from "@/models/WeightLog"
import { Types } from "mongoose"
import { revalidatePath } from "next/cache"

interface LogWeightData {
    userId: string
    weight: number
    note?: string
}


export async function logWeight(data: LogWeightData) {
    try {
        await dbConnect();

        const weightLog = await WeightLog.create({
            userId: new Types.ObjectId(data.userId),
            weight: data.weight,
            note: data.note
        })

        revalidatePath("/progress")

        return {
            success: true,
            weightLog: JSON.parse(JSON.stringify(weightLog))
        }

    } catch (error) {
        console.error('Error logging weight:', error)
        return {
            success: false,
            error: 'Failed to log weight',
        }

    }

}