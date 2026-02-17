"use server"

import dbConnect from "@/lib/mongodb";
import MealPlan from "@/models/MealPlan";
import { Types } from "mongoose";
import { isWithinInterval, startOfDay } from "date-fns";


export async function getActiveMealPlan(userId: string) {
    try {
        await dbConnect();

        const mealPlan = await MealPlan.findOne({
            userId: new Types.ObjectId(userId),
            isActive: true,
        }).sort({ createdAt: -1 }).lean();

        if (!mealPlan) {
            return {
                success: true,
                mealPlan: null
            }
        }

        // Check if the meal plan is still within the current week
        const today = startOfDay(new Date());
        const startDate = startOfDay(new Date(mealPlan.startDate));
        const endDate = startOfDay(new Date(mealPlan.endDate));

        // If the week has passed, deactivate the meal plan
        if (!isWithinInterval(today, { start: startDate, end: endDate })) {
            await MealPlan.updateOne(
                { _id: mealPlan._id },
                { isActive: false }
            );
            return {
                success: true,
                mealPlan: null
            }
        }

        return {
            success: true,
            mealPlan: JSON.parse(JSON.stringify(mealPlan)),
        }
    } catch (error) {
        console.error('Error getting meal plan:', error)
        return {
            success: false,
            mealPlan: null,
        }
    }
}