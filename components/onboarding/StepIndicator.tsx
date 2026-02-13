interface StepIndicatorProps {
    step: number
    title: string
    description: string
}

export function StepIndicator({ step, title, description }: StepIndicatorProps) {
    return (
        <div className="text-center mb-8">
            <div className="text-sm text-gray-500 mb-2">Step {step} of 4</div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">{title}</h2>
            <p className="text-gray-600">{description}</p>
        </div>
    )
}