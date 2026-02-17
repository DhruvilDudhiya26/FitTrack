import Anthropic from "@anthropic-ai/sdk"

interface GenerateWorkoutParams {
    experienceLevel: 'beginner' | 'intermediate' | 'advanced'
    daysPerWeek: number
    equipment: string[]
    focusAreas: string[]
    goalType: 'lose_weight' | 'gain_muscle' | 'maintain'
}

interface WorkoutDay {
    day: string
    name: string
    type: string
    duration: string
    warmup: string[]
    exercises: Exercises[]
    cooldown: string[]
    notes?: string

}

interface Exercises {
    name: string
    sets: number
    reps: string
    rest: string
    muscleGroup: string[]
    instructions: string[]
    tips?: string
}


export async function generateWorkoutPlan(params: GenerateWorkoutParams) {
    const anthropic = new Anthropic({
        apiKey: process.env.ANTHROPIC_API_KEY!,
    })

    const { experienceLevel, daysPerWeek, equipment, focusAreas, goalType } = params

    const goalDescription = {
        lose_weight: 'fat loss with cardio emphasis and metabolic conditioning',
        gain_muscle: 'muscle hypertrophy and strength building',
        maintain: 'general fitness and maintenance'
    }[goalType]

    const equipmentList = equipment.length > 0 ? equipment.join(', ') : 'bodyweight only (no equipment)'

    const focusList = focusAreas.length > 0 ? focusAreas.join(', ') : 'full body balanced development'

    const prompt = `You are an expert personal trainer. Create a ${daysPerWeek}-day workout plan.

    **User Profile:**
    - Experience Level : ${experienceLevel}
    - Goal : ${goalDescription}
    - Available Equipment : ${equipmentList}
    - Focus Areas : ${focusList}
    - Days Per Week : ${daysPerWeek}

    **Requirements:**
    1. Create exactly ${daysPerWeek} workout days
    2. Each exercise must include sets, reps , rest period ,and step-by-step instructions
    3. Include warm-up and cool-down for each day
    4. Match exercises to available equipment ONLY
    5. Appropriate difficulty for ${experienceLevel} level
    6. Progressive structure across the week
    7. Include muscle groups targeted for each exercise
    8. Add helpful tips where relevant

    **Output Format (JSON only , no markdown):**
    [
    {
    "day": "Day 1",
    "name": "Push Day",
    "type": "Upper Body Push",
    "duration": "45-60 minutes",
    "warmup": ["5 min light cardio", "arm circles 10x each direction"],
      "exercises": [
      {
        "name": "Push-ups",
        "sets": 3,
        "reps": "10-15",
        "rest": "60 seconds",
        "muscleGroups": ["chest", "shoulders", "triceps"],
        "instructions": [
          "Start in plank position with hands shoulder-width apart",
          "Lower chest toward floor keeping body straight",
          "Push back up to start position"
        ],
        "tips": "Keep core engaged throughout the movement"
      }
    ],
    "cooldown": ["chest stretch 30 seconds each side", "shoulder stretch"],
    "notes": "Focus on controlled movement over speed"
    }
    ]
    Generate the ${daysPerWeek}-day workout plan now.`

    try {
        const message = await anthropic.messages.create({
            model: 'claude-sonnet-4-20250514',
            max_tokens: 8000,
            messages: [{ role: 'user', content: prompt }],
        })

        const content = message.content[0]
        if (content.type !== 'text') {
            throw new Error('Unexpected response type')
        }

        // clean up JSON
        let jsonText = content.text
        jsonText = jsonText.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim()

        const workoutPlan: WorkoutDay[] = JSON.parse(jsonText)
        return workoutPlan
    } catch (error) {
        console.error('Error generating workout plan:', error)
        throw new Error('Failed to generate workout plan')
    }
}

export async function regenerateWorkoutDay(params: GenerateWorkoutParams, dayName: string): Promise<WorkoutDay> {
    const plan = await generateWorkoutPlan({ ...params, daysPerWeek: 1 })
    const day = plan[0]
    day.day = dayName

    return day
}