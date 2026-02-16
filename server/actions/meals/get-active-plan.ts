"use server"

import dbConnect from "@/lib/mongodb";
import MealPlan from "@/models/MealPlan";
import { Types } from "mongoose";


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