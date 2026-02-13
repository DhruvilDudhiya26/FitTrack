'use server'

import dbConnect from '@/lib/mongodb'
import UserProfile from '@/models/UserProfile'
import { calculateTDEE, calculateMacros } from '@/lib/calculations/tdee'
import { Types } from 'mongoose'

interface CreateProfileData {
    userId: string
    age: number
    gender: 'male' | 'female' | 'other'
    currentWeight: number
    targetWeight: number
    height: number
    activityLevel: string
    goalType: 'lose_weight' | 'gain_muscle' | 'maintain'
    dietaryPrefs: string[]
    allergies: string[]
}

export async function createUserProfile(data: CreateProfileData) {
    try {
        await dbConnect()

        // Check if profile already exists
        const existingProfile = await UserProfile.findOne({
            userId: new Types.ObjectId(data.userId)
        })

        if (existingProfile) {
            return {
                success: false,
                error: 'Profile already exists',
            }
        }

        // Calculate TDEE
        const tdee = calculateTDEE({
            weight: data.currentWeight,
            height: data.height,
            age: data.age,
            gender: data.gender,
            activityLevel: data.activityLevel,
        })

        // Calculate macros
        const macros = calculateMacros(tdee, data.goalType)

        // Create profile
        const profile = await UserProfile.create({
            userId: new Types.ObjectId(data.userId),
            age: data.age,
            gender: data.gender,
            currentWeight: data.currentWeight,
            targetWeight: data.targetWeight,
            height: data.height,
            activityLevel: data.activityLevel,
            goalType: data.goalType,
            dietaryPrefs: data.dietaryPrefs,
            allergies: data.allergies,
            tdee,
            targetCalories: macros.calories,
            targetProtein: macros.protein,
            targetCarbs: macros.carbs,
            targetFats: macros.fats,
            onboardingComplete: true,
        })

        return {
            success: true,
            profile: JSON.parse(JSON.stringify(profile)),
        }
    } catch (error) {
        console.error('Error creating profile:', error)
        return {
            success: false,
            error: 'Failed to create profile',
        }
    }
}