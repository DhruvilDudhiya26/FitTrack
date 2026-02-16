"use server"

import dbConnect from "@/lib/mongodb"
import Food from "@/models/Food";

export async function searchFood(query: string) {
    try {
        await dbConnect();
        const foods = await Food.find({
            $or: [
                { name: { $regex: query, $options: "i" } },
                { brand: { $regex: query, $options: "i" } }
            ]
        }).limit(20).lean();

        return {
            success: true,
            foods: JSON.parse(JSON.stringify(foods)),
        }

    } catch (error) {
        console.log("Error searching food", error);
        return {
            success: false,
            foods: [],
            error: "Failed to search foods"
        }

    }

}