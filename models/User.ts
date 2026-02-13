import mongoose, { Schema, Document, Model } from 'mongoose'

export interface IUser extends Document {
    name?: string
    email: string
    password?: string
    emailVerified?: Date
    image?: string
    createdAt: Date
    updatedAt: Date
}

const UserSchema = new Schema<IUser>(
    {
        name: {
            type: String,
            required: false,
        },
        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true,
        },
        password: {
            type: String,
            required: false, // Optional for OAuth users
            select: false, // Don't include password in queries by default
        },
        emailVerified: {
            type: Date,
            required: false,
        },
        image: {
            type: String,
            required: false,
        },
    },
    {
        timestamps: true,
    }
)

// Prevent model recompilation in development
const User: Model<IUser> =
    mongoose.models.User || mongoose.model<IUser>('User', UserSchema)

export default User