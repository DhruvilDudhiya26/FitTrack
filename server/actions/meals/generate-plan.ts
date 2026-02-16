"use server"

import dbConnect from "@/lib/mongodb";
import { getUserProfile } from "../Profile/get-profile";
import { generateMealPlan } from "@/lib/ai/meal-plan-generator";
import MealPlan from "@/models/MealPlan";
import { addDays } from "date-fns";
import { Types } from "mongoose";


export async function generateAIMealPlan(userId: string) {
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

        const mealPlanData = await generateMealPlan({
            targetCalories: profile.targetCalories,
            targetProtein: profile.targetProtein,
            targetCarbs: profile.targetCarbs,
            targetFats: profile.targetFats,
            goalType: profile.goalType,
            dietaryPrefs: profile.dietaryPrefs,
            allergies: profile.allergies,
            daysCount: 7,
        })

        console.log(mealPlanData)

        const mealsObject = mealPlanData.reduce((acc, day) => {
            acc[day.day.toLowerCase()] = day
            return acc
        }, {} as any)

        // Deactive previous meal plans
        await MealPlan.updateMany(
            { userId: new Types.ObjectId(userId), isActive: true },
            { isActive: false }
        )

        // save to database 
        const startDate = new Date();
        const endDate = addDays(startDate, 6)

        const mealPlan = await MealPlan.create({
            userId: new Types.ObjectId(userId),
            name: "AI Generated Meal Plan",
            startDate,
            endDate,
            meals: mealsObject,
            isActive: true,
            generatedByAI: true
        })
        return {
            success: true,
            mealPlan: JSON.parse(JSON.stringify(mealPlan)),
        }
    } catch (error) {
        console.error('Error generating meal plan:', error)
        return {
            success: false,
            error: 'Failed to generate meal plan. Please try again.',
        }
    }

}