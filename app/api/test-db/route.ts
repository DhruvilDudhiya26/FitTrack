import { NextResponse } from 'next/server'
import dbConnect from '@/lib/mongodb'
import User from '@/models/User'

export async function GET() {
    try {
        await dbConnect()

        // Try to count users
        const count = await User.countDocuments()

        return NextResponse.json({
            success: true,
            message: 'Database connected!',
            userCount: count
        })
    } catch (error) {
        return NextResponse.json({
            success: false,
            error: 'Database connection failed'
        }, { status: 500 })
    }
}