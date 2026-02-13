'use client'

import { useState } from 'react'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Form, FormField, FormLabel, FormMessage } from '@/components/ui/form'

export default function LoginPage() {
    const router = useRouter()
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState('')
    const [isLoading, setIsLoading] = useState(false)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError('')
        setIsLoading(true)

        try {
            const result = await signIn('credentials', {
                email,
                password,
                redirect: false,
            })

            if (result?.error) {
                setError('Invalid email or password')
                setIsLoading(false)
                return
            }

            // Redirect to dashboard
            router.push('/dashboard')
            router.refresh()
        } catch (error) {
            setError('Something went wrong. Please try again.')
            setIsLoading(false)
        }
    }

    return (
        <Card className="w-full max-w-md">
            <CardHeader className="space-y-1">
                <CardTitle className="text-2xl font-bold">Welcome Back</CardTitle>
                <CardDescription>
                    Enter your credentials to access your account
                </CardDescription>
            </CardHeader>
            <CardContent>
                <Form onSubmit={handleSubmit}>
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
                        />
                    </FormField>

                    {error && <FormMessage>{error}</FormMessage>}

                    <Button
                        type="submit"
                        className="w-full bg-green-600 hover:bg-green-700"
                        disabled={isLoading}
                    >
                        {isLoading ? 'Logging in...' : 'Login'}
                    </Button>
                </Form>
            </CardContent>
            <CardFooter className="flex flex-col gap-2">
                <div className="text-sm text-gray-600 text-center">
                    Don't have an account?{' '}
                    <Link href="/signup" className="text-green-600 hover:text-green-700 font-semibold">
                        Sign up
                    </Link>
                </div>
            </CardFooter>
        </Card>
    )
}