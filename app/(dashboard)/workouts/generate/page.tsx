'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useUser } from '@/hooks/use-user'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { generateAIWorkoutPlan } from '@/server/actions/workouts/generate-workout'

const EQUIPMENT_OPTIONS = [
    { id: 'dumbbells', label: '🏋️ Dumbbells' },
    { id: 'barbell', label: '🔧 Barbell' },
    { id: 'pullup_bar', label: '🔝 Pull-up Bar' },
    { id: 'resistance_bands', label: '🎀 Resistance Bands' },
    { id: 'kettlebell', label: '🫙 Kettlebell' },
    { id: 'bench', label: '🛋️ Bench' },
    { id: 'cables', label: '⚡ Cable Machine' },
    { id: 'machines', label: '🤖 Gym Machines' },
]

const FOCUS_OPTIONS = [
    { id: 'chest', label: '💪 Chest' },
    { id: 'back', label: '🔙 Back' },
    { id: 'shoulders', label: '🔼 Shoulders' },
    { id: 'arms', label: '💪 Arms' },
    { id: 'legs', label: '🦵 Legs' },
    { id: 'glutes', label: '🍑 Glutes' },
    { id: 'core', label: '🎯 Core' },
    { id: 'cardio', label: '❤️ Cardio' },
]

export default function GenerateWorkoutPage() {
    const router = useRouter()
    const { user } = useUser()

    const [step, setStep] = useState(1)
    const [isGenerating, setIsGenerating] = useState(false)
    const [error, setError] = useState('')

    const [formData, setFormData] = useState({
        experienceLevel: '',
        daysPerWeek: 3,
        equipment: [] as string[],
        focusAreas: [] as string[],
    })

    const toggleItem = (field: 'equipment' | 'focusAreas', value: string) => {
        const current = formData[field]
        const updated = current.includes(value)
            ? current.filter((i) => i !== value)
            : [...current, value]
        setFormData({ ...formData, [field]: updated })
    }

    const handleGenerate = async () => {
        if (!user?.id) return

        if (!formData.experienceLevel) {
            setError('Please select your experience level')
            return
        }
        setIsGenerating(true)
        setError('')
        try {
            const result = await generateAIWorkoutPlan({
                userId: user.id,
                experienceLevel: formData.experienceLevel as any,
                daysPerWeek: formData.daysPerWeek,
                equipment: formData.equipment,
                focusAreas: formData.focusAreas,
            })

            if (!result.success) {
                setError(result.error || 'Failed to generate workout plan')
                setIsGenerating(false)
                return
            }

            router.push('/workouts')
            router.refresh()
        } catch (error) {
            setError('Something went wrong. Please try again.')
            setIsGenerating(false)
        }
    }

    return (
        <div className="max-w-2xl mx-auto space-y-6">
            <div>
                <h2 className="text-2xl font-bold text-gray-900">Generate Workout Plan</h2>
                <p className="text-gray-600 mt-1">Tell us about yourself and we'll create the perfect plan</p>
            </div>

            <Card className="p-6 space-y-6">
                {/* Experience Level */}
                <div>
                    <h3 className="font-semibold text-gray-900 mb-3">Experience Level</h3>
                    <div className="grid grid-cols-3 gap-3">
                        {[
                            { value: 'beginner', label: '🌱 Beginner', desc: 'Less than 1 year' },
                            { value: 'intermediate', label: '🔥 Intermediate', desc: '1-3 years' },
                            { value: 'advanced', label: '⚡ Advanced', desc: '3+ years' },
                        ].map((level) => (
                            <button
                                key={level.value}
                                onClick={() => setFormData({ ...formData, experienceLevel: level.value })}
                                className={`p-4 rounded-xl border-2 text-center transition-all ${formData.experienceLevel === level.value
                                    ? 'border-green-600 bg-green-50'
                                    : 'border-gray-200 hover:border-gray-300'
                                    }`}
                            >
                                <div className="text-2xl mb-1">{level.label.split(' ')[0]}</div>
                                <div className="font-semibold text-gray-900 text-sm">
                                    {level.label.split(' ')[1]}
                                </div>
                                <div className="text-xs text-gray-500 mt-1">{level.desc}</div>
                                {formData.experienceLevel === level.value && (
                                    <div className="text-green-600 text-sm mt-1">✓ Selected</div>
                                )}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Days Per Week */}
                <div>
                    <h3 className="font-semibold text-gray-900 mb-3">
                        Days Per Week: <span className="text-green-600">{formData.daysPerWeek}</span>
                    </h3>
                    <div className="flex gap-2">
                        {[2, 3, 4, 5, 6].map((days) => (
                            <button
                                key={days}
                                onClick={() => setFormData({ ...formData, daysPerWeek: days })}
                                className={`flex-1 py-3 rounded-xl border-2 font-semibold transition-all ${formData.daysPerWeek === days
                                    ? 'border-green-600 bg-green-50 text-green-600'
                                    : 'border-gray-200 text-gray-700 hover:border-gray-300'
                                    }`}
                            >
                                {days}
                            </button>
                        ))}
                    </div>
                    <p className="text-xs text-gray-500 mt-2">
                        {formData.daysPerWeek <= 3
                            ? 'Great for beginners or busy schedules'
                            : formData.daysPerWeek === 4
                                ? 'Ideal balance of training and recovery'
                                : 'Advanced schedule - ensure adequate sleep and nutrition'}
                    </p>
                </div>

                {/* Equipment */}
                <div>
                    <h3 className="font-semibold text-gray-900 mb-1">Available Equipment</h3>
                    <p className="text-sm text-gray-500 mb-3">Select all you have access to (leave empty for bodyweight only)</p>
                    <div className="grid grid-cols-2 gap-2">
                        {EQUIPMENT_OPTIONS.map((eq) => (
                            <button
                                key={eq.id}
                                onClick={() => toggleItem('equipment', eq.id)}
                                className={`p-3 rounded-lg border-2 text-left text-sm font-medium transition-all ${formData.equipment.includes(eq.id)
                                    ? 'border-green-600 bg-green-50 text-green-700'
                                    : 'border-gray-200 text-gray-700 hover:border-gray-300'
                                    }`}
                            >
                                {eq.label} {formData.equipment.includes(eq.id) && '✓'}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Focus Areas */}
                <div>
                    <h3 className="font-semibold text-gray-900 mb-1">Focus Areas</h3>
                    <p className="text-sm text-gray-500 mb-3">What do you want to prioritize? (Optional)</p>
                    <div className="grid grid-cols-2 gap-2">
                        {FOCUS_OPTIONS.map((area) => (
                            <button
                                key={area.id}
                                onClick={() => toggleItem('focusAreas', area.id)}
                                className={`p-3 rounded-lg border-2 text-left text-sm font-medium transition-all ${formData.focusAreas.includes(area.id)
                                    ? 'border-blue-600 bg-blue-50 text-blue-700'
                                    : 'border-gray-200 text-gray-700 hover:border-gray-300'
                                    }`}
                            >
                                {area.label} {formData.focusAreas.includes(area.id) && '✓'}
                            </button>
                        ))}
                    </div>
                </div>

                {error && (
                    <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                        {error}
                    </div>
                )}

                <Button
                    onClick={handleGenerate}
                    disabled={isGenerating || !formData.experienceLevel}
                    size="lg"
                    className="w-full bg-green-600 hover:bg-green-700"
                >
                    {isGenerating ? (
                        <span className="flex items-center gap-2">
                            <span className="animate-spin">⏳</span>
                            Generating... (30-60 seconds)
                        </span>
                    ) : (
                        '✨ Generate My Workout Plan'
                    )}
                </Button>
            </Card>
        </div>
    )
}