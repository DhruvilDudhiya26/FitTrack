"use server"

import dbConnect from '@/lib/mongodb'
import WorkoutPlan from '@/models/WorkoutPlan'
import { Types } from 'mongoose'

export async function getActiveWorkoutPlan(userId: string) {
    try {
        await dbConnect()

        const workoutPlan = await WorkoutPlan.findOne({
            userId: new Types.ObjectId(userId),
            isActive: true,
        })
            .sort({ createdAt: -1 })
            .lean()

        if (!workoutPlan) {
            return { success: true, workoutPlan: null }
        }

        return {
            success: true,
            workoutPlan: JSON.parse(JSON.stringify(workoutPlan)),
        }
    } catch (error) {
        console.error('Error getting workout plan:', error)
        return { success: false, workoutPlan: null }
    }
}