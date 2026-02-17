import Link from 'next/link'
import { Button } from '@/components/ui/button'

export function QuickActions() {
    return (
        <div className="grid grid-cols-2 gap-3">
            <Link href="/food/add">
                <Button className="w-full h-24 flex flex-col gap-2 bg-green-50 hover:bg-green-100 text-green-700 border-2 border-green-200">
                    <span className="text-3xl">🍽️</span>
                    <span className="font-semibold">Log Meal</span>
                </Button>
            </Link>
            <Link href="/food/logs">
                <Button className="w-full h-24 flex flex-col gap-2 bg-blue-50 hover:bg-blue-100 text-blue-700 border-2 border-blue-200">
                    <span className="text-3xl">📋</span>
                    <span className="font-semibold">View Logs</span>
                </Button>
            </Link>
        </div>
    )
}