import React from 'react'
import Link from 'next/link'
import { Menu } from '@headlessui/react'

type DropdownLinkProps = {
    children: React.ReactNode
    href: string
    onClick?: () => void | Promise<void>
}

type DropdownButtonProps = {
    children: React.ReactNode
    onClick?: () => void | Promise<void>
}

const DropdownLink = ({ children, ...props }: DropdownLinkProps) => (
    <Menu.Item>
        {({ active }) => (
            <Link
                {...props}
                passHref
                className={`w-full text-left block px-4 py-2 text-sm leading-5 text-gray-700 ${
                    active ? 'bg-gray-100' : ''
                } focus:outline-none transition duration-150 ease-in-out`}
                legacyBehavior>
                {children}
            </Link>
        )}
    </Menu.Item>
)

export const DropdownButton = ({ children, ...props }: DropdownButtonProps) => (
    <Menu.Item>
        {({ active }) => (
            <button
                className={`w-full text-left block px-4 py-2 text-sm leading-5 text-gray-700 ${
                    active ? 'bg-gray-100' : ''
                } focus:outline-none transition duration-150 ease-in-out`}
                {...props}>
                {children}
            </button>
        )}
    </Menu.Item>
)

export default DropdownLink
