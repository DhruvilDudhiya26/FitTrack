import mongoose, { Model, Schema } from "mongoose";


export interface IWorkoutLog extends Document {
    _id: mongoose.Types.ObjectId
    userId: mongoose.Types.ObjectId
    workoutPlanId: mongoose.Types.ObjectId
    dayName: string
    exercises: {
        name: string
        sets: { reps: number; weight?: number; completed: boolean }[]
    }[]
    duration: number
    notes?: string
    completedAt: Date
    createdAt: Date
}

const WorkoutLogSchema = new Schema<IWorkoutLog>({
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    workoutPlanId: {
        type: Schema.Types.ObjectId,
        ref: "WorkoutPlan",
        required: true,
    },
    dayName: {
        type: String,
        required: true
    },
    exercises: [
        {
            name: String,
            sets: [
                {
                    reps: Number,
                    weight: Number,
                    completed: { type: Boolean, default: false }
                },
            ],
        },
    ],
    duration: {
        type: Number,
        default: 0,
    },
    notes: String,
    completedAt: {
        type: Date,
        default: Date.now,
    },

}, { timestamps: true })

WorkoutLogSchema.index({ userId: 1, completedAt: -1 })

const WorkoutLog: Model<IWorkoutLog> = mongoose.models.WorkoutLog || mongoose.model<IWorkoutLog>('workoutLog', WorkoutLogSchema)

export default WorkoutLog