'use client'

import { ChangeEvent, FormEvent, Suspense, useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import Button from '@/components/Button'
import Input from '@/components/Input'
import InputError from '@/components/InputError'
import Label from '@/components/Label'
import Link from 'next/link'
import { useAuth } from '@/hooks/auth'
import AuthSessionStatus from '@/app/(auth)/AuthSessionStatus'

interface ErrorMessages {
    email?: string[]
    password?: string[]
}

const Login = () => {
    const params = useSearchParams()
    const { login } = useAuth({
        middleware: 'guest',
        redirectIfAuthenticated: '/dashboard',
    })

    const [email, setEmail] = useState<string>('')
    const [password, setPassword] = useState<string>('')
    const [shouldRemember, setShouldRemember] = useState<boolean>(false)
    const [errors, setErrors] = useState<ErrorMessages>({})
    const [status, setStatus] = useState<string | null>(null)

    useEffect(() => {
        if (params.get('reset') && Object.values(errors).length === 0) {
            setStatus(atob(params.get('reset') as string))
        } else {
            setStatus(null)
        }
    }, [params, errors])

    const submitForm = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault()

        login({
            email,
            password,
            remember: shouldRemember,
            setErrors,
            setStatus,
        })
    }

    return (
        <Suspense>
            <AuthSessionStatus className="mb-4" status={status} />
            <form onSubmit={submitForm}>
                {/* Email Address */}
                <div>
                    <Label htmlFor="email">Email</Label>
                    <Input
                        id="email"
                        type="email"
                        value={email}
                        className="block mt-1 w-full"
                        onChange={(event: ChangeEvent<HTMLInputElement>) =>
                            setEmail(event.target.value)
                        }
                        required
                        autoFocus
                    />
                    <InputError messages={errors.email} className="mt-2" />
                </div>

                {/* Password */}
                <div className="mt-4">
                    <Label htmlFor="password">Password</Label>
                    <Input
                        id="password"
                        type="password"
                        value={password}
                        className="block mt-1 w-full"
                        onChange={(event: ChangeEvent<HTMLInputElement>) =>
                            setPassword(event.target.value)
                        }
                        required
                        autoComplete="current-password"
                    />
                    <InputError messages={errors.password} className="mt-2" />
                </div>

                {/* Remember Me */}
                <div className="block mt-4">
                    <label
                        htmlFor="remember_me"
                        className="inline-flex items-center">
                        <input
                            id="remember_me"
                            type="checkbox"
                            name="remember"
                            className="rounded border-gray-300 text-indigo-600 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                            onChange={(event: ChangeEvent<HTMLInputElement>) =>
                                setShouldRemember(event.target.checked)
                            }
                        />
                        <span className="ml-2 text-sm text-gray-600">
                            Remember me
                        </span>
                    </label>
                </div>

                <div className="flex items-center justify-end mt-4">
                    <Link
                        href="/forgot-password"
                        className="underline text-sm text-gray-600 hover:text-gray-900">
                        Forgot your password?
                    </Link>
                    <Button className="ml-3">Login</Button>
                </div>
            </form>
        </Suspense>
    )
}

export default Login
