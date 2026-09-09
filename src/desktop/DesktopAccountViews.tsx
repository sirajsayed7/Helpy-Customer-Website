import { useState, type ElementType, type ReactNode } from 'react'
import {
  ArrowLeft,
  ArrowRight,
  Bell,
  Building2,
  CalendarDays,
  Check,
  CheckCircle2,
  ChevronRight,
  CreditCard,
  Edit3,
  FileText,
  Gift,
  Heart,
  Home,
  LockKeyhole,
  Mail,
  MapPin,
  MessageCircle,
  Phone,
  Plus,
  Send,
  ShieldCheck,
  Sparkles,
  Star,
  Trash2,
  User,
  Wallet,
  X,
} from 'lucide-react'
import type { Screen } from '../context/NavContext'

type Navigate = (screen: Screen, params?: any) => void

export type DesktopAccountViewsProps = {
  screen: Screen
  navigate: Navigate
}

type AccountScreen = 'profile' | 'wallet' | 'favorites' | 'addresses' | 'notifications' | 'contact-us' | 'terms' | 'privacy'

type Address = {
  id: number
  label: string
  address: string
  detail: string
  icon: 'home' | 'work' | 'other'
  primary?: boolean
}

const accountItems: Array<{ screen: AccountScreen; label: string; description: string; icon: ElementType }> = [
  { screen: 'profile', label: 'My profile', description: 'Personal details & preferences', icon: User },
  { screen: 'wallet', label: 'Wallet & payments', description: 'Balance, cards & history', icon: Wallet },
  { screen: 'favorites', label: 'Saved providers', description: 'Your favourite services', icon: Heart },
  { screen: 'addresses', label: 'Saved addresses', description: 'Home, work & more', icon: MapPin },
  { screen: 'notifications', label: 'Notifications', description: 'Booking and account updates', icon: Bell },
]

const helpItems: Array<{ screen: AccountScreen; label: string; icon: ElementType }> = [
  { screen: 'contact-us', label: 'Help centre', icon: MessageCircle },
  { screen: 'terms', label: 'Terms of service', icon: FileText },
  { screen: 'privacy', label: 'Privacy & data', icon: ShieldCheck },
]

const initialAddresses: Address[] = [
  { id: 1, label: 'Home', address: 'Viva Bahriya 10, The Pearl-Qatar', detail: 'Tower 10 · Apartment 2306', icon: 'home', primary: true },
  { id: 2, label: 'Work', address: 'West Bay Tower, Doha', detail: 'Floor 12 · Reception', icon: 'work' },
  { id: 3, label: 'Parents', address: 'Al Sadd Street, Doha', detail: 'Villa 5 · Near Al Sadd Park', icon: 'other' },
]

const favouriteProviders = [
  {
    id: 'scrubs',
    name: 'Scrubs Cleaning',
    category: 'Home services',
    rating: '4.8',
    reviews: '320+',
    price: 'from QAR 160',
    image: '/assets/scrubs-booking-hero-clean.png',
    service: { provider: 'Scrubs Cleaning', name: 'General Cleaning', price: '160.00', providerBg: 'bg-red-500', providerEmoji: 'SC', providerImage: '/assets/scrubs-leaf-logo-clean.png' },
  },
  {
    id: 'glow',
    name: 'Glow Salon & Spa',
    category: 'Beauty & wellness',
    rating: '4.9',
    reviews: '215+',
    price: 'from QAR 120',
    image: '/assets/ai-profile-glow-salon.jpg',
    service: { provider: 'Glow Salon & Spa', name: 'Salon & Spa Package', price: '120.00', providerBg: 'bg-pink-500', providerEmoji: 'GS', providerImage: '/assets/ai-profile-glow-salon.jpg' },
  },
  {
    id: 'sparkle',
    name: 'Sparkle Auto Wash',
    category: 'Car services',
    rating: '4.7',
    reviews: '180+',
    price: 'from QAR 45',
    image: '/assets/ai-profile-sparkle-carwash.jpg',
    service: { provider: 'Sparkle Auto Wash', name: 'Premium Wash', price: '75.00', providerBg: 'bg-blue-500', providerEmoji: 'SA', providerImage: '/assets/ai-profile-sparkle-carwash.jpg' },
  },
]

const transactions = [
  { label: 'General Cleaning refund', merchant: 'Scrubs Cleaning', date: '30 May 2024 · 10:14 AM', amount: '+ QAR 20.00', positive: true, icon: ArrowLeft },
  { label: 'Service payment', merchant: 'Scrubs Cleaning', date: '30 May 2024 · 9:32 AM', amount: '− QAR 160.00', positive: false, icon: ArrowRight },
  { label: 'Referral reward', merchant: 'Helpy rewards', date: '25 May 2024 · 5:18 PM', amount: '+ QAR 15.00', positive: true, icon: Gift },
  { label: 'Wallet top up', merchant: 'Visa ending 4242', date: '18 May 2024 · 11:02 AM', amount: '+ QAR 200.00', positive: true, icon: Plus },
]

const legalSections = {
  terms: [
    ['1. Acceptance of terms', 'By creating an account or booking through Helpy, you agree to these Terms of Service and our Privacy Policy.'],
    ['2. How Helpy works', 'Helpy connects customers with independent local service providers. We make discovery, booking and payments simpler, while providers remain responsible for delivering their services.'],
    ['3. Your bookings', 'Please provide accurate booking, contact and location information. Some services may have provider-specific timing or cancellation requirements, shown before you confirm.'],
    ['4. Payments & refunds', 'Payments are processed securely. Eligible refunds are handled in line with the relevant provider’s cancellation policy and the terms shown at checkout.'],
    ['5. Respectful use', 'Treat providers, support staff and other users respectfully. Fraud, harassment, misuse of the platform or inaccurate account details may lead to account restrictions.'],
    ['6. Questions about these terms', 'If something is unclear, our support team is ready to help before or after you make a booking.'],
  ],
  privacy: [
    ['What we collect', 'We collect the account, contact, location and booking details needed to deliver a smooth service experience and keep the platform safe.'],
    ['How we use your data', 'Your information helps us facilitate bookings, communicate updates, improve Helpy and prevent fraud or misuse.'],
    ['When we share it', 'We share only the details a provider needs to fulfil your booking. We do not sell personal information to advertisers.'],
    ['Your choices', 'You can update account details, communication preferences and saved addresses from your account. You may also ask us about access, correction or deletion.'],
    ['Security', 'We use appropriate technical and organisational controls to protect your data. Payment details are handled through secure payment providers.'],
    ['Contact our privacy team', 'For privacy questions or requests, contact support through the Help centre and select “Privacy & data”.'],
  ],
} as const

/**
 * Desktop-only account pages. The surrounding desktop shell provides the global
 * header and footer; this component supplies a rich account rail and page body.
 */
export default function DesktopAccountViews({ screen, navigate }: DesktopAccountViewsProps) {
  const accountScreen: AccountScreen = isAccountScreen(screen) ? screen : 'profile'

  const content = (() => {
    switch (accountScreen) {
      case 'profile': return <ProfileView navigate={navigate} />
      case 'wallet': return <WalletView />
      case 'favorites': return <FavoritesView navigate={navigate} />
      case 'addresses': return <AddressesView navigate={navigate} />
      case 'notifications': return <NotificationsView navigate={navigate} />
      case 'contact-us': return <ContactView navigate={navigate} />
      case 'terms': return <LegalView type="terms" navigate={navigate} />
      case 'privacy': return <LegalView type="privacy" navigate={navigate} />
      default: return <ProfileView navigate={navigate} />
    }
  })()

  return (
    <div className="py-2 lg:py-4">
      <div>
        <div className="mb-7 flex flex-wrap items-center gap-2 text-sm font-semibold text-slate-500">
          <button onClick={() => navigate('home')} className="transition hover:text-[#0967ff]">Home</button>
          <ChevronRight size={15} className="text-slate-300" />
          <span className="text-slate-800">My account</span>
        </div>
        <div className="grid items-start gap-7 xl:grid-cols-[286px_minmax(0,1fr)]">
          <AccountRail active={accountScreen} navigate={navigate} />
          <div className="min-w-0">{content}</div>
        </div>
      </div>
    </div>
  )
}

function isAccountScreen(screen: Screen): screen is AccountScreen {
  return ['profile', 'wallet', 'favorites', 'addresses', 'notifications', 'contact-us', 'terms', 'privacy'].includes(screen)
}

function AccountRail({ active, navigate }: { active: AccountScreen; navigate: Navigate }) {
  return (
    <aside className="overflow-hidden rounded-[28px] border border-blue-100 bg-white shadow-[0_18px_48px_rgba(30,75,150,.08)] xl:sticky xl:top-24">
      <div className="relative overflow-hidden bg-[#0b63e6] p-6 text-white">
        <div className="absolute -right-10 -top-12 h-36 w-36 rounded-full bg-white/10" />
        <div className="absolute -bottom-16 left-12 h-32 w-32 rounded-full bg-cyan-300/20 blur-2xl" />
        <div className="relative flex items-center gap-3">
          <div className="grid h-12 w-12 place-items-center rounded-2xl border border-white/25 bg-white/15 text-lg font-black shadow-lg shadow-blue-950/20">SS</div>
          <div><p className="text-sm font-black">Siraj Sayed</p><p className="mt-0.5 text-xs font-semibold text-blue-100">Helpy member</p></div>
        </div>
        <button onClick={() => navigate('profile')} className="relative mt-5 inline-flex items-center gap-1.5 text-xs font-black text-white/90 transition hover:text-white">View profile <ArrowRight size={14} /></button>
      </div>
      <nav className="p-3" aria-label="Account navigation">
        <p className="px-3 pb-2 pt-1 text-[10px] font-black uppercase tracking-[.16em] text-slate-400">Your account</p>
        <div className="space-y-1">
          {accountItems.map(({ screen, label, description, icon: Icon }) => {
            const current = active === screen
            return <button key={screen} onClick={() => navigate(screen)} className={`group flex w-full items-center gap-3 rounded-2xl px-3 py-3 text-left transition ${current ? 'bg-blue-50 text-[#0967ff]' : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'}`}>
              <span className={`grid h-9 w-9 place-items-center rounded-xl ${current ? 'bg-[#0967ff] text-white shadow-md shadow-blue-200' : 'bg-slate-50 text-slate-500 group-hover:bg-blue-50 group-hover:text-[#0967ff]'}`}><Icon size={17} /></span>
              <span className="min-w-0 flex-1"><span className="block text-sm font-black">{label}</span><span className="mt-0.5 block truncate text-[11px] font-semibold text-slate-400">{description}</span></span>
              {current && <span className="h-1.5 w-1.5 rounded-full bg-[#0967ff]" />}
            </button>
          })}
        </div>
        <div className="mx-3 my-4 h-px bg-slate-100" />
        <p className="px-3 pb-2 text-[10px] font-black uppercase tracking-[.16em] text-slate-400">Support & legal</p>
        <div className="space-y-1">
          {helpItems.map(({ screen, label, icon: Icon }) => {
            const current = active === screen
            return <button key={screen} onClick={() => navigate(screen)} className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm font-bold transition ${current ? 'bg-blue-50 text-[#0967ff]' : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'}`}>
              <Icon size={16} className={current ? 'text-[#0967ff]' : 'text-slate-400'} /><span className="flex-1">{label}</span><ChevronRight size={15} className="text-slate-300" />
            </button>
          })}
        </div>
      </nav>
      <div className="border-t border-slate-100 px-6 py-4"><button onClick={() => navigate('login')} className="text-xs font-black text-slate-500 transition hover:text-[#0967ff]">Switch account</button></div>
    </aside>
  )
}

function PageHeading({ eyebrow = 'Account', title, description, action }: { eyebrow?: string; title: string; description: string; action?: ReactNode }) {
  return <div className="mb-7 flex flex-wrap items-end justify-between gap-5"><div><p className="text-[11px] font-black uppercase tracking-[.17em] text-[#0967ff]">{eyebrow}</p><h1 className="mt-2 text-3xl font-black tracking-[-.045em] text-[#0b1637] sm:text-4xl">{title}</h1><p className="mt-2 max-w-xl text-sm font-medium leading-6 text-slate-500">{description}</p></div>{action}</div>
}

function ProfileView({ navigate }: { navigate: Navigate }) {
  const [editing, setEditing] = useState(false)
  const [saved, setSaved] = useState(false)
  const [profile, setProfile] = useState({ name: 'Siraj Sayed', email: 'sirajsayed7@gmail.com', phone: '+974 5205 5553' })
  const [preferences, setPreferences] = useState({ booking: true, offers: false })

  const saveProfile = () => {
    setEditing(false)
    setSaved(true)
    window.setTimeout(() => setSaved(false), 2600)
  }

  return <>
    <PageHeading title="Your profile" description="Keep your account details, saved places and service preferences in one calm, secure space." action={<button onClick={() => editing ? saveProfile() : setEditing(true)} className="inline-flex items-center gap-2 rounded-xl bg-[#0967ff] px-4 py-3 text-sm font-black text-white shadow-lg shadow-blue-200 transition hover:-translate-y-0.5 hover:bg-[#0759df]"><Edit3 size={16} />{editing ? 'Save changes' : 'Edit profile'}</button>} />
    {saved && <div role="status" className="mb-5 flex items-center gap-2 rounded-2xl border border-emerald-100 bg-emerald-50 px-4 py-3 text-sm font-bold text-emerald-700"><CheckCircle2 size={17} />Your profile changes have been saved.</div>}
    <section className="relative overflow-hidden rounded-[30px] bg-[#0b63e6] p-6 text-white shadow-[0_20px_50px_rgba(9,103,255,.22)] sm:p-8">
      <div className="absolute -right-20 -top-24 h-64 w-64 rounded-full border-[28px] border-white/10" /><div className="absolute -bottom-28 left-1/3 h-48 w-48 rounded-full bg-cyan-300/20 blur-3xl" />
      <div className="relative flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-5"><div className="relative grid h-20 w-20 shrink-0 place-items-center rounded-[26px] border border-white/35 bg-white/15 text-2xl font-black shadow-xl shadow-blue-950/20">SS<span className="absolute -bottom-1 -right-1 grid h-7 w-7 place-items-center rounded-full border-2 border-[#0b63e6] bg-white text-[#0967ff]"><Check size={14} strokeWidth={3} /></span></div><div><div className="flex flex-wrap items-center gap-2"><h2 className="text-2xl font-black tracking-tight">{profile.name}</h2><span className="rounded-full bg-white/15 px-2.5 py-1 text-[10px] font-black uppercase tracking-wide text-blue-50">Verified</span></div><p className="mt-1 text-sm font-semibold text-blue-100">{profile.email}</p><span className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-white/15 px-2.5 py-1 text-xs font-black"><Sparkles size={13} />Helpy member since 2024</span></div></div>
        <button onClick={() => navigate('notifications')} className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/25 bg-white/10 px-4 py-3 text-sm font-black transition hover:bg-white/20"><Bell size={16} />3 new updates</button>
      </div>
    </section>
    <section className="mt-6 grid gap-4 sm:grid-cols-3">
      <button onClick={() => navigate('wallet')} className="group rounded-2xl border border-blue-100 bg-white p-5 text-left shadow-sm transition hover:-translate-y-0.5 hover:shadow-lg hover:shadow-blue-100"><span className="grid h-10 w-10 place-items-center rounded-xl bg-blue-50 text-[#0967ff]"><Wallet size={19} /></span><p className="mt-5 text-xs font-bold text-slate-500">Wallet balance</p><p className="mt-1 text-xl font-black text-[#0b1637]">QAR 855.00</p><span className="mt-3 inline-flex items-center gap-1 text-xs font-black text-[#0967ff]">View wallet <ArrowRight size={13} className="transition group-hover:translate-x-1" /></span></button>
      <button onClick={() => navigate('orders')} className="group rounded-2xl border border-blue-100 bg-white p-5 text-left shadow-sm transition hover:-translate-y-0.5 hover:shadow-lg hover:shadow-blue-100"><span className="grid h-10 w-10 place-items-center rounded-xl bg-amber-50 text-amber-600"><CalendarDays size={19} /></span><p className="mt-5 text-xs font-bold text-slate-500">Completed bookings</p><p className="mt-1 text-xl font-black text-[#0b1637]">12 services</p><span className="mt-3 inline-flex items-center gap-1 text-xs font-black text-[#0967ff]">See bookings <ArrowRight size={13} className="transition group-hover:translate-x-1" /></span></button>
      <button onClick={() => navigate('favorites')} className="group rounded-2xl border border-blue-100 bg-white p-5 text-left shadow-sm transition hover:-translate-y-0.5 hover:shadow-lg hover:shadow-blue-100"><span className="grid h-10 w-10 place-items-center rounded-xl bg-rose-50 text-rose-500"><Heart size={19} fill="currentColor" /></span><p className="mt-5 text-xs font-bold text-slate-500">Saved providers</p><p className="mt-1 text-xl font-black text-[#0b1637]">3 favourites</p><span className="mt-3 inline-flex items-center gap-1 text-xs font-black text-[#0967ff]">Open saved list <ArrowRight size={13} className="transition group-hover:translate-x-1" /></span></button>
    </section>
    <section className="mt-6 grid gap-6 2xl:grid-cols-[minmax(0,1fr)_300px]">
      <div className="rounded-[26px] border border-blue-100 bg-white p-6 shadow-sm sm:p-7"><div className="flex items-center justify-between gap-4"><div><h2 className="text-lg font-black text-[#0b1637]">Personal information</h2><p className="mt-1 text-sm font-medium text-slate-500">Used to keep your bookings and support requests accurate.</p></div><span className="hidden rounded-full bg-emerald-50 px-3 py-1.5 text-xs font-black text-emerald-600 sm:inline-flex">Account verified</span></div><div className="mt-6 grid gap-4 sm:grid-cols-2"><Field label="Full name" value={profile.name} editing={editing} onChange={value => setProfile(current => ({ ...current, name: value }))} /><Field label="Email address" value={profile.email} editing={editing} type="email" onChange={value => setProfile(current => ({ ...current, email: value }))} /><Field label="Mobile number" value={profile.phone} editing={editing} onChange={value => setProfile(current => ({ ...current, phone: value }))} /><div><p className="mb-2 text-xs font-black text-slate-500">Account status</p><div className="flex h-12 items-center gap-2 rounded-xl border border-slate-100 bg-slate-50 px-4 text-sm font-bold text-slate-700"><ShieldCheck size={17} className="text-emerald-500" />Verified customer</div></div></div></div>
      <div className="rounded-[26px] border border-blue-100 bg-white p-6 shadow-sm"><h2 className="text-lg font-black text-[#0b1637]">Stay in the loop</h2><p className="mt-1 text-sm leading-6 font-medium text-slate-500">Choose the updates that make your bookings easier.</p><div className="mt-5 space-y-3"><ToggleRow label="Booking updates" description="Confirmations, reminders and changes" enabled={preferences.booking} onChange={() => setPreferences(current => ({ ...current, booking: !current.booking }))} /><ToggleRow label="Offers & inspiration" description="Relevant local deals from Helpy" enabled={preferences.offers} onChange={() => setPreferences(current => ({ ...current, offers: !current.offers }))} /></div><button onClick={() => navigate('notifications')} className="mt-5 inline-flex items-center gap-1.5 text-sm font-black text-[#0967ff] transition hover:gap-2">Manage notifications <ArrowRight size={15} /></button></div>
    </section>
  </>
}

function WalletView() {
  const [balance, setBalance] = useState(855)
  const [dialog, setDialog] = useState<'topup' | 'withdraw' | null>(null)
  const [amount, setAmount] = useState('200')
  const [method, setMethod] = useState<'Visa •••• 4242' | 'Debit •••• 2201'>('Visa •••• 4242')
  const [notice, setNotice] = useState('')
  const formattedBalance = new Intl.NumberFormat('en-QA', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(balance)
  const submit = () => {
    const parsed = Number(amount)
    if (!parsed || parsed <= 0 || (dialog === 'withdraw' && parsed > balance)) {
      setNotice(dialog === 'withdraw' ? 'Enter an amount within your available balance.' : 'Enter a valid amount to continue.')
      return
    }
    setBalance(current => dialog === 'topup' ? current + parsed : current - parsed)
    setNotice(dialog === 'topup' ? `QAR ${parsed.toFixed(2)} was added to your wallet.` : `Your QAR ${parsed.toFixed(2)} withdrawal is being processed.`)
    setDialog(null)
  }
  return <>
    <PageHeading eyebrow="Helpy wallet" title="Pay your way" description="A simple balance for faster checkout, secure payments and refunds in one place." action={<button onClick={() => setDialog('topup')} className="inline-flex items-center gap-2 rounded-xl bg-[#0967ff] px-4 py-3 text-sm font-black text-white shadow-lg shadow-blue-200 transition hover:-translate-y-0.5 hover:bg-[#0759df]"><Plus size={17} />Add funds</button>} />
    {notice && <div role="status" className="mb-5 flex items-center justify-between gap-3 rounded-2xl border border-emerald-100 bg-emerald-50 px-4 py-3 text-sm font-bold text-emerald-700"><span className="flex items-center gap-2"><CheckCircle2 size={17} />{notice}</span><button onClick={() => setNotice('')} aria-label="Dismiss message"><X size={16} /></button></div>}
    <section className="relative overflow-hidden rounded-[30px] bg-[linear-gradient(120deg,#073f9e_0%,#0967ff_53%,#38a3ff_100%)] p-7 text-white shadow-[0_24px_55px_rgba(9,103,255,.28)] sm:p-8"><div className="absolute -right-10 -top-20 h-64 w-64 rounded-full border-[26px] border-white/10" /><div className="absolute bottom-0 right-20 h-24 w-72 rounded-full bg-cyan-300/20 blur-2xl" /><div className="relative grid gap-6 lg:grid-cols-[1fr_auto]"><div><div className="flex items-center gap-2 text-sm font-bold text-blue-100"><Wallet size={17} />Available balance</div><p className="mt-4 text-4xl font-black tracking-[-.04em] sm:text-5xl">QAR {formattedBalance}</p><p className="mt-2 text-sm font-semibold text-blue-100">Ready for your next booking</p></div><div className="flex items-end gap-3"><button onClick={() => setDialog('topup')} className="rounded-xl bg-white px-5 py-3 text-sm font-black text-[#0967ff] shadow-lg shadow-blue-950/10 transition hover:-translate-y-0.5">Top up</button><button onClick={() => setDialog('withdraw')} className="rounded-xl border border-white/35 bg-white/10 px-5 py-3 text-sm font-black text-white transition hover:bg-white/20">Withdraw</button></div></div></section>
    <section className="mt-6 grid gap-6 2xl:grid-cols-[minmax(0,1fr)_320px]"><div className="overflow-hidden rounded-[26px] border border-blue-100 bg-white shadow-sm"><div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 px-6 py-5"><div><h2 className="text-lg font-black text-[#0b1637]">Recent activity</h2><p className="mt-1 text-sm font-medium text-slate-500">Every wallet movement, clearly itemised.</p></div><button className="text-sm font-black text-[#0967ff]">Download statement</button></div><div className="divide-y divide-slate-100">{transactions.map(({ label, merchant, date, amount: transactionAmount, positive, icon: Icon }) => <div key={label} className="flex items-center gap-4 px-6 py-4"><span className={`grid h-11 w-11 place-items-center rounded-2xl ${positive ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-500'}`}><Icon size={18} /></span><div className="min-w-0 flex-1"><p className="text-sm font-black text-[#0b1637]">{label}</p><p className="mt-0.5 truncate text-xs font-semibold text-slate-500">{merchant} · {date}</p></div><p className={`text-sm font-black ${positive ? 'text-emerald-600' : 'text-slate-800'}`}>{transactionAmount}</p></div>)}</div></div>
      <div className="rounded-[26px] border border-blue-100 bg-white p-6 shadow-sm"><div className="flex items-center gap-3"><span className="grid h-10 w-10 place-items-center rounded-xl bg-blue-50 text-[#0967ff]"><CreditCard size={19} /></span><div><h2 className="text-base font-black text-[#0b1637]">Payment method</h2><p className="text-xs font-semibold text-slate-500">Used for wallet top ups</p></div></div><div className="mt-6 rounded-2xl border border-slate-100 bg-slate-50 p-4"><div className="flex items-center justify-between"><span className="rounded-md bg-white px-2 py-1 text-[11px] font-black text-[#0967ff] shadow-sm">VISA</span><span className="text-xs font-black text-slate-500">Primary</span></div><p className="mt-5 text-lg font-black tracking-[.14em] text-[#0b1637]">•••• 4242</p><p className="mt-2 text-xs font-bold text-slate-500">Siraj Sayed · Expires 08/28</p></div><button onClick={() => setDialog('topup')} className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl border border-blue-100 py-3 text-sm font-black text-[#0967ff] transition hover:bg-blue-50"><Plus size={16} />Use another card</button><div className="mt-5 flex items-start gap-2 rounded-xl bg-blue-50 p-3 text-xs font-semibold leading-5 text-slate-600"><LockKeyhole size={15} className="mt-0.5 shrink-0 text-[#0967ff]" />Your card details are securely handled by our payment partner.</div></div></section>
    {dialog && <WalletDialog kind={dialog} amount={amount} setAmount={setAmount} method={method} setMethod={setMethod} balance={balance} onClose={() => { setDialog(null); setNotice('') }} onSubmit={submit} />}
  </>
}

function WalletDialog({ kind, amount, setAmount, method, setMethod, balance, onClose, onSubmit }: { kind: 'topup' | 'withdraw'; amount: string; setAmount: (value: string) => void; method: 'Visa •••• 4242' | 'Debit •••• 2201'; setMethod: (value: 'Visa •••• 4242' | 'Debit •••• 2201') => void; balance: number; onClose: () => void; onSubmit: () => void }) {
  const isTopup = kind === 'topup'
  return <div className="fixed inset-0 z-[70] grid place-items-center bg-[#091737]/45 px-4 py-6 backdrop-blur-sm" role="dialog" aria-modal="true" aria-labelledby="wallet-dialog-title"><div className="w-full max-w-md rounded-[28px] bg-white p-6 shadow-2xl"><div className="flex items-start justify-between gap-4"><div><p className="text-[11px] font-black uppercase tracking-[.15em] text-[#0967ff]">Helpy wallet</p><h2 id="wallet-dialog-title" className="mt-1 text-2xl font-black text-[#0b1637]">{isTopup ? 'Top up your balance' : 'Withdraw your funds'}</h2><p className="mt-2 text-sm leading-6 font-medium text-slate-500">{isTopup ? 'Choose an amount and payment method.' : `Available to withdraw: QAR ${balance.toFixed(2)}`}</p></div><button onClick={onClose} className="rounded-full bg-slate-100 p-2 text-slate-500" aria-label="Close"><X size={18} /></button></div><label className="mt-6 block"><span className="text-xs font-black text-slate-600">Amount in QAR</span><div className="mt-2 flex items-center rounded-xl border border-blue-100 bg-blue-50/50 px-4 focus-within:border-[#0967ff] focus-within:ring-2 focus-within:ring-blue-100"><span className="text-lg font-black text-[#0967ff]">QAR</span><input value={amount} onChange={event => setAmount(event.target.value.replace(/[^0-9.]/g, ''))} inputMode="decimal" className="h-14 w-full bg-transparent px-3 text-xl font-black text-[#0b1637] outline-none" aria-label="Amount in QAR" /></div></label><div className="mt-3 flex gap-2">{[100, 200, 500].map(value => <button key={value} onClick={() => setAmount(String(value))} className={`rounded-lg border px-3 py-2 text-xs font-black transition ${amount === String(value) ? 'border-[#0967ff] bg-blue-50 text-[#0967ff]' : 'border-slate-100 text-slate-500 hover:border-blue-100'}`}>QAR {value}</button>)}</div><div className="mt-6"><p className="text-xs font-black text-slate-600">{isTopup ? 'Pay with' : 'Deposit to'}</p><div className="mt-2 grid gap-2">{(['Visa •••• 4242', 'Debit •••• 2201'] as const).map(item => <button key={item} onClick={() => setMethod(item)} className={`flex items-center gap-3 rounded-xl border p-3 text-left ${method === item ? 'border-[#0967ff] bg-blue-50' : 'border-slate-100 hover:border-blue-100'}`}><span className="grid h-9 w-9 place-items-center rounded-lg bg-white text-[#0967ff] shadow-sm"><CreditCard size={16} /></span><span className="flex-1 text-sm font-black text-[#0b1637]">{item}</span>{method === item && <CheckCircle2 size={18} className="text-[#0967ff]" />}</button>)}</div></div><button onClick={onSubmit} className="mt-6 w-full rounded-xl bg-[#0967ff] py-3.5 text-sm font-black text-white transition hover:bg-[#0759df]">{isTopup ? 'Add funds' : 'Request withdrawal'}</button></div></div>
}

function FavoritesView({ navigate }: { navigate: Navigate }) {
  const [favourites, setFavourites] = useState(favouriteProviders)
  return <>
    <PageHeading eyebrow="Your saved list" title="Providers you love" description="Keep reliable local professionals within easy reach, then book again whenever life calls." action={<button onClick={() => navigate('all-services')} className="inline-flex items-center gap-2 rounded-xl bg-[#0967ff] px-4 py-3 text-sm font-black text-white shadow-lg shadow-blue-200 transition hover:-translate-y-0.5 hover:bg-[#0759df]">Explore services <ArrowRight size={16} /></button>} />
    {favourites.length === 0 ? <div className="rounded-[28px] border border-dashed border-blue-200 bg-white px-6 py-20 text-center"><span className="mx-auto grid h-16 w-16 place-items-center rounded-3xl bg-rose-50 text-rose-400"><Heart size={29} /></span><h2 className="mt-5 text-xl font-black text-[#0b1637]">Your saved list is waiting</h2><p className="mx-auto mt-2 max-w-sm text-sm leading-6 font-medium text-slate-500">Browse trusted local providers and tap the heart on the ones you want to come back to.</p><button onClick={() => navigate('all-services')} className="mt-6 rounded-xl bg-[#0967ff] px-5 py-3 text-sm font-black text-white">Explore services</button></div> : <><div className="mb-5 flex items-center gap-2 text-sm font-bold text-slate-500"><Heart size={16} className="fill-rose-400 text-rose-400" /><span>{favourites.length} trusted providers saved for later</span></div><section className="grid gap-5 md:grid-cols-2 2xl:grid-cols-3">{favourites.map(provider => <article key={provider.id} className="group overflow-hidden rounded-[26px] border border-blue-100 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-blue-100"><div className="relative h-44 overflow-hidden bg-blue-50"><img src={provider.image} alt="" className="h-full w-full object-cover transition duration-500 group-hover:scale-105" /><div className="absolute inset-0 bg-gradient-to-t from-[#071b52]/50 via-transparent to-transparent" /><span className="absolute bottom-3 left-3 rounded-full bg-white/95 px-2.5 py-1 text-[11px] font-black text-[#0b1637]">{provider.category}</span><button onClick={() => setFavourites(items => items.filter(item => item.id !== provider.id))} className="absolute right-3 top-3 grid h-9 w-9 place-items-center rounded-xl bg-white text-rose-500 shadow-md transition hover:scale-105" aria-label={`Remove ${provider.name} from favorites`}><Heart size={17} fill="currentColor" /></button></div><div className="p-5"><div className="flex items-start justify-between gap-3"><div><h2 className="text-lg font-black tracking-tight text-[#0b1637]">{provider.name}</h2><p className="mt-1 flex items-center gap-1 text-xs font-bold text-slate-500"><Star size={14} className="fill-amber-400 text-amber-400" />{provider.rating} <span className="text-slate-300">·</span> {provider.reviews} reviews</p></div><span className="rounded-lg bg-blue-50 px-2 py-1 text-[11px] font-black text-[#0967ff]">Saved</span></div><div className="mt-5 flex items-center justify-between gap-3"><span className="text-sm font-black text-[#0967ff]">{provider.price}</span><button onClick={() => navigate('service-detail', provider.service)} className="rounded-xl bg-[#0967ff] px-4 py-2.5 text-sm font-black text-white transition hover:bg-[#0759df]">Book again</button></div></div></article>)}</section></>}
  </>
}

function AddressesView({ navigate }: { navigate: Navigate }) {
  const [addresses, setAddresses] = useState<Address[]>(initialAddresses)
  const [editor, setEditor] = useState<Address | 'new' | null>(null)
  const primary = addresses.find(address => address.primary)
  const save = (entry: Omit<Address, 'id'>) => {
    if (editor === 'new') setAddresses(items => [...items, { ...entry, id: Date.now() }])
    else if (editor) setAddresses(items => items.map(item => item.id === editor.id ? { ...entry, id: item.id } : item))
    setEditor(null)
  }
  const makePrimary = (id: number) => setAddresses(items => items.map(item => ({ ...item, primary: item.id === id })))
  const remove = (id: number) => setAddresses(items => items.filter(item => item.id !== id))
  return <>
    <PageHeading eyebrow="Booking locations" title="Saved addresses" description="Make checkout faster by keeping the places you use most ready for your next service." action={<button onClick={() => setEditor('new')} className="inline-flex items-center gap-2 rounded-xl bg-[#0967ff] px-4 py-3 text-sm font-black text-white shadow-lg shadow-blue-200 transition hover:-translate-y-0.5 hover:bg-[#0759df]"><Plus size={17} />Add address</button>} />
    {primary && <div className="mb-6 flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-blue-100 bg-blue-50 px-5 py-4"><div className="flex items-center gap-3"><span className="grid h-10 w-10 place-items-center rounded-xl bg-white text-[#0967ff] shadow-sm"><MapPin size={18} /></span><div><p className="text-sm font-black text-[#0b1637]">Your default service location</p><p className="mt-0.5 text-xs font-semibold text-slate-500">{primary.label} · {primary.address}</p></div></div><button onClick={() => navigate('all-services')} className="text-sm font-black text-[#0967ff]">Book a service</button></div>}
    <section className="grid gap-4">{addresses.map(address => <article key={address.id} className="group flex flex-col gap-5 rounded-[24px] border border-blue-100 bg-white p-5 shadow-sm transition hover:border-blue-200 hover:shadow-lg hover:shadow-blue-100 sm:flex-row sm:items-center"><span className={`grid h-14 w-14 shrink-0 place-items-center rounded-2xl ${address.icon === 'work' ? 'bg-violet-50 text-violet-600' : address.icon === 'other' ? 'bg-amber-50 text-amber-600' : 'bg-blue-50 text-[#0967ff]'}`}>{address.icon === 'work' ? <Building2 size={22} /> : address.icon === 'other' ? <MapPin size={22} /> : <Home size={22} />}</span><div className="min-w-0 flex-1"><div className="flex flex-wrap items-center gap-2"><h2 className="text-base font-black text-[#0b1637]">{address.label}</h2>{address.primary && <span className="rounded-full bg-blue-50 px-2.5 py-1 text-[10px] font-black uppercase tracking-wide text-[#0967ff]">Default</span>}</div><p className="mt-1 text-sm font-bold text-slate-600">{address.address}</p><p className="mt-1 text-xs font-semibold text-slate-400">{address.detail}</p></div><div className="flex items-center gap-2"><button onClick={() => setEditor(address)} className="rounded-xl border border-slate-100 p-2.5 text-slate-500 transition hover:border-blue-100 hover:bg-blue-50 hover:text-[#0967ff]" aria-label={`Edit ${address.label}`}><Edit3 size={16} /></button>{!address.primary && <button onClick={() => makePrimary(address.id)} className="rounded-xl border border-slate-100 px-3 py-2.5 text-xs font-black text-slate-600 transition hover:border-blue-100 hover:bg-blue-50 hover:text-[#0967ff]">Set default</button>}<button onClick={() => remove(address.id)} className="rounded-xl border border-rose-100 p-2.5 text-rose-500 transition hover:bg-rose-50" aria-label={`Delete ${address.label}`}><Trash2 size={16} /></button></div></article>)}</section>
    <button onClick={() => setEditor('new')} className="mt-5 flex w-full items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-blue-200 bg-white py-4 text-sm font-black text-[#0967ff] transition hover:border-[#0967ff] hover:bg-blue-50"><Plus size={17} />Add another location</button>
    {editor && <AddressEditor entry={editor === 'new' ? undefined : editor} onClose={() => setEditor(null)} onSave={save} />}
  </>
}

function AddressEditor({ entry, onClose, onSave }: { entry?: Address; onClose: () => void; onSave: (entry: Omit<Address, 'id'>) => void }) {
  const [label, setLabel] = useState(entry?.label ?? '')
  const [address, setAddress] = useState(entry?.address ?? '')
  const [detail, setDetail] = useState(entry?.detail ?? '')
  const [kind, setKind] = useState<Address['icon']>(entry?.icon ?? 'home')
  const [error, setError] = useState('')
  const submit = () => {
    if (!label.trim() || !address.trim()) { setError('Please add a label and street address.'); return }
    onSave({ label: label.trim(), address: address.trim(), detail: detail.trim() || 'No extra instructions', icon: kind, primary: entry?.primary })
  }
  return <div className="fixed inset-0 z-[70] grid place-items-center bg-[#091737]/45 px-4 py-6 backdrop-blur-sm" role="dialog" aria-modal="true" aria-labelledby="address-dialog-title"><div className="w-full max-w-lg rounded-[28px] bg-white p-6 shadow-2xl"><div className="flex items-start justify-between gap-4"><div><p className="text-[11px] font-black uppercase tracking-[.15em] text-[#0967ff]">Service location</p><h2 id="address-dialog-title" className="mt-1 text-2xl font-black text-[#0b1637]">{entry ? 'Edit address' : 'Add a new address'}</h2></div><button onClick={onClose} className="rounded-full bg-slate-100 p-2 text-slate-500" aria-label="Close"><X size={18} /></button></div><div className="mt-6 grid gap-4 sm:grid-cols-2"><TextInput label="Label" value={label} onChange={setLabel} placeholder="e.g. Home" /><div><p className="mb-2 text-xs font-black text-slate-600">Address type</p><div className="flex gap-2">{(['home', 'work', 'other'] as const).map(item => <button key={item} onClick={() => setKind(item)} className={`flex-1 rounded-xl border py-3 text-xs font-black capitalize transition ${kind === item ? 'border-[#0967ff] bg-blue-50 text-[#0967ff]' : 'border-slate-100 text-slate-500 hover:border-blue-100'}`}>{item}</button>)}</div></div></div><div className="mt-4"><TextInput label="Street address" value={address} onChange={setAddress} placeholder="Building, street, area" /></div><div className="mt-4"><TextInput label="Extra details (optional)" value={detail} onChange={setDetail} placeholder="Floor, apartment, landmark" /></div>{error && <p className="mt-3 text-xs font-bold text-rose-500">{error}</p>}<button onClick={submit} className="mt-6 w-full rounded-xl bg-[#0967ff] py-3.5 text-sm font-black text-white transition hover:bg-[#0759df]">Save address</button></div></div>
}

function NotificationsView({ navigate }: { navigate: Navigate }) {
  const [notifications, setNotifications] = useState([
    { id: 1, icon: CalendarDays, iconClass: 'bg-blue-50 text-[#0967ff]', title: 'Your booking is confirmed', description: 'Scrubs Cleaning will arrive on 30 May at 12:00 PM.', time: '10 min ago', unread: true, screen: 'order-detail' as Screen, params: { provider: 'Scrubs Cleaning', service: 'General Cleaning', date: 'May 30, 2024', time: '12:00 PM', price: '160.00', status: 'Confirmed', providerBg: 'bg-red-500', providerEmoji: 'SC' } },
    { id: 2, icon: MessageCircle, iconClass: 'bg-violet-50 text-violet-600', title: 'New message from Scrubs Cleaning', description: '“Hi Siraj! We are on our way to your location.”', time: '35 min ago', unread: true, screen: 'chat-thread' as Screen, params: { name: 'Scrubs Cleaning', providerBg: 'bg-red-500', providerEmoji: 'SC' } },
    { id: 3, icon: Wallet, iconClass: 'bg-emerald-50 text-emerald-600', title: 'Refund issued to your wallet', description: 'QAR 20.00 is now available to use at checkout.', time: '2 hours ago', unread: true, screen: 'wallet' as Screen },
    { id: 4, icon: Star, iconClass: 'bg-amber-50 text-amber-600', title: 'How was your recent service?', description: 'Share a quick review for Happy Home Services.', time: 'Yesterday', unread: false, screen: 'reviews' as Screen },
    { id: 5, icon: Gift, iconClass: 'bg-rose-50 text-rose-500', title: 'A weekend offer just for you', description: 'Enjoy 20% off selected home services this weekend.', time: '25 May', unread: false, screen: 'deals' as Screen },
  ])
  const unreadCount = notifications.filter(notification => notification.unread).length
  const markAllRead = () => setNotifications(items => items.map(item => ({ ...item, unread: false })))
  const open = (id: number, target: Screen, params?: any) => {
    setNotifications(items => items.map(item => item.id === id ? { ...item, unread: false } : item))
    navigate(target, params)
  }
  return <>
    <PageHeading eyebrow="The latest from Helpy" title="Notifications" description={unreadCount ? `${unreadCount} updates are waiting for you. Stay on top of every booking, message and wallet movement.` : 'You are all caught up. New booking and account updates will appear here.'} action={<button onClick={markAllRead} disabled={!unreadCount} className="rounded-xl border border-blue-100 bg-white px-4 py-3 text-sm font-black text-[#0967ff] transition hover:bg-blue-50 disabled:cursor-not-allowed disabled:opacity-50">Mark all as read</button>} />
    <section className="overflow-hidden rounded-[28px] border border-blue-100 bg-white shadow-sm"><div className="flex items-center justify-between border-b border-slate-100 px-6 py-4"><span className="text-xs font-black uppercase tracking-[.15em] text-slate-400">Today</span>{unreadCount > 0 && <span className="rounded-full bg-[#0967ff] px-2.5 py-1 text-[10px] font-black text-white">{unreadCount} new</span>}</div><div className="divide-y divide-slate-100">{notifications.map(({ id, icon: Icon, iconClass, title, description, time, unread, screen: target, params }) => <button key={id} onClick={() => open(id, target, params)} className={`flex w-full items-start gap-4 px-6 py-5 text-left transition hover:bg-slate-50 ${unread ? 'bg-blue-50/40' : ''}`}><span className={`grid h-11 w-11 shrink-0 place-items-center rounded-2xl ${iconClass}`}><Icon size={19} /></span><span className="min-w-0 flex-1"><span className="flex flex-wrap items-center justify-between gap-2"><span className="text-sm font-black text-[#0b1637]">{title}</span><span className="text-xs font-bold text-slate-400">{time}</span></span><span className="mt-1 block max-w-2xl text-sm leading-6 font-medium text-slate-500">{description}</span></span>{unread && <span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-[#0967ff]" />}</button>)}</div></section>
    <div className="mt-5 flex items-start gap-3 rounded-2xl border border-blue-100 bg-blue-50 p-4"><Bell size={18} className="mt-0.5 shrink-0 text-[#0967ff]" /><p className="text-sm leading-6 font-semibold text-slate-600">You can choose which Helpy updates you receive from your profile preferences.</p><button onClick={() => navigate('profile')} className="ml-auto whitespace-nowrap text-sm font-black text-[#0967ff]">Manage</button></div>
  </>
}

function ContactView({ navigate }: { navigate: Navigate }) {
  const [subject, setSubject] = useState('Booking help')
  const [message, setMessage] = useState('')
  const [sent, setSent] = useState(false)
  return <>
    <PageHeading eyebrow="We are here for you" title="How can we help?" description="Get fast answers, chat with our support team or send us the details and we’ll follow up." action={<button onClick={() => navigate('chat-thread', { name: 'Helpy Support', providerBg: 'bg-brand-500', providerEmoji: 'HS' })} className="inline-flex items-center gap-2 rounded-xl bg-[#0967ff] px-4 py-3 text-sm font-black text-white shadow-lg shadow-blue-200 transition hover:-translate-y-0.5 hover:bg-[#0759df]"><MessageCircle size={17} />Chat with us</button>} />
    <section className="grid gap-4 md:grid-cols-3"><button onClick={() => navigate('chat-thread', { name: 'Helpy Support', providerBg: 'bg-brand-500', providerEmoji: 'HS' })} className="group rounded-[24px] border border-blue-100 bg-white p-5 text-left shadow-sm transition hover:-translate-y-0.5 hover:shadow-lg hover:shadow-blue-100"><span className="grid h-11 w-11 place-items-center rounded-2xl bg-blue-50 text-[#0967ff]"><MessageCircle size={20} /></span><h2 className="mt-5 text-base font-black text-[#0b1637]">Live chat</h2><p className="mt-1 text-sm leading-6 font-medium text-slate-500">The quickest route for booking questions.</p><span className="mt-4 inline-flex items-center gap-1 text-sm font-black text-[#0967ff]">Start chat <ArrowRight size={14} /></span></button><a href="tel:+97452055553" className="group rounded-[24px] border border-blue-100 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-lg hover:shadow-blue-100"><span className="grid h-11 w-11 place-items-center rounded-2xl bg-emerald-50 text-emerald-600"><Phone size={20} /></span><h2 className="mt-5 text-base font-black text-[#0b1637]">Call Helpy</h2><p className="mt-1 text-sm leading-6 font-medium text-slate-500">+974 5205 5553<br />Sun–Thu, 10 AM–4 PM</p><span className="mt-4 inline-flex items-center gap-1 text-sm font-black text-[#0967ff]">Call now <ArrowRight size={14} /></span></a><a href="mailto:helpyapp.tech@gmail.com" className="group rounded-[24px] border border-blue-100 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-lg hover:shadow-blue-100"><span className="grid h-11 w-11 place-items-center rounded-2xl bg-violet-50 text-violet-600"><Mail size={20} /></span><h2 className="mt-5 text-base font-black text-[#0b1637]">Email us</h2><p className="mt-1 text-sm leading-6 font-medium text-slate-500">helpyapp.tech@gmail.com<br />We reply within one business day.</p><span className="mt-4 inline-flex items-center gap-1 text-sm font-black text-[#0967ff]">Write email <ArrowRight size={14} /></span></a></section>
    <section className="mt-6 grid gap-6 2xl:grid-cols-[minmax(0,1fr)_320px]"><div className="rounded-[28px] border border-blue-100 bg-white p-6 shadow-sm sm:p-7"><h2 className="text-xl font-black text-[#0b1637]">Send a message</h2><p className="mt-1 text-sm leading-6 font-medium text-slate-500">Tell us a little about what you need. Including a booking reference helps us respond faster.</p>{sent ? <div className="mt-6 rounded-2xl border border-emerald-100 bg-emerald-50 p-6 text-center"><span className="mx-auto grid h-12 w-12 place-items-center rounded-2xl bg-white text-emerald-600 shadow-sm"><CheckCircle2 size={24} /></span><h3 className="mt-4 text-lg font-black text-emerald-800">Your message is on its way</h3><p className="mt-1 text-sm font-semibold text-emerald-700">We’ll get back to you within one business day.</p><button onClick={() => { setSent(false); setMessage('') }} className="mt-4 text-sm font-black text-[#0967ff]">Send another message</button></div> : <><div className="mt-6"><label className="text-xs font-black text-slate-600">Topic</label><select value={subject} onChange={event => setSubject(event.target.value)} className="mt-2 h-12 w-full rounded-xl border border-slate-100 bg-slate-50 px-4 text-sm font-bold text-slate-700 outline-none focus:border-[#0967ff] focus:ring-2 focus:ring-blue-100"><option>Booking help</option><option>Payment or wallet</option><option>Provider feedback</option><option>Privacy & data</option><option>Something else</option></select></div><div className="mt-4"><label className="text-xs font-black text-slate-600">Message</label><textarea value={message} onChange={event => setMessage(event.target.value)} rows={5} placeholder="Describe your question or issue…" className="mt-2 w-full resize-none rounded-xl border border-slate-100 bg-slate-50 px-4 py-3 text-sm font-medium text-slate-700 outline-none placeholder:text-slate-400 focus:border-[#0967ff] focus:ring-2 focus:ring-blue-100" /></div><button onClick={() => setSent(true)} disabled={!message.trim()} className="mt-5 inline-flex items-center gap-2 rounded-xl bg-[#0967ff] px-5 py-3.5 text-sm font-black text-white transition hover:bg-[#0759df] disabled:cursor-not-allowed disabled:opacity-50"><Send size={16} />Send message</button></>}</div><div className="rounded-[28px] border border-blue-100 bg-[#0b63e6] p-6 text-white shadow-lg shadow-blue-100"><span className="grid h-11 w-11 place-items-center rounded-2xl bg-white/15"><Sparkles size={20} /></span><h2 className="mt-5 text-xl font-black">A smoother service, every time.</h2><p className="mt-3 text-sm leading-6 font-semibold text-blue-100">Need to change a booking? The fastest option is often to message your provider directly from your order.</p><button onClick={() => navigate('orders')} className="mt-6 inline-flex items-center gap-2 rounded-xl bg-white px-4 py-3 text-sm font-black text-[#0967ff] transition hover:-translate-y-0.5">View my bookings <ArrowRight size={15} /></button></div></section>
  </>
}

function LegalView({ type, navigate }: { type: 'terms' | 'privacy'; navigate: Navigate }) {
  const [active, setActive] = useState(0)
  const sections = legalSections[type]
  const title = type === 'terms' ? 'Terms of service' : 'Privacy & your data'
  const description = type === 'terms' ? 'A plain-language guide to using Helpy, booking trusted providers and resolving questions.' : 'A clear overview of how we handle your information while helping you book with confidence.'
  return <>
    <PageHeading eyebrow={type === 'terms' ? 'Legal information' : 'Privacy centre'} title={title} description={description} action={<button onClick={() => navigate('contact-us')} className="inline-flex items-center gap-2 rounded-xl border border-blue-100 bg-white px-4 py-3 text-sm font-black text-[#0967ff] transition hover:bg-blue-50"><MessageCircle size={16} />Ask a question</button>} />
    <section className="grid items-start gap-6 2xl:grid-cols-[260px_minmax(0,1fr)]"><aside className="rounded-[24px] border border-blue-100 bg-white p-3 shadow-sm 2xl:sticky 2xl:top-24"><p className="px-3 pb-2 pt-1 text-[10px] font-black uppercase tracking-[.16em] text-slate-400">On this page</p><div className="space-y-1">{sections.map(([heading], index) => <button key={heading} onClick={() => setActive(index)} className={`flex w-full items-center gap-2 rounded-xl px-3 py-3 text-left text-sm font-bold transition ${active === index ? 'bg-blue-50 text-[#0967ff]' : 'text-slate-600 hover:bg-slate-50'}`}><span className={`h-1.5 w-1.5 rounded-full ${active === index ? 'bg-[#0967ff]' : 'bg-slate-300'}`} />{heading.replace(/^\d+\.\s/, '')}</button>)}</div></aside><article className="rounded-[28px] border border-blue-100 bg-white p-6 shadow-sm sm:p-8"><div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-5"><div><p className="text-sm font-black text-[#0b1637]">Helpy {type === 'terms' ? 'Terms of Service' : 'Privacy Policy'}</p><p className="mt-1 text-xs font-semibold text-slate-500">Last updated May 2024</p></div><span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1.5 text-xs font-black text-emerald-600"><ShieldCheck size={14} />Easy to understand</span></div><div className="mt-7 space-y-7">{sections.map(([heading, body], index) => <section key={heading} className={`scroll-mt-28 rounded-2xl p-1 transition ${active === index ? 'bg-blue-50/60' : ''}`}><div className="p-4"><h2 className="text-lg font-black tracking-tight text-[#0b1637]">{heading}</h2><p className="mt-3 max-w-3xl text-sm leading-7 font-medium text-slate-600">{body}</p></div></section>)}</div><div className="mt-6 flex flex-wrap items-center justify-between gap-4 rounded-2xl bg-[#f7faff] p-5"><div><p className="text-sm font-black text-[#0b1637]">Need a hand with this?</p><p className="mt-1 text-xs font-semibold text-slate-500">Our support team can clarify an account, booking or privacy question.</p></div><button onClick={() => navigate('contact-us')} className="rounded-xl bg-[#0967ff] px-4 py-3 text-sm font-black text-white">Contact support</button></div></article></section>
  </>
}

function Field({ label, value, editing, onChange, type = 'text' }: { label: string; value: string; editing: boolean; onChange: (value: string) => void; type?: string }) {
  return <label><span className="mb-2 block text-xs font-black text-slate-500">{label}</span>{editing ? <input value={value} type={type} onChange={event => onChange(event.target.value)} className="h-12 w-full rounded-xl border border-blue-100 bg-blue-50/50 px-4 text-sm font-bold text-[#0b1637] outline-none focus:border-[#0967ff] focus:ring-2 focus:ring-blue-100" /> : <div className="flex h-12 items-center rounded-xl border border-slate-100 bg-slate-50 px-4 text-sm font-bold text-slate-700">{value}</div>}</label>
}

function ToggleRow({ label, description, enabled, onChange }: { label: string; description: string; enabled: boolean; onChange: () => void }) {
  return <div className="flex items-center gap-3 rounded-xl bg-slate-50 p-3"><button onClick={onChange} className={`relative h-6 w-11 shrink-0 rounded-full transition ${enabled ? 'bg-[#0967ff]' : 'bg-slate-300'}`} role="switch" aria-checked={enabled} aria-label={label}><span className={`absolute top-1 h-4 w-4 rounded-full bg-white shadow-sm transition ${enabled ? 'left-6' : 'left-1'}`} /></button><div><p className="text-sm font-black text-[#0b1637]">{label}</p><p className="mt-0.5 text-xs font-semibold text-slate-500">{description}</p></div></div>
}

function TextInput({ label, value, onChange, placeholder }: { label: string; value: string; onChange: (value: string) => void; placeholder: string }) {
  return <label><span className="mb-2 block text-xs font-black text-slate-600">{label}</span><input value={value} onChange={event => onChange(event.target.value)} placeholder={placeholder} className="h-12 w-full rounded-xl border border-slate-100 bg-slate-50 px-4 text-sm font-bold text-slate-700 outline-none placeholder:font-medium placeholder:text-slate-400 focus:border-[#0967ff] focus:ring-2 focus:ring-blue-100" /></label>
}
