interface TDEEParams {
    weight: number // in kg
    height: number // in cm
    age: number
    gender: 'male' | 'female' | 'other'
    activityLevel: string
}

// Mifflin-St Jeor Equation
export function calculateBMR(params: TDEEParams): number {
    const { weight, height, age, gender } = params

    if (gender === 'male') {
        return 10 * weight + 6.25 * height - 5 * age + 5
    } else if (gender === 'female') {
        return 10 * weight + 6.25 * height - 5 * age - 161
    } else {
        // Use average for 'other'
        return 10 * weight + 6.25 * height - 5 * age - 78
    }
}

export function calculateTDEE(params: TDEEParams): number {
    const bmr = calculateBMR(params)

    const activityMultipliers: Record<string, number> = {
        sedentary: 1.2,           // Little/no exercise
        lightly_active: 1.375,    // Light exercise 1-3 days/week
        moderately_active: 1.55,  // Moderate exercise 3-5 days/week
        very_active: 1.725,       // Hard exercise 6-7 days/week
        extra_active: 1.9,        // Very hard exercise, physical job
    }

    const multiplier = activityMultipliers[params.activityLevel] || 1.2

    return Math.round(bmr * multiplier)
}

export function calculateMacros(
    tdee: number,
    goalType: 'lose_weight' | 'gain_muscle' | 'maintain'
) {
    let calories = tdee

    // Adjust calories based on goal
    if (goalType === 'lose_weight') {
        calories = tdee - 500 // 500 calorie deficit (1 lb/week loss)
    } else if (goalType === 'gain_muscle') {
        calories = tdee + 300 // 300 calorie surplus (lean bulk)
    }

    // Macro split: 30% protein, 40% carbs, 30% fats
    const protein = Math.round((calories * 0.30) / 4) // 4 calories per gram
    const carbs = Math.round((calories * 0.40) / 4)
    const fats = Math.round((calories * 0.30) / 9) // 9 calories per gram

    return {
        calories: Math.round(calories),
        protein,
        carbs,
        fats,
    }
}