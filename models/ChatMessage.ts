import mongoose, { Schema, Document, Model } from 'mongoose'

export interface IChatMessage extends Document {
    userId: mongoose.Types.ObjectId
    role: 'user' | 'assistant'
    content: string
    createdAt: Date
}

const ChatMessageSchema = new Schema<IChatMessage>(
    {
        userId: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        role: {
            type: String,
            required: true,
            enum: ['user', 'assistant'],
        },
        content: {
            type: String,
            required: true,
        },
    },
    {
        timestamps: true,
    }
)

ChatMessageSchema.index({ userId: 1, createdAt: -1 })

const ChatMessage: Model<IChatMessage> =
    mongoose.models.ChatMessage || mongoose.model<IChatMessage>('ChatMessage', ChatMessageSchema)

export default ChatMessage