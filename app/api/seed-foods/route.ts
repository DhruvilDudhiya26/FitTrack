import { seedFoods } from "@/lib/seed-food";
import { error } from "console";
import { NextResponse } from "next/server";

export async function GET() {
    const result = await seedFoods();
    if (result.success) {
        return NextResponse.json({
            message: "Foods seeded successfully",
        })
    } else {
        return NextResponse.json({
            error: "Failed to seed foods"
        }, { status: 500 })
    }

}