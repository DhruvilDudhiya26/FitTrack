interface MacroCardProps {
    label: string
    current: number
    target: number
    unit?: string
    color?: string
}

export function MacroCard({ label, current, target, unit = 'g', color = 'green' }: MacroCardProps) {
    const percentage = Math.min(Math.round((current / target) * 100), 100)

    const colorClasses = {
        green: 'bg-green-500',
        blue: 'bg-blue-500',
        orange: 'bg-orange-500',
        purple: 'bg-purple-500',
    }

    return (
        <div className="space-y-2">
            <div className="flex justify-between text-sm">
                <span className="text-gray-600">{label}</span>
                <span className="font-semibold text-gray-900">
                    {current}{unit} / {target}{unit}
                </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div
                    className={`${colorClasses[color as keyof typeof colorClasses]} h-2.5 rounded-full transition-all duration-300`}
                    style={{ width: `${percentage}%` }}
                />
            </div>
        </div>
    )
}