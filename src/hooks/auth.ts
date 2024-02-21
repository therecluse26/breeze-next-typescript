import { useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import useSWR from 'swr'
import axios from '@/lib/axios'

type SetErrorsSetter = React.Dispatch<React.SetStateAction<object>>

export type AuthStatus = string | null
type SetStatusSetter = React.Dispatch<React.SetStateAction<AuthStatus>>

export interface User {
    name: string
    email: string
    email_verified_at: unknown
}

type RegisterProps = {
    name: string
    email: string
    password: string
    password_confirmation: string
    setErrors: SetErrorsSetter
}

type LoginProps = {
    email: string
    password: string
    remember: boolean
    setErrors: SetErrorsSetter
    setStatus: SetStatusSetter
}

interface AuthHook {
    user: User | undefined
    register: (props: RegisterProps) => Promise<void>
    login: (props: LoginProps) => Promise<void>
    forgotPassword: (props: {
        setErrors: SetErrorsSetter
        setStatus: SetStatusSetter
        email: string
    }) => Promise<void>
    resetPassword: (props: {
        setErrors: SetErrorsSetter
        setStatus: SetStatusSetter
        email: string
        password: string
        password_confirmation: string
    }) => Promise<void>
    resendEmailVerification: (props: { setStatus: SetStatusSetter }) => void
    logout: () => Promise<void>
}

export const useAuth = ({
    middleware,
    redirectIfAuthenticated,
}: {
    middleware?: string
    redirectIfAuthenticated?: string
} = {}): AuthHook => {
    const router = useRouter()
    const query = useSearchParams()
    const { data: user, error, mutate } = useSWR<User, Error>('/api/user', () =>
        axios
            .get('/api/user')
            .then(res => res.data)
            .catch(error => {
                if (error.response.status !== 409) throw error
                router.push('/verify-email')
            }),
    )

    const csrf = () => axios.get('/sanctum/csrf-cookie')

    const register = async ({ setErrors, ...props }: RegisterProps) => {
        await csrf()

        setErrors({})

        axios
            .post('/register', props)
            .then(() => mutate())
            .catch(error => {
                if (error.response.status !== 422) throw error

                setErrors(error.response.data.errors)
            })
    }

    const login = async ({ setErrors, setStatus, ...props }: LoginProps) => {
        await csrf()

        setErrors({})
        setStatus(null)

        axios
            .post('/login', props)
            .then(() => mutate())
            .catch(error => {
                if (error.response.status !== 422) throw error

                setErrors(error.response.data.errors)
            })
    }

    const forgotPassword = async ({
        setErrors,
        setStatus,
        email,
    }: {
        setErrors: SetErrorsSetter
        setStatus: SetStatusSetter
        email: string
    }) => {
        await csrf()

        setErrors({})
        setStatus(null)

        axios
            .post('/forgot-password', { email })
            .then(response => setStatus(response.data.status))
            .catch(error => {
                if (error.response.status !== 422) throw error

                setErrors(error.response.data.errors)
            })
    }

    const resetPassword = async ({
        setErrors,
        setStatus,
        ...props
    }: {
        setErrors: SetErrorsSetter
        setStatus: SetStatusSetter
    }) => {
        await csrf()

        setErrors({})
        setStatus(null)

        axios
            .post('/reset-password', { token: query?.get('token'), ...props })
            .then(response =>
                router.push('/login?reset=' + btoa(response.data.status)),
            )
            .catch(error => {
                if (error.response.status !== 422) throw error

                setErrors(error.response.data.errors)
            })
    }

    const resendEmailVerification = ({
        setStatus,
    }: {
        setStatus: SetStatusSetter
    }) => {
        axios
            .post('/email/verification-notification')
            .then(response => setStatus(response.data.status))
    }

    const logout = async () => {
        if (!error) {
            await axios.post('/logout').then(() => mutate())
        }

        window.location.pathname = '/login'
    }

    useEffect(() => {
        if (middleware === 'guest' && redirectIfAuthenticated && user)
            router.push(redirectIfAuthenticated)
        if (
            window.location.pathname === '/verify-email' &&
            user?.email_verified_at &&
            redirectIfAuthenticated
        )
            router.push(redirectIfAuthenticated)
        if (middleware === 'auth' && error) logout()
    }, [user, error])

    return {
        user,
        register,
        login,
        forgotPassword,
        resetPassword,
        resendEmailVerification,
        logout,
    }
}
