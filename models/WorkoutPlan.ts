import mongoose, { Model, Schema } from "mongoose";

export interface IWorkoutPlan extends Document {
    _id: mongoose.Types.ObjectId
    userId: mongoose.Types.ObjectId
    name: string
    daysPerWeek: number
    experienceLevel: string
    equipment: string[]
    focusAreas: string[]
    workouts: any
    isActive: boolean
    generatedByAI: boolean
    createdAt: Date
    updatedAt: Date
}

const WorkoutPlanSchema = new Schema<IWorkoutPlan>(
    {
        userId: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        name: {
            type: String,
            default: "AI Workout Plan",
        },
        daysPerWeek: {
            type: Number,
            required: true,
            min: 2,
            max: 6
        },
        experienceLevel: {
            type: String,
            required: true,
            enum: ["beginner", "intermediate", "advanced"],
        },
        equipment: {
            type: [String],
            default: []
        },
        focusAreas: {
            type: [String],
            default: []
        },
        workouts: {
            type: Schema.Types.Mixed,
            required: true,
        },
        isActive: {
            type: Boolean,
            default: true,
        },
        generatedByAI: {
            type: Boolean,
            default: false,
        },
    },
    {
        timestamps: true,
    }
)

WorkoutPlanSchema.index({ userId: 1, isActive: 1 })

const WorkoutPlan: Model<IWorkoutPlan> = mongoose.models.WorkoutPlan || mongoose.model('WorkoutPlan', WorkoutPlanSchema)

export default WorkoutPlan