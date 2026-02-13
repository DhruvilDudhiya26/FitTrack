interface ProgressIndicatorProps {
    currentStep: number
    totalSteps: number
}

export function ProgressIndicator({ currentStep, totalSteps }: ProgressIndicatorProps) {
    return (
        <div className="flex gap-2 mb-6">
            {Array.from({ length: totalSteps }).map((_, index) => (
                <div
                    key={index}
                    className={`h-1 flex-1 rounded-full transition-colors ${index < currentStep ? 'bg-green-600' : 'bg-gray-300'
                        }`}
                />
            ))}
        </div>
    )
}