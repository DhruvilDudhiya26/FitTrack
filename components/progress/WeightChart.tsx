'use client'

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { format } from 'date-fns'

interface WeightLog {
    _id: string
    weight: number
    loggedAt: string
}

interface WeightChartProps {
    logs: WeightLog[]
    targetWeight: number
}

export function WeightChart({ logs, targetWeight }: WeightChartProps) {
    if (logs.length === 0) {
        return (
            <div className="bg-gray-50 rounded-lg p-12 text-center">
                <p className="text-gray-600">No weight data yet. Start logging to see your progress!</p>
            </div>
        )
    }

    // Format data for chart
    const chartData = logs.map(log => ({
        date: format(new Date(log.loggedAt), 'MMM dd'),
        weight: log.weight,
    }))

    // Add target weight line data
    const targetData = chartData.map(d => ({
        ...d,
        target: targetWeight,
    }))

    const minWeight = Math.min(...logs.map(l => l.weight))
    const maxWeight = Math.max(...logs.map(l => l.weight))
    const yAxisMin = Math.floor(Math.min(minWeight, targetWeight) - 2)
    const yAxisMax = Math.ceil(Math.max(maxWeight, targetWeight) + 2)

    return (
        <div className="bg-white rounded-xl p-6 shadow-sm">
            <h3 className="font-bold text-gray-900 mb-4">Weight Trend</h3>
            <ResponsiveContainer width="100%" height={300}>
                <LineChart data={targetData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis
                        dataKey="date"
                        tick={{ fontSize: 12 }}
                    />
                    <YAxis
                        domain={[yAxisMin, yAxisMax]}
                        tick={{ fontSize: 12 }}
                        label={{ value: 'kg', angle: -90, position: 'insideLeft' }}
                    />
                    <Tooltip
                        contentStyle={{ backgroundColor: '#fff', border: '1px solid #ccc' }}
                    />
                    <Line
                        type="monotone"
                        dataKey="weight"
                        stroke="#10b981"
                        strokeWidth={3}
                        dot={{ fill: '#10b981', r: 4 }}
                        activeDot={{ r: 6 }}
                    />
                    <Line
                        type="monotone"
                        dataKey="target"
                        stroke="#f59e0b"
                        strokeWidth={2}
                        strokeDasharray="5 5"
                        dot={false}
                    />
                </LineChart>
            </ResponsiveContainer>
            <div className="flex gap-4 mt-4 text-sm">
                <div className="flex items-center gap-2">
                    <div className="w-4 h-0.5 bg-green-500"></div>
                    <span className="text-gray-600">Your Weight</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-4 h-0.5 bg-orange-500 border-dashed"></div>
                    <span className="text-gray-600">Target Weight</span>
                </div>
            </div>
        </div>
    )
}