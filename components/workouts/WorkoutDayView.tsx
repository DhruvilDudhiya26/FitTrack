import { ExerciseCard } from './ExerciseCard'
import { Button } from '@/components/ui/button'

interface WorkoutDayViewProps {
    day: any
    dayKey: string
    planId: string
    userId: string
    onRegenerate: () => void
    isRegenerating: boolean
}

export function WorkoutDayView({
    day,
    dayKey,
    planId,
    userId,
    onRegenerate,
    isRegenerating,
}: WorkoutDayViewProps) {
    return (
        <div className="space-y-4">
            {/* Day Header */}
            <div className="bg-gradient-to-r from-green-600 to-blue-600 rounded-xl p-6 text-white">
                <div className="flex justify-between items-start">
                    <div>
                        <h3 className="text-2xl font-bold">{day.name}</h3>
                        <p className="text-sm opacity-90 mt-1">{day.type}</p>
                        <div className="flex gap-3 mt-3 text-sm">
                            <span>⏱ {day.duration}</span>
                            <span>💪 {day.exercises?.length || 0} exercises</span>
                        </div>
                    </div>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={onRegenerate}
                        disabled={isRegenerating}
                        className="bg-white/20 border-white/40 text-white hover:bg-white/30"
                    >
                        {isRegenerating ? '⏳...' : '🔄 Redo'}
                    </Button>
                </div>
                {day.notes && (
                    <p className="text-sm opacity-90 mt-3 italic">📌 {day.notes}</p>
                )}
            </div>

            {/* Warm Up */}
            {day.warmup && day.warmup.length > 0 && (
                <div className="bg-orange-50 rounded-xl p-4 border-2 border-orange-200">
                    <h4 className="font-semibold text-orange-800 mb-2">🔥 Warm Up</h4>
                    <ul className="space-y-1">
                        {day.warmup.map((item: string, idx: number) => (
                            <li key={idx} className="text-sm text-orange-700 flex items-start gap-2">
                                <span>•</span>
                                {item}
                            </li>
                        ))}
                    </ul>
                </div>
            )}

            {/* Exercises */}
            <div className="space-y-3">
                <h4 className="font-semibold text-gray-900">Exercises</h4>
                {day.exercises?.map((exercise: any, idx: number) => (
                    <ExerciseCard key={idx} exercise={exercise} index={idx} />
                ))}
            </div>

            {/* Cool Down */}
            {day.cooldown && day.cooldown.length > 0 && (
                <div className="bg-blue-50 rounded-xl p-4 border-2 border-blue-200">
                    <h4 className="font-semibold text-blue-800 mb-2">❄️ Cool Down</h4>
                    <ul className="space-y-1">
                        {day.cooldown.map((item: string, idx: number) => (
                            <li key={idx} className="text-sm text-blue-700 flex items-start gap-2">
                                <span>•</span>
                                {item}
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    )
}