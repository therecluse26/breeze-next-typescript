import Link from 'next/link'
import AuthCard from '@/app/(auth)/AuthCard'
import ApplicationLogo from '@/components/ApplicationLogo'
import { ReactNode } from 'react'

export const metadata = {
    title: 'Laravel',
}

const Layout = ({ children }: { children: ReactNode }) => {
    return (
        <div>
            <div className="font-sans text-gray-900 antialiased">
                <AuthCard
                    logo={
                        <Link href="/" legacyBehavior>
                            <ApplicationLogo className="w-20 h-20 fill-current text-gray-500" />
                        </Link>
                    }>
                    {children}
                </AuthCard>
            </div>
        </div>
    );
}

export default Layout
