import mongoose, { Schema, Document, Model } from 'mongoose'

export interface IFood extends Document {
    name: string
    brand?: string
    servingSize: number
    servingUnit: string
    calories: number
    protein: number
    carbs: number
    fats: number
    fiber?: number
    sugar?: number
    barcode?: string
    verified: boolean
    createdBy?: mongoose.Types.ObjectId
    createdAt: Date
}

const FoodSchema = new Schema<IFood>(
    {
        name: {
            type: String,
            required: true,
            trim: true,
        },
        brand: {
            type: String,
            trim: true,
        },
        servingSize: {
            type: Number,
            required: true,
        },
        servingUnit: {
            type: String,
            required: true,
        },
        calories: {
            type: Number,
            required: true,
        },
        protein: {
            type: Number,
            required: true,
        },
        carbs: {
            type: Number,
            required: true,
        },
        fats: {
            type: Number,
            required: true,
        },
        fiber: {
            type: Number,
        },
        sugar: {
            type: Number,
        },
        barcode: {
            type: String,
            unique: true,
            sparse: true,
        },
        verified: {
            type: Boolean,
            default: false,
        },
        createdBy: {
            type: Schema.Types.ObjectId,
            ref: 'User',
        },
    },
    {
        timestamps: true,
    }
)

// Indexes for search and lookup
FoodSchema.index({ name: 'text' })
FoodSchema.index({ barcode: 1 })

const Food: Model<IFood> =
    mongoose.models.Food || mongoose.model<IFood>('Food', FoodSchema)

export default Food