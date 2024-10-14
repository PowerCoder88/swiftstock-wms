import '../styles/globals.css'
import Layout from '../components/Layout'
import { useRouter } from 'next/router'
import { useState, useEffect } from 'react'

export default function App({ Component, pageProps }) {
  const router = useRouter()
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem('token')
      setIsAuthenticated(!!token)
      setIsLoading(false)
    }

    checkAuth()
  }, [])

  useEffect(() => {
    if (!isLoading) {
      if (!isAuthenticated && router.pathname !== '/login') {
        router.push('/login')
      }
    }
  }, [isAuthenticated, isLoading, router])

  if (isLoading) {
    return <div>Loading...</div>
  }

  if (!isAuthenticated && router.pathname !== '/login') {
    return null
  }

  // Wrap the component with Layout only if authenticated and not on the login page
  if (isAuthenticated && router.pathname !== '/login') {
    return (
      <Layout>
        <Component {...pageProps} />
      </Layout>
    )
  }

  // Return the component without Layout for the login page
  return <Component {...pageProps} />
}
