'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useUser } from '@/hooks/use-user'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Form, FormField, FormLabel, FormMessage } from '@/components/ui/form'
import { ProgressIndicator } from '@/components/onboarding/ProgressIndicator'
import { StepIndicator } from '@/components/onboarding/StepIndicator'
import { createUserProfile } from '@/server/actions/Profile/create-profile'


export default function OnboardingPage() {
    const router = useRouter()
    const { user } = useUser()
    const [step, setStep] = useState(1)
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState('')

    // Form data
    const [formData, setFormData] = useState({
        age: '',
        gender: '',
        currentWeight: '',
        targetWeight: '',
        height: '',
        goalType: '',
        activityLevel: '',
        dietaryPrefs: [] as string[],
        allergies: '',
    })

    const updateFormData = (field: string, value: any) => {
        setFormData(prev => ({ ...prev, [field]: value }))
    }

    const handleNext = () => {
        setError('')
        if (step < 4) {
            setStep(step + 1)
        }
    }

    const handleBack = () => {
        setError('')
        if (step > 1) {
            setStep(step - 1)
        }
    }

    const handleSubmit = async () => {
        console.log("user", user)
        if (!user?.id) return

        setIsLoading(true)
        setError('')

        try {
            const result = await createUserProfile({
                userId: user.id,
                age: parseInt(formData.age),
                gender: formData.gender as 'male' | 'female' | 'other',
                currentWeight: parseFloat(formData.currentWeight),
                targetWeight: parseFloat(formData.targetWeight),
                height: parseFloat(formData.height),
                activityLevel: formData.activityLevel,
                goalType: formData.goalType as 'lose_weight' | 'gain_muscle' | 'maintain',
                dietaryPrefs: formData.dietaryPrefs,
                allergies: formData.allergies ? formData.allergies.split(',').map(a => a.trim()) : [],
            })

            if (!result.success) {
                setError(result.error || 'Failed to save profile')
                setIsLoading(false)
                return
            }

            // Success! Redirect to dashboard
            router.push('/dashboard')
        } catch (error) {
            setError('Something went wrong. Please try again.')
            setIsLoading(false)
        }
    }

    return (
        <Card className="w-full max-w-2xl">
            <CardHeader>
                <ProgressIndicator currentStep={step} totalSteps={4} />
            </CardHeader>
            <CardContent>
                {/* STEP 1: Personal Info */}
                {step === 1 && (
                    <div>
                        <StepIndicator
                            step={1}
                            title="Personal Information"
                            description="Tell us about yourself"
                        />
                        <Form onSubmit={(e) => { e.preventDefault(); handleNext(); }}>
                            <div className="grid grid-cols-2 gap-4">
                                <FormField>
                                    <FormLabel htmlFor="age">Age</FormLabel>
                                    <Input
                                        id="age"
                                        type="number"
                                        placeholder="25"
                                        value={formData.age}
                                        onChange={(e) => updateFormData('age', e.target.value)}
                                        required
                                        min="13"
                                        max="120"
                                    />
                                </FormField>

                                <FormField>
                                    <FormLabel htmlFor="gender">Gender</FormLabel>
                                    <select
                                        id="gender"
                                        className="flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                                        value={formData.gender}
                                        onChange={(e) => updateFormData('gender', e.target.value)}
                                        required
                                    >
                                        <option value="">Select...</option>
                                        <option value="male">Male</option>
                                        <option value="female">Female</option>
                                        <option value="other">Other</option>
                                    </select>
                                </FormField>

                                <FormField>
                                    <FormLabel htmlFor="currentWeight">Current Weight (kg)</FormLabel>
                                    <Input
                                        id="currentWeight"
                                        type="number"
                                        step="0.1"
                                        placeholder="75"
                                        value={formData.currentWeight}
                                        onChange={(e) => updateFormData('currentWeight', e.target.value)}
                                        required
                                        min="20"
                                        max="500"
                                    />
                                </FormField>

                                <FormField>
                                    <FormLabel htmlFor="height">Height (cm)</FormLabel>
                                    <Input
                                        id="height"
                                        type="number"
                                        placeholder="175"
                                        value={formData.height}
                                        onChange={(e) => updateFormData('height', e.target.value)}
                                        required
                                        min="100"
                                        max="300"
                                    />
                                </FormField>
                            </div>

                            <div className="flex justify-end mt-6">
                                <Button type="submit" className="bg-green-600 hover:bg-green-700">
                                    Next
                                </Button>
                            </div>
                        </Form>
                    </div>
                )}

                {/* STEP 2: Goals */}
                {step === 2 && (
                    <div>
                        <StepIndicator
                            step={2}
                            title="Your Goals"
                            description="What do you want to achieve?"
                        />
                        <Form onSubmit={(e) => { e.preventDefault(); handleNext(); }}>
                            <FormField>
                                <FormLabel>Primary Goal</FormLabel>
                                <div className="space-y-3 mt-2">
                                    {[
                                        { value: 'lose_weight', icon: '🎯', title: 'Lose Weight', desc: 'Calorie deficit plan' },
                                        { value: 'gain_muscle', icon: '💪', title: 'Build Muscle', desc: 'Calorie surplus plan' },
                                        { value: 'maintain', icon: '⚖️', title: 'Maintain Weight', desc: 'Stay at current weight' },
                                    ].map((goal) => (
                                        <button
                                            key={goal.value}
                                            type="button"
                                            onClick={() => updateFormData('goalType', goal.value)}
                                            className={`w-full p-4 rounded-xl border-2 text-left transition-all ${formData.goalType === goal.value
                                                ? 'border-green-600 bg-green-50'
                                                : 'border-gray-300 hover:border-gray-400'
                                                }`}
                                        >
                                            <div className="flex items-start">
                                                <span className="text-3xl mr-4">{goal.icon}</span>
                                                <div>
                                                    <div className="font-semibold text-gray-900">{goal.title}</div>
                                                    <div className="text-sm text-gray-600">{goal.desc}</div>
                                                </div>
                                                {formData.goalType === goal.value && (
                                                    <span className="ml-auto text-green-600 text-xl">✓</span>
                                                )}
                                            </div>
                                        </button>
                                    ))}
                                </div>
                            </FormField>

                            <FormField className="mt-4">
                                <FormLabel htmlFor="targetWeight">Target Weight (kg)</FormLabel>
                                <Input
                                    id="targetWeight"
                                    type="number"
                                    step="0.1"
                                    placeholder="70"
                                    value={formData.targetWeight}
                                    onChange={(e) => updateFormData('targetWeight', e.target.value)}
                                    required
                                    min="20"
                                    max="500"
                                />
                            </FormField>

                            {error && <FormMessage>{error}</FormMessage>}

                            <div className="flex justify-between mt-6">
                                <Button type="button" variant="outline" onClick={handleBack}>
                                    Back
                                </Button>
                                <Button type="submit" className="bg-green-600 hover:bg-green-700">
                                    Next
                                </Button>
                            </div>
                        </Form>
                    </div>
                )}

                {/* STEP 3: Activity Level */}
                {step === 3 && (
                    <div>
                        <StepIndicator
                            step={3}
                            title="Activity Level"
                            description="How active are you?"
                        />
                        <Form onSubmit={(e) => { e.preventDefault(); handleNext(); }}>
                            <FormField>
                                <div className="space-y-3">
                                    {[
                                        { value: 'sedentary', title: 'Sedentary', desc: 'Little or no exercise' },
                                        { value: 'lightly_active', title: 'Lightly Active', desc: 'Light exercise 1-3 days/week' },
                                        { value: 'moderately_active', title: 'Moderately Active', desc: 'Moderate exercise 3-5 days/week' },
                                        { value: 'very_active', title: 'Very Active', desc: 'Hard exercise 6-7 days/week' },
                                        { value: 'extra_active', title: 'Extra Active', desc: 'Very hard exercise & physical job' },
                                    ].map((level) => (
                                        <button
                                            key={level.value}
                                            type="button"
                                            onClick={() => updateFormData('activityLevel', level.value)}
                                            className={`w-full p-4 rounded-xl border-2 text-left transition-all ${formData.activityLevel === level.value
                                                ? 'border-green-600 bg-green-50'
                                                : 'border-gray-300 hover:border-gray-400'
                                                }`}
                                        >
                                            <div className="flex items-start justify-between">
                                                <div>
                                                    <div className="font-semibold text-gray-900">{level.title}</div>
                                                    <div className="text-sm text-gray-600">{level.desc}</div>
                                                </div>
                                                {formData.activityLevel === level.value && (
                                                    <span className="text-green-600 text-xl">✓</span>
                                                )}
                                            </div>
                                        </button>
                                    ))}
                                </div>
                            </FormField>

                            <div className="flex justify-between mt-6">
                                <Button type="button" variant="outline" onClick={handleBack}>
                                    Back
                                </Button>
                                <Button type="submit" className="bg-green-600 hover:bg-green-700">
                                    Next
                                </Button>
                            </div>
                        </Form>
                    </div>
                )}

                {/* STEP 4: Dietary Preferences */}
                {step === 4 && (
                    <div>
                        <StepIndicator
                            step={4}
                            title="Dietary Preferences"
                            description="Almost done!"
                        />
                        <Form onSubmit={(e) => { e.preventDefault(); handleSubmit(); }}>
                            <FormField>
                                <FormLabel>Dietary Preferences (Optional)</FormLabel>
                                <div className="grid grid-cols-2 gap-3 mt-2">
                                    {['Vegetarian', 'Vegan', 'Keto', 'Paleo', 'Gluten-Free', 'Dairy-Free'].map((pref) => (
                                        <button
                                            key={pref}
                                            type="button"
                                            onClick={() => {
                                                const prefs = formData.dietaryPrefs.includes(pref)
                                                    ? formData.dietaryPrefs.filter(p => p !== pref)
                                                    : [...formData.dietaryPrefs, pref]
                                                updateFormData('dietaryPrefs', prefs)
                                            }}
                                            className={`p-3 rounded-lg border-2 font-medium transition-all ${formData.dietaryPrefs.includes(pref)
                                                ? 'border-green-600 bg-green-50 text-green-700'
                                                : 'border-gray-300 text-gray-700 hover:border-gray-400'
                                                }`}
                                        >
                                            {pref}
                                            {formData.dietaryPrefs.includes(pref) && ' ✓'}
                                        </button>
                                    ))}
                                </div>
                            </FormField>

                            <FormField className="mt-4">
                                <FormLabel htmlFor="allergies">Allergies (Optional)</FormLabel>
                                <Input
                                    id="allergies"
                                    type="text"
                                    placeholder="e.g., Peanuts, Shellfish (comma separated)"
                                    value={formData.allergies}
                                    onChange={(e) => updateFormData('allergies', e.target.value)}
                                />
                            </FormField>

                            {error && <FormMessage>{error}</FormMessage>}

                            <div className="flex justify-between mt-6">
                                <Button type="button" variant="outline" onClick={handleBack} disabled={isLoading}>
                                    Back
                                </Button>
                                <Button
                                    type="submit"
                                    className="bg-green-600 hover:bg-green-700"
                                    disabled={isLoading}
                                >
                                    {isLoading ? 'Setting up...' : 'Complete Setup'}
                                </Button>
                            </div>
                        </Form>
                    </div>
                )}
            </CardContent>
        </Card>
    )
}