'use server'

import dbConnect from "@/lib/mongodb"
import User from "@/models/User";
import bcrypt from "bcryptjs";

interface LoginData {
    email: string
    password: string
}

export async function loginUser(data: LoginData) {
    try {
        await dbConnect();

        const user = await User.findOne({ email: data.email.toLowerCase() }).select('+password');

        if (!user || !user.password) {
            return {
                success: false,
                error: "Invalid email or password"
            }
        }
        // check password 
        const isPasswordValid = await bcrypt.compare(data.password, user.password)
        if (!isPasswordValid) {
            return {
                success: false,
                error: "Invalid email or password"
            }
        }
        return {
            success: true,
            user: {
                id: user._id.toString(),
                email: user.email,
                name: user.name
            }
        }

    } catch (error) {
        console.error('Login error', error)
        return {
            success: false,
            error: 'Failed to login. Please try again',
        }
    }
}