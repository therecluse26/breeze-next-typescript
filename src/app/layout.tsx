import '@/app/global.css'
import { ReactNode, Suspense } from 'react'

export const metadata = {
    title: 'Laravel',
}
const RootLayout = ({ children }: { children: ReactNode }) => {
    return (
        <html lang="en">
            <body className="antialiased">
                <Suspense fallback="Loading...">{children}</Suspense>
            </body>
        </html>
    )
}

export default RootLayout
