import mongoose, { Schema, Document, Model } from 'mongoose'

export interface IWaterLog extends Document {
    userId: mongoose.Types.ObjectId
    glasses: number
    date: string // YYYY-MM-DD for easy daily lookup
    createdAt: Date
    updatedAt: Date
}

const WaterLogSchema = new Schema<IWaterLog>(
    {
        userId: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        glasses: {
            type: Number,
            default: 0,
            min: 0,
            max: 20,
        },
        date: {
            type: String,
            required: true,
        },
    },
    { timestamps: true }
)

WaterLogSchema.index({ userId: 1, date: 1 }, { unique: true })

const WaterLog: Model<IWaterLog> =
    mongoose.models.WaterLog || mongoose.model<IWaterLog>('WaterLog', WaterLogSchema)

export default WaterLog