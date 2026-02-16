import dbConnect from "@/lib/mongodb";
import WeightLog from "@/models/WeightLog";
import { subDays } from "date-fns";
import { Types } from "mongoose";
import { start } from "repl";


export async function getWeightLogs(userId: string, days: number = 90) {
    try {
        await dbConnect();

        const startDate = subDays(new Date(), days)

        const weightLogs = await WeightLog.find({
            userId: new Types.ObjectId(userId),
            loggedAt: { $gte: startDate }
        }).sort({ loggedAt: 1 }).lean()

        return {
            success: true,
            logs: JSON.parse(JSON.stringify(weightLogs)),
        }
    } catch (error) {
        console.error('Error getting weight logs:', error)
        return {
            success: false,
            logs: [],
        }
    }
}