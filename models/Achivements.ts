import mongoose, { Schema, Document, Model } from 'mongoose'

export interface IAchievement extends Document {
    userId: mongoose.Types.ObjectId
    type: 'streak' | 'goal' | 'macro' | 'workout'
    title: string
    description: string
    icon: string
    unlockedAt: Date
}

const AchievementSchema = new Schema<IAchievement>(
    {
        userId: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        type: {
            type: String,
            required: true,
            enum: ['streak', 'goal', 'macro', 'workout'],
        },
        title: {
            type: String,
            required: true,
        },
        description: {
            type: String,
            required: true,
        },
        icon: {
            type: String,
            required: true,
        },
        unlockedAt: {
            type: Date,
            default: Date.now,
        },
    },
    {
        timestamps: false,
    }
)

AchievementSchema.index({ userId: 1 })

const Achievement: Model<IAchievement> =
    mongoose.models.Achievement || mongoose.model<IAchievement>('Achievement', AchievementSchema)

export default Achievement