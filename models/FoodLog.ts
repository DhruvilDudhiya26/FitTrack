import mongoose, { Schema, Document, Model } from 'mongoose'
// Import Food model to ensure it's registered before FoodLog schema references it
import '@/models/Food'

export interface IFoodLog extends Document {
    userId: mongoose.Types.ObjectId
    foodId: mongoose.Types.ObjectId
    servings: number
    mealType: 'breakfast' | 'lunch' | 'dinner' | 'snack'
    loggedAt: Date
    createdAt: Date
}

const FoodLogSchema = new Schema<IFoodLog>(
    {
        userId: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        foodId: {
            type: Schema.Types.ObjectId,
            ref: 'Food',
            required: true,
        },
        servings: {
            type: Number,
            required: true,
            min: 0,
        },
        mealType: {
            type: String,
            required: true,
            enum: ['breakfast', 'lunch', 'dinner', 'snack'],
        },
        loggedAt: {
            type: Date,
            default: Date.now,
        },
    },
    {
        timestamps: true,
    }
)

// Compound index for efficient queries
FoodLogSchema.index({ userId: 1, loggedAt: -1 })

const FoodLog: Model<IFoodLog> =
    mongoose.models.FoodLog || mongoose.model<IFoodLog>('FoodLog', FoodLogSchema)

export default FoodLog