'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Form, FormField, FormLabel, FormMessage } from '@/components/ui/form'
import { signup } from '@/server/actions/auth/signup'

export default function SignupPage() {
    const router = useRouter()
    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [error, setError] = useState('')
    const [isLoading, setIsLoading] = useState(false)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError('')

        // Validation
        if (password !== confirmPassword) {
            setError('Passwords do not match')
            return
        }

        if (password.length < 6) {
            setError('Password must be at least 6 characters')
            return
        }

        setIsLoading(true)

        try {
            const result = await signup({
                name,
                email,
                password,
            })

            if (!result.success) {
                setError(result.error || 'Failed to create account')
                setIsLoading(false)
                return
            }

            // Redirect to login
            router.push('/login?registered=true')
            // router.push('/onboarding')
        } catch (error) {
            setError('Something went wrong. Please try again.')
            setIsLoading(false)
        }
    }

    return (
        <Card className="w-full max-w-md">
            <CardHeader className="space-y-1">
                <CardTitle className="text-2xl font-bold">Create Account</CardTitle>
                <CardDescription>
                    Start your fitness journey today
                </CardDescription>
            </CardHeader>
            <CardContent>
                <Form onSubmit={handleSubmit}>
                    <FormField>
                        <FormLabel htmlFor="name">Full Name</FormLabel>
                        <Input
                            id="name"
                            type="text"
                            placeholder="John Doe"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                            disabled={isLoading}
                        />
                    </FormField>

                    <FormField>
                        <FormLabel htmlFor="email">Email</FormLabel>
                        <Input
                            id="email"
                            type="email"
                            placeholder="you@example.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            disabled={isLoading}
                        />
                    </FormField>

                    <FormField>
                        <FormLabel htmlFor="password">Password</FormLabel>
                        <Input
                            id="password"
                            type="password"
                            placeholder="••••••••"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            disabled={isLoading}
                            minLength={6}
                        />
                    </FormField>

                    <FormField>
                        <FormLabel htmlFor="confirmPassword">Confirm Password</FormLabel>
                        <Input
                            id="confirmPassword"
                            type="password"
                            placeholder="••••••••"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            required
                            disabled={isLoading}
                        />
                    </FormField>

                    {error && <FormMessage>{error}</FormMessage>}

                    <Button
                        type="submit"
                        className="w-full bg-green-600 hover:bg-green-700"
                        disabled={isLoading}
                    >
                        {isLoading ? 'Creating account...' : 'Create Account'}
                    </Button>
                </Form>
            </CardContent>
            <CardFooter className="flex flex-col gap-2">
                <div className="text-sm text-gray-600 text-center">
                    Already have an account?{' '}
                    <Link href="/login" className="text-green-600 hover:text-green-700 font-semibold">
                        Login
                    </Link>
                </div>
            </CardFooter>
        </Card>
    )
}