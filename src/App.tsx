import { useEffect, useState } from 'react'
import { NavProvider, useNav } from './context/NavContext'
import { BottomNav } from './components/shared'

import LoginPage          from './pages/LoginPage'
import SignUpPage         from './pages/SignUpPage'
import SplashPage         from './pages/SplashPage'
import VerifyPage         from './pages/VerifyPage'
import HomePage           from './pages/HomePage'
import OrdersPage         from './pages/OrdersPage'
import ChatPage           from './pages/ChatPage'
import ProfilePage        from './pages/ProfilePage'
import ServiceDetailPage  from './pages/ServiceDetailPage'
import BookingSuccessPage from './subpages/BookingSuccessPage'
import GlowCheckoutPage   from './subpages/GlowCheckoutPage'
import BookingCheckoutPage from './subpages/BookingCheckoutPage'
import ChatThreadPage     from './subpages/ChatThreadPage'
import CategoriesPage     from './subpages/CategoriesPage'
import CategoryServicesPage from './subpages/CategoryServicesPage'
import DealsPage          from './subpages/DealsPage'
import OffersEventsPage   from './subpages/OffersEventsPage'
import ProvidersPage      from './subpages/ProvidersPage'
import AllServicesPage    from './subpages/AllServicesPage'
import LocationPickerPage from './subpages/LocationPickerPage'
import HelperPages        from './subpages/HelperPages'
import ReviewsPage        from './subpages/ReviewsPage'
import AppDownloadPage    from './pages/AppDownloadPage'
import DesktopWebsite     from './desktop/DesktopWebsite'
import { HelpyDataProvider } from './context/HelpyDataContext'

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

  if (screen === 'download-app') return <AppDownloadPage/>
  if (isWebsite) return <DesktopWebsite/>

  return (
    <div className="flex min-h-screen items-start justify-center bg-[radial-gradient(circle_at_50%_0%,#eaf5ff,#c7d8f5_68%)]">
      <div className="relative flex h-[100dvh] min-h-[100dvh] w-full max-w-[430px] flex-col overflow-hidden bg-white shadow-[0_24px_80px_rgba(23,59,111,.24)]">
        <div className="flex-1 flex flex-col overflow-hidden min-h-0">
          <Page/>
        </div>
        {!hideBottomNav && <BottomNav/>}
      </div>
    </div>
  )
}

export default function App() {
  return <NavProvider><HelpyDataProvider><AppShell/></HelpyDataProvider></NavProvider>
}
