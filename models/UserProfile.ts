import mongoose, { Schema, Document, Model } from 'mongoose'

export interface IUserProfile extends Document {
    userId: mongoose.Types.ObjectId
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
    createdAt: Date
    updatedAt: Date
}

const UserProfileSchema = new Schema<IUserProfile>(
    {
        userId: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true,
            unique: true,
        },
        age: {
            type: Number,
            required: true,
        },
        gender: {
            type: String,
            required: true,
            enum: ['male', 'female', 'other'],
        },
        currentWeight: {
            type: Number,
            required: true,
        },
        targetWeight: {
            type: Number,
            required: true,
        },
        height: {
            type: Number,
            required: true,
        },
        activityLevel: {
            type: String,
            required: true,
            enum: ['sedentary', 'lightly_active', 'moderately_active', 'very_active', 'extra_active'],
        },
        goalType: {
            type: String,
            required: true,
            enum: ['lose_weight', 'gain_muscle', 'maintain'],
        },
        dietaryPrefs: {
            type: [String],
            default: [],
        },
        allergies: {
            type: [String],
            default: [],
        },
        tdee: {
            type: Number,
            required: true,
        },
        targetCalories: {
            type: Number,
            required: true,
        },
        targetProtein: {
            type: Number,
            required: true,
        },
        targetCarbs: {
            type: Number,
            required: true,
        },
        targetFats: {
            type: Number,
            required: true,
        },
        onboardingComplete: {
            type: Boolean,
            default: false,
        },
    },
    {
        timestamps: true,
    }
)

// Index for faster lookups
UserProfileSchema.index({ userId: 1 })

const UserProfile: Model<IUserProfile> =
    mongoose.models.UserProfile || mongoose.model<IUserProfile>('UserProfile', UserProfileSchema)

export default UserProfile