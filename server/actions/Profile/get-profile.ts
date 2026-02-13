'use server'

import dbConnect from '@/lib/mongodb'
import UserProfile from '@/models/UserProfile'
import { Types } from 'mongoose'

export async function getUserProfile(userId: string) {
    try {
        await dbConnect()

        const profile = await UserProfile.findOne({
            userId: new Types.ObjectId(userId),
        }).lean()

        if (!profile) {
            return {
                success: false,
                profile: null,
            }
        }

        return {
            success: true,
            profile: JSON.parse(JSON.stringify(profile)),
        }
    } catch (error) {
        console.error('Error getting profile:', error)
        return {
            success: false,
            profile: null,
        }
    }
}