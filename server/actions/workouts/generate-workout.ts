"use server"

import dbConnect from "@/lib/mongodb"
import { getUserProfile } from "../Profile/get-profile";
import { generateWorkoutPlan } from "@/lib/ai/workout-generator";
import WorkoutPlan from "@/models/WorkoutPlan";
import { Types } from "mongoose";

interface GenerateWorkoutData {
    userId: string,
    experienceLevel: "beginner" | "intermediate" | "advanced"
    daysPerWeek: number
    equipment: string[]
    focusAreas: string[]
}

export async function generateAIWorkoutPlan(data: GenerateWorkoutData) {
    try {
        await dbConnect();

        // get user profile for goal type
        const profileResult = await getUserProfile(data.userId)
        if (!profileResult.success || !profileResult.profile) {
            return { success: false, error: 'User profile not found' }
        }

        const goalType = profileResult.profile.goalType

        // generate workout with AI
        const workoutDays = await generateWorkoutPlan({
            experienceLevel: data.experienceLevel,
            daysPerWeek: data.daysPerWeek,
            equipment: data.equipment,
            focusAreas: data.focusAreas,
            goalType
        })

        const workoutsObject = workoutDays.reduce((acc, day, index) => {
            acc[`day${index + 1}`] = day
            return acc
        }, {} as any)

        // Deactivate old plans
        await WorkoutPlan.updateMany(
            { userId: new Types.ObjectId(data.userId), isActive: true },
            { isActive: false }
        )
        // Save to database
        const workoutPlan = await WorkoutPlan.create({
            userId: new Types.ObjectId(data.userId),
            name: 'AI Workout Plan',
            daysPerWeek: data.daysPerWeek,
            experienceLevel: data.experienceLevel,
            equipment: data.equipment,
            focusAreas: data.focusAreas,
            workouts: workoutsObject,
            isActive: true,
            generatedByAI: true,
        })
        return {
            success: true,
            workoutPlan: JSON.parse(JSON.stringify(workoutPlan)),
        }

    } catch (error) {
        console.log(error)
        console.error('Error generating workout plan:', error)
        return {
            success: false,
            error: 'Failed to generate workout plan',
        }
    }
}