import { lazy, Suspense, useEffect, useState } from 'react'
import { NavProvider, useNav } from './context/NavContext'
import { BottomNav } from './components/shared'

import AppDownloadPage    from './pages/AppDownloadPage'
import { HelpyDataProvider } from './context/HelpyDataContext'

const LoginPage = lazy(() => import('./pages/LoginPage'))
const SignUpPage = lazy(() => import('./pages/SignUpPage'))
const SplashPage = lazy(() => import('./pages/SplashPage'))
const VerifyPage = lazy(() => import('./pages/VerifyPage'))
const HomePage = lazy(() => import('./pages/HomePage'))
const OrdersPage = lazy(() => import('./pages/OrdersPage'))
const ChatPage = lazy(() => import('./pages/ChatPage'))
const ProfilePage = lazy(() => import('./pages/ProfilePage'))
const ServiceDetailPage = lazy(() => import('./pages/ServiceDetailPage'))
const BookingSuccessPage = lazy(() => import('./subpages/BookingSuccessPage'))
const BookingCheckoutPage = lazy(() => import('./subpages/BookingCheckoutPage'))
const ChatThreadPage = lazy(() => import('./subpages/ChatThreadPage'))
const CategoryServicesPage = lazy(() => import('./subpages/CategoryServicesPage'))
const ProvidersPage = lazy(() => import('./subpages/ProvidersPage'))
const AllServicesPage = lazy(() => import('./subpages/AllServicesPage'))
const LocationPickerPage = lazy(() => import('./subpages/LocationPickerPage'))
const HelperPages = lazy(() => import('./subpages/HelperPages'))
const ReviewsPage = lazy(() => import('./subpages/ReviewsPage'))
const DesktopWebsite = lazy(() => import('./desktop/DesktopWebsite'))

const AUTH = ['splash','login','signup','verify']
const FULLSCREEN = ['chat-thread','service-detail','booking-success','glow-checkout','booking-checkout','location','reviews']

function AppShell() {
  const { screen } = useNav()
  const [isWebsite, setIsWebsite] = useState(() => window.matchMedia('(min-width: 768px)').matches)
  useEffect(() => {
    const query = window.matchMedia('(min-width: 768px)')
    const update = () => setIsWebsite(query.matches)
    query.addEventListener('change', update)
    return () => query.removeEventListener('change', update)
  }, [])
  const isAuth = AUTH.includes(screen)
  const hideBottomNav = isAuth || FULLSCREEN.includes(screen)

  const Page = () => {
    switch (screen) {
      case 'splash':             return <SplashPage/>
      case 'login':              return <LoginPage/>
      case 'signup':             return <SignUpPage/>
      case 'verify':             return <VerifyPage/>
      case 'home':               return <HomePage/>
      case 'orders':             return <OrdersPage/>
      case 'chat':               return <ChatPage/>
      case 'profile':            return <ProfilePage/>
      case 'service-detail':     return <ServiceDetailPage/>
      case 'booking-success':    return <BookingSuccessPage/>
      case 'booking-checkout':   return <BookingCheckoutPage/>
      case 'glow-checkout':      return <BookingCheckoutPage/>
      case 'chat-thread':        return <ChatThreadPage/>
      case 'categories':         return <AllServicesPage/>
      case 'category-services':  return <CategoryServicesPage/>
      case 'deals':              return <AllServicesPage/>
      case 'offers-events':      return <AllServicesPage/>
      case 'providers':          return <ProvidersPage/>
      case 'all-services':       return <AllServicesPage/>
      case 'location':           return <LocationPickerPage/>
      case 'reviews':            return <ReviewsPage/>
      case 'download-app':       return <AppDownloadPage/>
      default:                   return <HelperPages screen={screen}/>
    }
  }

  if (screen === 'download-app' && !isWebsite) return <AppDownloadPage/>
  if (isWebsite) return <HelpyDataProvider><Suspense fallback={<div className="min-h-screen bg-[#f4f7fd]"/>}><DesktopWebsite/></Suspense></HelpyDataProvider>

  return (
    <HelpyDataProvider><div className="flex min-h-screen items-start justify-center bg-[radial-gradient(circle_at_50%_0%,#eaf5ff,#c7d8f5_68%)]">
      <div className="relative flex h-[100dvh] min-h-[100dvh] w-full max-w-[430px] flex-col overflow-hidden bg-white shadow-[0_24px_80px_rgba(23,59,111,.24)]">
        <div className="flex-1 flex flex-col overflow-hidden min-h-0">
          <Suspense fallback={<div className="flex-1 bg-white"/>}><Page/></Suspense>
        </div>
        {!hideBottomNav && <BottomNav/>}
      </div>
    </div></HelpyDataProvider>
  )
}

export default function App() {
  return <NavProvider><AppShell/></NavProvider>
}
