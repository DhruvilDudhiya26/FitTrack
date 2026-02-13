'use client'

import { useUser } from '@/hooks/use-user'
import { Button } from '@/components/ui/button'
import { signOut } from 'next-auth/react'

export function Header() {
    const { user } = useUser()

    return (
        <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
            <div className="w-full max-w-lg mx-auto px-3">
                <div className="flex justify-between items-center h-16">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">FitTrack</h1>
                    </div>
                    <div className="flex items-center gap-4">
                        <span className="text-sm text-gray-600">
                            Hi, {user?.name || 'User'}!
                        </span>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => signOut({ callbackUrl: '/' })}
                        >
                            Logout
                        </Button>
                    </div>
                </div>
            </div>
        </header>
    )
}