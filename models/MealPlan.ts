import mongoose, { Schema, Document, Model } from 'mongoose'

export interface IMealPlan extends Document {
    _id: mongoose.Types.ObjectId
    userId: mongoose.Types.ObjectId
    name?: string
    startDate: Date
    endDate: Date
    meals: any // Complex nested structure
    isActive: boolean
    generatedByAI: boolean
    createdAt: Date
    updatedAt: Date
}

const MealPlanSchema = new Schema<IMealPlan>(
    {
        userId: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        name: {
            type: String,
            default: 'My Meal Plan',
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
MealPlanSchema.index({ userId: 1, startDate: -1 })

const MealPlan: Model<IMealPlan> =
    mongoose.models.MealPlan || mongoose.model<IMealPlan>('MealPlan', MealPlanSchema)

export default MealPlan