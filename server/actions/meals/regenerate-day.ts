
'use server'

import dbConnect from "@/lib/mongodb";
import { getUserProfile } from "../Profile/get-profile";
import MealPlan from "@/models/MealPlan";
import { Types } from "mongoose";
import { revalidatePath } from "next/cache";
import { generateSingleDay } from "@/lib/ai/meal-plan-generator";


export async function regenerateDay(userId: string, mealPlanId: string, dayName: string) {
    try {
        await dbConnect();

        const profileResult = await getUserProfile(userId)

        if (!profileResult.success || !profileResult.profile) {
            return {
                success: false,
                error: 'User profile not found',
            }
        }
        const profile = profileResult.profile

        // Generate new day with AI
        const newDay = await generateSingleDay({
            targetCalories: profile.targetCalories,
            targetProtein: profile.targetProtein,
            targetCarbs: profile.targetCarbs,
            targetFats: profile.targetFats,
            goalType: profile.goalType,
            dietaryPrefs: profile.dietaryPrefs,
            allergies: profile.allergies,
            dayName,
        })

        // Update meal plan in database
        const mealPlan = await MealPlan.findById(new Types.ObjectId(mealPlanId))

        if (!mealPlan) {
            return {
                success: false,
                error: 'Meal plan not found',
            }
        }
        // Update the specific day
        mealPlan.meals[dayName.toLowerCase()] = newDay
        await mealPlan.save()

        revalidatePath('/meals')

        return {
            success: true,
            day: JSON.parse(JSON.stringify(newDay)),
        }

    } catch (error) {
        console.error('Error regenerating day:', error)
        return {
            success: false,
            error: 'Failed to regenerate day',
        }
    }
}