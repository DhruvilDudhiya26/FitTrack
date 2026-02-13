'use server'

import dbConnect from "@/lib/mongodb"
import User from "@/models/User";
import bcrypt from "bcryptjs"

interface SignupData {
    name: string
    email: string
    password: string
}

export async function signup(data: SignupData) {
    try {
        await dbConnect();

        const existingUser = await User.findOne({ email: data.email.toLowerCase() })
        if (existingUser) {
            return {
                success: false,
                error: "user with this email already exists"
            }
        }
        const hashedPassword = await bcrypt.hash(data.password, 10)
        // create user 
        const user = await User.create({
            name: data.name,
            email: data.email.toLowerCase(),
            password: hashedPassword
        })

        return {
            success: true,
            message: "Account created successfully",
            userId: user._id.toString(),
            redirectTo: '/onboarding'
        }

    } catch (error) {
        console.error('signup Error', error)
        return {
            success: false,
            error: 'Failed to create account . Please try again.',
        }
    }
}