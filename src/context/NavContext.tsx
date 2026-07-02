import { createContext, useContext, useState, ReactNode } from 'react'

export type Screen =
  | 'splash' | 'login' | 'verify' | 'home' | 'orders' | 'chat' | 'profile'
  | 'categories' | 'location' | 'service-detail' | 'booking-confirm' | 'booking-checkout'
  | 'booking-success' | 'glow-checkout' | 'chat-thread' | 'wallet' | 'favorites'
  | 'addresses' | 'contact-us' | 'terms' | 'privacy' | 'notifications'
  | 'order-detail' | 'category-services' | 'deals' | 'offers-events'
  | 'providers' | 'all-services'
  | 'reviews'

interface NavState { screen: Screen; params?: any; history: { screen: Screen; params?: any }[] }

interface NavCtx {
  screen: Screen; params: any
  navigate: (s: Screen, p?: any) => void
  goBack: () => void
  canGoBack: boolean
  activeTab: string
  setActiveTab: (t: string) => void
  isLoggedIn: boolean
  login: () => void
  bookedServices: BookedService[]
  addBooking: (b: BookedService) => void
}

export interface BookedService {
  id: string; provider: string; service: string
  date: string; time: string; price: string
  status: 'Confirmed'|'In Progress'|'Completed'
  providerBg: string; providerEmoji: string
  providerImage?: string
}

const Ctx = createContext<NavCtx>(null as any)

export function NavProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<NavState>({ screen: 'splash', history: [] })
  const [activeTab, setActiveTabState] = useState('home')
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [bookedServices, setBookedServices] = useState<BookedService[]>([])

  const navigate = (screen: Screen, params?: any) =>
    setState(s => ({ screen, params, history: [...s.history, { screen: s.screen, params: s.params }] }))

  const goBack = () =>
    setState(s => {
      const history = [...s.history]
      const prev = history.pop()
      return prev ? { screen: prev.screen, params: prev.params, history } : s
    })

  const setActiveTab = (t: string) => {
    setActiveTabState(t)
    setState({ screen: t as Screen, params: undefined, history: [] })
  }

  const login = () => {
    setIsLoggedIn(true)
    setState({ screen: 'home', params: undefined, history: [] })
    setActiveTabState('home')
  }

  const addBooking = (b: BookedService) => setBookedServices(prev => [b, ...prev])

  return (
    <Ctx.Provider value={{ screen: state.screen, params: state.params, navigate, goBack, canGoBack: state.history.length > 0, activeTab, setActiveTab, isLoggedIn, login, bookedServices, addBooking }}>
      {children}
    </Ctx.Provider>
  )
}

export const useNav = () => useContext(Ctx)
