"use server"

import dbConnect from '@/lib/mongodb'
import WorkoutLog from '@/models/WorkoutLog'
import { Types } from 'mongoose'
import { revalidatePath } from 'next/cache'

interface LogWorkoutData {
    userId: string
    workoutPlanId: string
    dayName: string
    exercises: {
        name: string
        sets: { reps: number; weight?: number; completed: boolean }[]
    }[]
    duration: number
    notes?: string
}

export async function logWorkout(data: LogWorkoutData) {
    try {
        await dbConnect()

        const log = await WorkoutLog.create({
            userId: new Types.ObjectId(data.userId),
            workoutPlanId: new Types.ObjectId(data.workoutPlanId),
            dayName: data.dayName,
            exercises: data.exercises,
            duration: data.duration,
            notes: data.notes,
        })

        revalidatePath('/workouts')

        return {
            success: true,
            log: JSON.parse(JSON.stringify(log)),
        }
    } catch (error) {
        console.error('Error logging workout:', error)
        return { success: false, error: 'Failed to log workout' }
    }
}