import React from 'react'
import { BellIcon, ArrowRightOnRectangleIcon } from '@heroicons/react/24/outline'
import Link from 'next/link'
import { useRouter } from 'next/router'

const Header = () => {
  const router = useRouter()

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('userType')
    router.push('/login')
  }

  return (
    <header className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          <h1 className="text-lg font-semibold text-gray-900">StockSwift WMS</h1>
          <div className="flex items-center">
            <button className="p-1 rounded-full text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
              <BellIcon className="h-6 w-6" />
            </button>
            <Link href="/profile" className="ml-4">
              <img
                className="h-8 w-8 rounded-full cursor-pointer"
                src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                alt="User avatar"
              />
            </Link>
            <button
              onClick={handleLogout}
              className="ml-4 flex items-center text-sm font-medium text-gray-700 hover:text-gray-900"
            >
              <ArrowRightOnRectangleIcon className="h-5 w-5 mr-1" />
              Logout
            </button>
          </div>
        </div>
      </div>
    </header>
  )
}

export default Header
