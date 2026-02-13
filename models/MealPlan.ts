import mongoose, { Schema, Document, Model } from 'mongoose'

interface Meal {
    name: string
    calories: number
    protein: number
    carbs: number
    fats: number
    ingredients: string[]
    instructions?: string
}

interface DayMeals {
    breakfast: Meal
    lunch: Meal
    dinner: Meal
    snacks?: Meal[]
}

export interface IMealPlan extends Document {
    userId: mongoose.Types.ObjectId
    name?: string
    startDate: Date
    endDate: Date
    meals: {
        [key: string]: DayMeals // monday, tuesday, etc.
    }
    isActive: boolean
    generatedByAI: boolean
    createdAt: Date
    updatedAt: Date
}

const MealSchema = new Schema({
    name: { type: String, required: true },
    calories: { type: Number, required: true },
    protein: { type: Number, required: true },
    carbs: { type: Number, required: true },
    fats: { type: Number, required: true },
    ingredients: [{ type: String }],
    instructions: { type: String },
}, { _id: false })

const MealPlanSchema = new Schema<IMealPlan>(
    {
        userId: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        name: {
            type: String,
        },
        startDate: {
            type: Date,
            required: true,
        },
        endDate: {
            type: Date,
            required: true,
        },
        meals: {
            type: Schema.Types.Mixed,
            required: true,
        },
        isActive: {
            type: Boolean,
            default: true,
        },
        generatedByAI: {
            type: Boolean,
            default: false,
        },
    },
    {
        timestamps: true,
    }
)

MealPlanSchema.index({ userId: 1, isActive: 1 })

const MealPlan: Model<IMealPlan> =
    mongoose.models.MealPlan || mongoose.model<IMealPlan>('MealPlan', MealPlanSchema)

export default MealPlan