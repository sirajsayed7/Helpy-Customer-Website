import { useEffect } from 'react'
import { useNav } from '../context/NavContext'
import { hasHelpyUserSession } from '../api/helpy'

const APK_SPLASH_DURATION = 850

export default function SplashPage() {
  const { navigate } = useNav()

  useEffect(() => {
    const timer = window.setTimeout(() => {
      navigate(hasHelpyUserSession() ? 'home' : 'login')
    }, APK_SPLASH_DURATION)

    return () => window.clearTimeout(timer)
  }, [navigate])

  return (
    <div className="relative flex flex-1 overflow-hidden bg-white" aria-label="Helpy loading">
      <img
        src="/assets/helpy-splash-start.png"
        alt="Helpy — Qatar’s Service Provider Platform"
        className="absolute inset-0 h-full w-full object-cover"
      />
    </div>
  )
}
