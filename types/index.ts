import { Types } from 'mongoose'

export interface User {
    _id: Types.ObjectId
    name?: string
    email: string
    image?: string
    createdAt: Date
    updatedAt: Date
}

export interface UserProfile {
    _id: Types.ObjectId
    userId: Types.ObjectId
    age: number
    gender: string
    currentWeight: number
    targetWeight: number
    height: number
    activityLevel: string
    goalType: 'lose_weight' | 'gain_muscle' | 'maintain'
    dietaryPrefs: string[]
    allergies: string[]
    tdee: number
    targetCalories: number
    targetProtein: number
    targetCarbs: number
    targetFats: number
    onboardingComplete: boolean
}

export interface Food {
    _id: Types.ObjectId
    name: string
    brand?: string
    servingSize: number
    servingUnit: string
    calories: number
    protein: number
    carbs: number
    fats: number
}

export interface FoodLog {
    _id: Types.ObjectId
    userId: Types.ObjectId
    foodId: Types.ObjectId
    servings: number
    mealType: 'breakfast' | 'lunch' | 'dinner' | 'snack'
    loggedAt: Date
    food?: Food
}

export interface SignupData {
    name: string
    email: string
    password: string
}

export interface LoginData {
    email: string
    password: string
}

export interface User {
    id: string
    name?: string
    email: string
    image?: string
}