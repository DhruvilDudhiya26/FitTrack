"use server"

import dbConnect from "@/lib/mongodb";
import { getUserProfile } from "../Profile/get-profile";
import { generateMealPlan } from "@/lib/ai/meal-plan-generator";
import MealPlan from "@/models/MealPlan";
import { addDays, isWithinInterval, startOfDay } from "date-fns";
import { Types } from "mongoose";


export async function generateAIMealPlan(userId: string) {
    try {
        await dbConnect();
        
        // Check if there's an active meal plan for the current week
        const existingPlan = await MealPlan.findOne({
            userId: new Types.ObjectId(userId),
            isActive: true,
        }).sort({ createdAt: -1 }).lean();

        if (existingPlan) {
            const today = startOfDay(new Date());
            const startDate = startOfDay(new Date(existingPlan.startDate));
            const endDate = startOfDay(new Date(existingPlan.endDate));

            // Check if today is within the meal plan's week
            if (isWithinInterval(today, { start: startDate, end: endDate })) {
                return {
                    success: false,
                    error: 'You already have an active meal plan for this week. Please wait until the week ends to generate a new one.',
                    mealPlan: JSON.parse(JSON.stringify(existingPlan)),
                }
            }
        }

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