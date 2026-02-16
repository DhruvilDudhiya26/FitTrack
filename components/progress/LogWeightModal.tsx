'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card } from '@/components/ui/card'
import { logWeight } from '@/server/actions/progress/log-weight'
import { useRouter } from 'next/navigation'

interface LogWeightModalProps {
    userId: string
    onClose: () => void
}

export function LogWeightModal({ userId, onClose }: LogWeightModalProps) {
    const router = useRouter()
    const [weight, setWeight] = useState('')
    const [note, setNote] = useState('')
    const [isLogging, setIsLogging] = useState(false)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        if (!weight || parseFloat(weight) < 20 || parseFloat(weight) > 500) {
            alert('Please enter a valid weight between 20-500 kg')
            return
        }

        setIsLogging(true)

        const result = await logWeight({
            userId,
            weight: parseFloat(weight),
            note: note.trim() || undefined,
        })

        setIsLogging(false)

        if (result.success) {
            onClose()
            router.refresh()
        } else {
            alert(result.error || 'Failed to log weight')
        }
    }

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <Card className="w-full max-w-md p-6">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-xl font-bold text-gray-900">Log Weight</h3>
                    <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
                        ✕
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="text-sm font-medium text-gray-700 block mb-2">
                            Weight (kg)
                        </label>
                        <Input
                            type="number"
                            step="0.1"
                            min="20"
                            max="500"
                            placeholder="75.5"
                            value={weight}
                            onChange={(e) => setWeight(e.target.value)}
                            required
                            autoFocus
                        />
                    </div>

                    <div>
                        <label className="text-sm font-medium text-gray-700 block mb-2">
                            Note (Optional)
                        </label>
                        <Input
                            type="text"
                            placeholder="Feeling good today!"
                            value={note}
                            onChange={(e) => setNote(e.target.value)}
                            maxLength={200}
                        />
                    </div>

                    <div className="flex gap-2">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={onClose}
                            className="flex-1"
                            disabled={isLogging}
                        >
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            className="flex-1 bg-green-600 hover:bg-green-700"
                            disabled={isLogging}
                        >
                            {isLogging ? 'Logging...' : 'Log Weight'}
                        </Button>
                    </div>
                </form>
            </Card>
        </div>
    )
}