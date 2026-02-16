import Food from "@/models/Food"
import dbConnect from "./mongodb"


const sampleFoods = [
    {
        name: 'Chicken Breast',
        brand: 'Generic',
        servingSize: 100,
        servingUnit: 'g',
        calories: 165,
        protein: 31,
        carbs: 0,
        fats: 3.6,
        verified: true,
    },
    {
        name: 'White Rice',
        brand: 'Generic',
        servingSize: 100,
        servingUnit: 'g',
        calories: 130,
        protein: 2.7,
        carbs: 28,
        fats: 0.3,
        verified: true,
    },
    {
        name: 'Broccoli',
        brand: 'Generic',
        servingSize: 100,
        servingUnit: 'g',
        calories: 34,
        protein: 2.8,
        carbs: 7,
        fats: 0.4,
        verified: true,
    },
    {
        name: 'Banana',
        brand: 'Generic',
        servingSize: 118,
        servingUnit: 'g',
        calories: 105,
        protein: 1.3,
        carbs: 27,
        fats: 0.4,
        verified: true,
    },
    {
        name: 'Eggs',
        brand: 'Generic',
        servingSize: 50,
        servingUnit: 'g',
        calories: 72,
        protein: 6.3,
        carbs: 0.4,
        fats: 4.8,
        verified: true,
    },
    {
        name: 'Oatmeal',
        brand: 'Generic',
        servingSize: 40,
        servingUnit: 'g',
        calories: 150,
        protein: 5,
        carbs: 27,
        fats: 3,
        verified: true,
    },
    {
        name: 'Greek Yogurt',
        brand: 'Generic',
        servingSize: 170,
        servingUnit: 'g',
        calories: 100,
        protein: 17,
        carbs: 6,
        fats: 0.7,
        verified: true,
    },
    {
        name: 'Salmon',
        brand: 'Generic',
        servingSize: 100,
        servingUnit: 'g',
        calories: 206,
        protein: 22,
        carbs: 0,
        fats: 13,
        verified: true,
    },
    {
        name: 'Sweet Potato',
        brand: 'Generic',
        servingSize: 100,
        servingUnit: 'g',
        calories: 86,
        protein: 1.6,
        carbs: 20,
        fats: 0.1,
        verified: true,
    },
    {
        name: 'Almonds',
        brand: 'Generic',
        servingSize: 28,
        servingUnit: 'g',
        calories: 164,
        protein: 6,
        carbs: 6,
        fats: 14,
        verified: true,
    },
]

export async function seedFoods() {
    try {
        await dbConnect()

        // Clear existing foods (optional)
        await Food.deleteMany({ verified: true })

        // Insert sample foods
        await Food.insertMany(sampleFoods)

        console.log('✅ Sample foods seeded successfully!')
        return { success: true }
    } catch (error) {
        console.error('❌ Error seeding foods:', error)
        return { success: false, error }
    }
}