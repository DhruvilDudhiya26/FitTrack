'use client'

import { format } from 'date-fns'
import { Button } from '@/components/ui/button'
import { deleteWeightLog } from '@/server/actions/progress/delete-weight-log'
import { useRouter } from 'next/navigation'

interface WeightLog {
    _id: string
    weight: number
    note?: string
    loggedAt: string
}

interface WeightHistoryProps {
    logs: WeightLog[]
}

export function WeightHistory({ logs }: WeightHistoryProps) {
    const router = useRouter()

    const handleDelete = async (logId: string) => {
        if (!confirm('Delete this weight entry?')) return

        const result = await deleteWeightLog(logId)

        if (result.success) {
            router.refresh()
        } else {
            alert('Failed to delete')
        }
    }

    if (logs.length === 0) {
        return (
            <div className="bg-gray-50 rounded-lg p-6 text-center">
                <p className="text-gray-600">No weight logs yet</p>
            </div>
        )
    }

    return (
        <div className="space-y-2">
            {logs.slice(0, 10).map((log) => (
                <div
                    key={log._id}
                    className="bg-white rounded-lg p-4 flex justify-between items-center border border-gray-200"
                >
                    <div>
                        <p className="font-semibold text-gray-900">{log.weight} kg</p>
                        <p className="text-sm text-gray-600">
                            {format(new Date(log.loggedAt), 'MMM dd, yyyy')}
                        </p>
                        {log.note && (
                            <p className="text-sm text-gray-500 mt-1">{log.note}</p>
                        )}
                    </div>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDelete(log._id)}
                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                    >
                        Delete
                    </Button>
                </div>
            ))}
        </div>
    )
}