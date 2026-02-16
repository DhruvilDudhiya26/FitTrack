import Anthropic from '@anthropic-ai/sdk'

interface GenerateMealPlanParams {
    targetCalories: number
    targetProtein: number
    targetCarbs: number
    targetFats: number
    goalType: 'lose_weight' | 'gain_muscle' | 'maintain'
    dietaryPrefs: string[]
    allergies: string[]
    daysCount?: number
}

interface Meal {
    name: string
    description: string
    calories: number
    protein: number
    carbs: number
    fats: number
    ingredients: string[]
    instructions: string[]
}

interface DayPlan {
    day: string
    breakfast: Meal
    lunch: Meal
    dinner: Meal
    snacks: Meal[]
    totalCalories: number
    totalProtein: number
    totalCarbs: number
    totalFats: number
}

export async function generateMealPlan(params: GenerateMealPlanParams) {

    const anthropic = new Anthropic({
        apiKey: process.env.ANTHROPIC_API_KEY!,
    })

    const {
        targetCalories,
        targetProtein,
        targetCarbs,
        targetFats,
        goalType,
        dietaryPrefs,
        allergies,
        daysCount = 7
    } = params

    const goalDescription = {
        lose_weight: "weight loss with a calorie deficit",
        gain_muscle: "muscle building with a calorie surplus",
        maintain: "maintaining current weight",
    }[goalType]

    const prompt = `you are a professional nutritionist creating a ${daysCount} day meal plan .
    ** User's Daily Targets : **
    - Calories : ${targetCalories}kcal
    - Protein : ${targetProtein}g
    - Carbs : ${targetCarbs}g
    - Fats : ${targetFats}g
    - Goal : ${goalDescription}
    **Dietary Restrictions:**
    ${dietaryPrefs.length > 0 ? `- Dietary preferences: ${dietaryPrefs.join(', ')}` : `- No dietary Preferences`}
    ${allergies.length > 0 ? `- Allergies: ${allergies.join(', ')}` : `- No allergies`}

    **REquirements:**
    1. Create a ${daysCount}-day meal plan with breakfast , lunch , dinner , and 1-2 snacks per day
    2. Each meal should have detailed ingredients list and simple cooking instructions
    3. Daily totals should be within ±50 calories of the target
    4. Prioritize high protein meals
    5. Include variety - different meals each day
    6. Keep meals realistic and easy to prepare
    7. Respect all dietary preferences and avoid allergens

    **Output Format (JSON only , no markdown): **
    \`\`\`json
    [{
    "day" : "Monday",
    "breakfast" : {
    "name" : "Meal name",
    "description" : "Brief description",
    "calories" : 400,
    "protein" : 30,
    "carbs" : 40,
    "fats" : 10,
    "ingredients" : ["ingredient 1" , "ingredient 2"],
    "instructions": ["step 1" , "step 2"]
      },
    "lunch": { /* same structure */ },
    "dinner": { /* same structure */ },
    "snacks": [{ /* same structure */ }],
      "totalCalories": 2000,
    "totalProtein": 150,
    "totalCarbs": 250,
    "totalFats": 65
     }
    ]\`\`\`

    Generate the meal plan now.`

    try {
        const message = await anthropic.messages.create({
            model: 'claude-sonnet-4-20250514',
            max_tokens: 8000,
            messages: [
                {
                    role: 'user',
                    content: prompt,
                }
            ]
        })
        const content = message.content[0]
        if (content.type !== 'text') {
            throw new Error('unexpected response type')
        }
        let jsonText = content.text
        jsonText = jsonText.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();

        const mealPlan: DayPlan[] = JSON.parse(jsonText)
        return mealPlan
    } catch (error) {
        console.error('Error generating meal plan:', error)
        throw new Error('Failed to generate meal plan')

    }
}

// Generate a single day's meals (for regenerate feature)
export async function generateSingleDay(params: GenerateMealPlanParams & { dayName: string }): Promise<DayPlan> {
    const mealPlan = await generateMealPlan({ ...params, daysCount: 1 })
    const dayPlan = mealPlan[0]
    dayPlan.day = params.dayName
    return dayPlan
}