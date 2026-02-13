'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'

export function BottomNav() {
    const pathname = usePathname()

    const navItems = [
        { href: '/dashboard', label: 'Home', icon: '🏠' },
        { href: '/progress', label: 'Progress', icon: '📊' },
        { href: '/meals', label: 'Meals', icon: '🍴' },
        { href: '/workouts', label: 'Workout', icon: '💪' },
    ]

    return (
        <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 pb-safe">
            <div className="w-full max-w-lg mx-auto px-3">
                <div className="grid grid-cols-4 gap-1">
                    {navItems.map((item) => {
                        const isActive = pathname === item.href
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={cn(
                                    'flex flex-col items-center justify-center py-3 px-2 transition-colors',
                                    isActive
                                        ? 'text-green-600'
                                        : 'text-gray-600 hover:text-gray-900'
                                )}
                            >
                                <span className="text-2xl mb-1">{item.icon}</span>
                                <span className={cn(
                                    'text-xs font-medium',
                                    isActive && 'text-green-600'
                                )}>
                                    {item.label}
                                </span>
                            </Link>
                        )
                    })}
                </div>
            </div>
        </nav>
    )
}