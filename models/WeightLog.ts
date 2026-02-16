import mongoose, { Schema, Document, Model } from 'mongoose'

export interface IWeightLog extends Document {
    _id: mongoose.Types.ObjectId
    userId: mongoose.Types.ObjectId
    weight: number
    note?: string
    loggedAt: Date
    createdAt: Date
}

const WeightLogSchema = new Schema<IWeightLog>(
    {
        userId: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        weight: {
            type: Number,
            required: true,
            min: 20,
            max: 500,
        },
        note: {
            type: String,
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

WeightLogSchema.index({ userId: 1, loggedAt: -1 })

const WeightLog: Model<IWeightLog> =
    mongoose.models.WeightLog || mongoose.model<IWeightLog>('WeightLog', WeightLogSchema)

export default WeightLog