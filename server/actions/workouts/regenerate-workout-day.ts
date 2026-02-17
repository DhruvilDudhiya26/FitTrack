"use server"

import dbConnect from '@/lib/mongodb'
import WorkoutPlan from '@/models/WorkoutPlan'

import { regenerateWorkoutDay } from '@/lib/ai/workout-generator'
import { Types } from 'mongoose'
import { revalidatePath } from 'next/cache'
import { getUserProfile } from '../Profile/get-profile'

export async function regenerateDay(
    userId: string,
    workoutPlanId: string,
    dayKey: string,
    dayName: string
) {
    try {
        await dbConnect()

        const profileResult = await getUserProfile(userId)
        if (!profileResult.success || !profileResult.profile) {
            return { success: false, error: 'Profile not found' }
        }

        // Get current plan for settings
        const currentPlan = await WorkoutPlan.findById(
            new Types.ObjectId(workoutPlanId)
        )
        if (!currentPlan) {
            return { success: false, error: 'Workout plan not found' }
        }

        // Generate new day
        const newDay = await regenerateWorkoutDay(
            {
                experienceLevel: currentPlan.experienceLevel as any,
                daysPerWeek: currentPlan.daysPerWeek,
                equipment: currentPlan.equipment,
                focusAreas: currentPlan.focusAreas,
                goalType: profileResult.profile.goalType,
            },
            dayName
        )

        // Update the plan
        currentPlan.workouts[dayKey] = newDay
        await currentPlan.save()

        revalidatePath('/workouts')

        return { success: true, day: JSON.parse(JSON.stringify(newDay)) }
    } catch (error) {
        console.error('Error regenerating day:', error)
        return { success: false, error: 'Failed to regenerate workout day' }
    }
}