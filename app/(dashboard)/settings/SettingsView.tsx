'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card } from '@/components/ui/card'
import { updateUserProfile } from '@/server/actions/Profile/update-profile'

interface SettingsViewProps {
    userId: string
    profile: any
}

export function SettingsView({ userId, profile }: SettingsViewProps) {
    const router = useRouter()
    const [isSaving, setIsSaving] = useState(false)
    const [saved, setSaved] = useState(false)
    const [error, setError] = useState('')

    const [formData, setFormData] = useState({
        age: profile.age.toString(),
        currentWeight: profile.currentWeight.toString(),
        targetWeight: profile.targetWeight.toString(),
        height: profile.height.toString(),
        activityLevel: profile.activityLevel,
        goalType: profile.goalType,
        dietaryPrefs: profile.dietaryPrefs as string[],
        allergies: profile.allergies.join(', '),
    })

    const update = (field: string, value: any) =>
        setFormData((prev) => ({ ...prev, [field]: value }))

    const togglePref = (pref: string) => {
        const prefs = formData.dietaryPrefs.includes(pref)
            ? formData.dietaryPrefs.filter((p) => p !== pref)
            : [...formData.dietaryPrefs, pref]
        update('dietaryPrefs', prefs)
    }

    const handleSave = async () => {
        setIsSaving(true)
        setError('')
        setSaved(false)

        const result = await updateUserProfile({
            userId,
            age: parseInt(formData.age),
            currentWeight: parseFloat(formData.currentWeight),
            targetWeight: parseFloat(formData.targetWeight),
            height: parseFloat(formData.height),
            activityLevel: formData.activityLevel,
            goalType: formData.goalType as any,
            dietaryPrefs: formData.dietaryPrefs,
            allergies: formData.allergies
                ? formData.allergies.split(',').map((a: any) => a.trim()).filter(Boolean)
                : [],
        })

        setIsSaving(false)

        if (result.success) {
            setSaved(true)
            setTimeout(() => setSaved(false), 3000)
            router.refresh()
        } else {
            setError(result.error || 'Failed to save')
        }
    }

    return (
        <div className="max-w-2xl mx-auto space-y-6">
            <div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Settings</h2>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                    Update your profile and macros will recalculate automatically
                </p>
            </div>

            {/* Personal Info */}
            <Card className="p-6 space-y-4">
                <h3 className="font-bold text-gray-900 dark:text-white">Personal Info</h3>

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="text-sm font-medium text-gray-700 dark:text-gray-300 block mb-1">
                            Age
                        </label>
                        <Input
                            type="number"
                            value={formData.age}
                            onChange={(e) => update('age', e.target.value)}
                            min="13"
                            max="120"
                        />
                    </div>
                    <div>
                        <label className="text-sm font-medium text-gray-700 dark:text-gray-300 block mb-1">
                            Height (cm)
                        </label>
                        <Input
                            type="number"
                            value={formData.height}
                            onChange={(e) => update('height', e.target.value)}
                        />
                    </div>
                    <div>
                        <label className="text-sm font-medium text-gray-700 dark:text-gray-300 block mb-1">
                            Current Weight (kg)
                        </label>
                        <Input
                            type="number"
                            step="0.1"
                            value={formData.currentWeight}
                            onChange={(e) => update('currentWeight', e.target.value)}
                        />
                    </div>
                    <div>
                        <label className="text-sm font-medium text-gray-700 dark:text-gray-300 block mb-1">
                            Target Weight (kg)
                        </label>
                        <Input
                            type="number"
                            step="0.1"
                            value={formData.targetWeight}
                            onChange={(e) => update('targetWeight', e.target.value)}
                        />
                    </div>
                </div>
            </Card>

            {/* Goal */}
            <Card className="p-6 space-y-4">
                <h3 className="font-bold text-gray-900 dark:text-white">Your Goal</h3>
                <div className="grid grid-cols-3 gap-3">
                    {[
                        { value: 'lose_weight', icon: '🎯', label: 'Lose Weight' },
                        { value: 'gain_muscle', icon: '💪', label: 'Build Muscle' },
                        { value: 'maintain', icon: '⚖️', label: 'Maintain' },
                    ].map((goal) => (
                        <button
                            key={goal.value}
                            onClick={() => update('goalType', goal.value)}
                            className={`p-4 rounded-xl border-2 text-center transition-all ${formData.goalType === goal.value
                                ? 'border-green-600 bg-green-50 dark:bg-green-900/20'
                                : 'border-gray-200 hover:border-gray-300 dark:border-gray-700'
                                }`}
                        >
                            <div className="text-2xl mb-1">{goal.icon}</div>
                            <div className="text-sm font-semibold text-gray-900 dark:text-white">
                                {goal.label}
                            </div>
                            {formData.goalType === goal.value && (
                                <div className="text-green-600 text-xs mt-1">✓ Selected</div>
                            )}
                        </button>
                    ))}
                </div>
            </Card>

            {/* Activity Level */}
            <Card className="p-6 space-y-4">
                <h3 className="font-bold text-gray-900 dark:text-white">Activity Level</h3>
                <div className="space-y-2">
                    {[
                        { value: 'sedentary', label: 'Sedentary', desc: 'Little or no exercise' },
                        { value: 'lightly_active', label: 'Lightly Active', desc: '1-3 days/week' },
                        { value: 'moderately_active', label: 'Moderately Active', desc: '3-5 days/week' },
                        { value: 'very_active', label: 'Very Active', desc: '6-7 days/week' },
                        { value: 'extra_active', label: 'Extra Active', desc: 'Physical job + exercise' },
                    ].map((level) => (
                        <button
                            key={level.value}
                            onClick={() => update('activityLevel', level.value)}
                            className={`w-full p-3 rounded-xl border-2 text-left transition-all ${formData.activityLevel === level.value
                                ? 'border-green-600 bg-green-50 dark:bg-green-900/20'
                                : 'border-gray-200 hover:border-gray-300 dark:border-gray-700'
                                }`}
                        >
                            <div className="flex justify-between items-center">
                                <div>
                                    <span className="font-semibold text-gray-900 dark:text-white text-sm">
                                        {level.label}
                                    </span>
                                    <span className="text-gray-500 dark:text-gray-400 text-sm ml-2">
                                        {level.desc}
                                    </span>
                                </div>
                                {formData.activityLevel === level.value && (
                                    <span className="text-green-600">✓</span>
                                )}
                            </div>
                        </button>
                    ))}
                </div>
            </Card>

            {/* Dietary Preferences */}
            <Card className="p-6 space-y-4">
                <h3 className="font-bold text-gray-900 dark:text-white">Dietary Preferences</h3>
                <div className="grid grid-cols-2 gap-2">
                    {['Vegetarian', 'Vegan', 'Keto', 'Paleo', 'Gluten-Free', 'Dairy-Free'].map((pref) => (
                        <button
                            key={pref}
                            onClick={() => togglePref(pref)}
                            className={`p-3 rounded-lg border-2 font-medium text-sm transition-all ${formData.dietaryPrefs.includes(pref)
                                ? 'border-green-600 bg-green-50 text-green-700 dark:bg-green-900/20'
                                : 'border-gray-200 text-gray-700 dark:text-gray-300 dark:border-gray-700'
                                }`}
                        >
                            {pref} {formData.dietaryPrefs.includes(pref) && '✓'}
                        </button>
                    ))}
                </div>

                <div>
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300 block mb-1">
                        Allergies (comma separated)
                    </label>
                    <Input
                        placeholder="e.g. Peanuts, Shellfish"
                        value={formData.allergies}
                        onChange={(e) => update('allergies', e.target.value)}
                    />
                </div>
            </Card>

            {/* Save Button */}
            {error && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                    {error}
                </div>
            )}

            {saved && (
                <div className="p-3 bg-green-50 border border-green-200 rounded-lg text-green-700 text-sm">
                    ✅ Profile updated! Macros recalculated.
                </div>
            )}

            <Button
                onClick={handleSave}
                disabled={isSaving}
                className="w-full bg-green-600 hover:bg-green-700"
                size="lg"
            >
                {isSaving ? 'Saving...' : '💾 Save & Recalculate Macros'}
            </Button>
        </div>
    )
}