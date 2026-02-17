'use server'

import dbConnect from '@/lib/mongodb'
import UserProfile from '@/models/UserProfile'
import { calculateTDEE, calculateMacros } from '@/lib/calculations/tdee'
import { Types } from 'mongoose'
import { revalidatePath } from 'next/cache'

interface UpdateProfileData {
    userId: string
    age?: number
    currentWeight?: number
    targetWeight?: number
    height?: number
    activityLevel?: string
    goalType?: 'lose_weight' | 'gain_muscle' | 'maintain'
    dietaryPrefs?: string[]
    allergies?: string[]
    gender?: 'male' | 'female' | 'other'
}

export async function updateUserProfile(data: UpdateProfileData) {
    try {
        await dbConnect()

        const profile = await UserProfile.findOne({
            userId: new Types.ObjectId(data.userId),
        })

        if (!profile) {
            return { success: false, error: 'Profile not found' }
        }

        // Update fields
        if (data.age) profile.age = data.age
        if (data.currentWeight) profile.currentWeight = data.currentWeight
        if (data.targetWeight) profile.targetWeight = data.targetWeight
        if (data.height) profile.height = data.height
        if (data.activityLevel) profile.activityLevel = data.activityLevel as any
        if (data.goalType) profile.goalType = data.goalType
        if (data.dietaryPrefs !== undefined) profile.dietaryPrefs = data.dietaryPrefs
        if (data.allergies !== undefined) profile.allergies = data.allergies
        if (data.gender) profile.gender = data.gender

        // Recalculate TDEE and macros
        const tdee = calculateTDEE({
            weight: profile.currentWeight,
            height: profile.height,
            age: profile.age,
            gender: profile.gender,
            activityLevel: profile.activityLevel,
        })

        const macros = calculateMacros(tdee, profile.goalType)

        profile.tdee = tdee
        profile.targetCalories = macros.calories
        profile.targetProtein = macros.protein
        profile.targetCarbs = macros.carbs
        profile.targetFats = macros.fats

        await profile.save()

        revalidatePath('/dashboard')
        revalidatePath('/profile')
        revalidatePath('/settings')

        return {
            success: true,
            profile: JSON.parse(JSON.stringify(profile)),
        }
    } catch (error) {
        console.error('Error updating profile:', error)
        return { success: false, error: 'Failed to update profile' }
    }
}