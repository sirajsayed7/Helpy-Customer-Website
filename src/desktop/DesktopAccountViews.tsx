import { useEffect, useState, type ElementType, type ReactNode } from 'react'
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
  LogOut,
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
import { useHelpyData } from '../context/HelpyDataContext'
import { hasHelpyUserSession, helpyApi } from '../api/helpy'

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

const accountItems: Array<{ screen: AccountScreen; label: string; icon: ElementType }> = [
  { screen: 'profile', label: 'My profile', icon: User },
  { screen: 'wallet', label: 'Wallet', icon: Wallet },
  { screen: 'favorites', label: 'Saved services', icon: Heart },
  { screen: 'addresses', label: 'Saved addresses', icon: MapPin },
]

const helpItems: Array<{ screen: AccountScreen; label: string; icon: ElementType }> = [
  { screen: 'contact-us', label: 'Help centre', icon: MessageCircle },
  { screen: 'terms', label: 'Terms of service', icon: FileText },
  { screen: 'privacy', label: 'Privacy & data', icon: ShieldCheck },
]

// Retained only for legacy dialog components below. Live account views do not
// use sample records or locally-mutated payment/address data.
const initialAddresses: Address[] = []
const favouriteProviders: any[] = []
const transactions: any[] = []


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
  if (!hasHelpyUserSession()) return <div className="rounded-[28px] border border-blue-100 bg-white px-6 py-20 text-center"><span className="mx-auto grid h-16 w-16 place-items-center rounded-3xl bg-blue-50 text-[#0967ff]"><User size={28}/></span><h1 className="mt-5 text-3xl font-black text-[#0b1637]">Sign in to view your account</h1><p className="mt-2 text-sm font-medium text-slate-500">Your profile and notifications are private.</p><button onClick={() => navigate('login')} className="mt-6 rounded-xl bg-[#0967ff] px-6 py-3 text-sm font-black text-white">Sign in</button></div>
  const accountScreen: AccountScreen = isAccountScreen(screen) ? screen : 'profile'
  // Notifications are a global destination from the header, not a nested profile setting.
  if (accountScreen === 'notifications') return <NotificationsView navigate={navigate} />
  const compactTop = accountScreen !== 'terms' && accountScreen !== 'privacy'

  const content = (() => {
    switch (accountScreen) {
      case 'profile': return <ProfileView />
      case 'wallet': return <WalletView />
      case 'favorites': return <FavoritesView navigate={navigate} />
      case 'addresses': return <AddressesView navigate={navigate} />
      case 'contact-us': return <ContactView navigate={navigate} />
      case 'terms': return <LegalView type="terms" navigate={navigate} />
      case 'privacy': return <LegalView type="privacy" navigate={navigate} />
      default: return <ProfileView />
    }
  })()

  return (
    <div className="mx-auto flex min-h-[calc(100dvh-122px)] max-w-[1280px] flex-col lg:min-h-[calc(100dvh-138px)]">
        {!compactTop && <div className="mb-7 flex flex-wrap items-center gap-2 text-sm font-semibold text-slate-500">
          <button onClick={() => navigate('home')} className="transition hover:text-[#0967ff]">Home</button>
          <ChevronRight size={15} className="text-slate-300" />
          <span className="text-slate-800">My account</span>
        </div>}
        <div data-account-layout className="mb-8 grid grid-cols-[204px_minmax(0,1fr)] items-start gap-6 lg:grid-cols-[220px_minmax(0,1fr)] lg:gap-7 xl:grid-cols-[240px_minmax(0,1fr)] xl:gap-8">
          <AccountRail active={accountScreen} navigate={navigate} />
          <div className="min-w-0">{content}</div>
        </div>
        <AccountLegalFooter navigate={navigate} />
    </div>
  )
}

function isAccountScreen(screen: Screen): screen is AccountScreen {
  return ['profile', 'wallet', 'favorites', 'addresses', 'notifications', 'contact-us', 'terms', 'privacy'].includes(screen)
}

function AccountRail({ active, navigate }: { active: AccountScreen; navigate: Navigate }) {
  const signOut = () => {
    helpyApi.clearSession()
    window.location.assign(`${window.location.pathname}${window.location.search}#home`)
  }
  return (
    <aside className="sticky top-24 h-fit min-w-0 overflow-hidden rounded-2xl border border-blue-100 bg-white shadow-sm">
      <nav className="p-2" aria-label="Account navigation">
        <div className="space-y-1">
          {accountItems.map(({ screen, label, icon: Icon }) => {
            const current = active === screen
            return <button key={screen} onClick={() => navigate(screen)} aria-current={current ? 'page' : undefined} className={`flex w-full items-center gap-3 rounded-xl px-3 py-3.5 text-left text-sm font-bold ${current ? 'bg-blue-50 text-[#0967ff]' : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'}`}>
              <Icon size={19} className="shrink-0" />
              <span className="min-w-0">{label}</span>
            </button>
          })}
        </div>
      </nav>
      <div className="border-t border-slate-100 p-2"><button onClick={signOut} className="flex w-full items-center gap-3 rounded-xl px-3 py-3.5 text-left text-sm font-bold text-slate-500 hover:bg-slate-50 hover:text-[#0967ff]"><LogOut size={19} className="shrink-0" />Sign out</button></div>
    </aside>
  )
}

function AccountLegalFooter({ navigate }: { navigate: Navigate }) {
  return <footer className="mt-auto border-t border-slate-200 pt-5"><nav className="flex flex-wrap gap-x-6 gap-y-3" aria-label="Support and legal">{helpItems.map(({ screen, label, icon: Icon }) => <button key={screen} onClick={() => navigate(screen)} className="inline-flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-[#0967ff]"><Icon size={16} />{label}</button>)}</nav></footer>
}

function PageHeading({ title, action, icon: Icon }: { eyebrow?: string; title: string; description?: string; action?: ReactNode; icon?: ElementType }) {
  return <div className="mb-6 flex min-w-0 flex-wrap items-center justify-between gap-4"><div className="flex min-w-0 items-center gap-3">{Icon && <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-blue-50 text-[#0967ff]"><Icon size={23} aria-hidden="true" /></span>}<h1 className="min-w-0 text-[28px] font-black leading-tight tracking-[-.035em] text-[#0b1637] [overflow-wrap:anywhere]">{title}</h1></div>{action}</div>
}

function ProfileView() {
  const data = useHelpyData()
  const [editing, setEditing] = useState(false)
  const [saved, setSaved] = useState(false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [form, setForm] = useState({ name: '', email: '', phone: '' })
  const profile = data.profile

  useEffect(() => {
    if (profile && !editing) setForm({ name: profile.name, email: profile.email, phone: profile.phone })
  }, [profile, editing])

  const saveProfile = async () => {
    setSaving(true); setError('')
    try {
      await data.updateProfile({ name: form.name, email: form.email, phoneNumber: form.phone, aboutMe: profile?.about || '' })
      setEditing(false); setSaved(true); window.setTimeout(() => setSaved(false), 2600)
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'Unable to update your profile.')
    } finally { setSaving(false) }
  }

  return <>
    <PageHeading title="My profile" icon={User} action={<div className="flex shrink-0 items-center gap-2">{editing && <button disabled={saving} onClick={() => { setEditing(false); setError('') }} className="rounded-xl border border-blue-100 bg-white px-4 py-2.5 text-sm font-bold text-slate-600 disabled:opacity-60">Cancel</button>}<button disabled={saving || data.accountLoading || !profile} onClick={() => editing ? void saveProfile() : setEditing(true)} className="inline-flex items-center gap-2 rounded-xl bg-[#0967ff] px-4 py-2.5 text-sm font-bold text-white hover:bg-[#0759df] disabled:opacity-60"><Edit3 size={16} />{saving ? 'Saving…' : editing ? 'Save changes' : 'Edit profile'}</button></div>} />
    {saved && <div role="status" className="mb-5 flex items-center gap-2 rounded-2xl border border-emerald-100 bg-emerald-50 px-4 py-3 text-sm font-bold text-emerald-700"><CheckCircle2 size={17} />Your profile changes have been saved.</div>}
    {error && <div role="alert" className="mb-5 rounded-2xl border border-rose-100 bg-rose-50 px-4 py-3 text-sm font-bold text-rose-600">{error}</div>}
    <section aria-label="Personal information" className="min-w-0 rounded-[24px] border border-blue-100 bg-white p-6 shadow-sm">
      {data.accountLoading && !profile ? <p role="status" className="text-sm font-semibold text-slate-500">Loading your profile…</p> : <div className="grid min-w-0 grid-cols-[repeat(auto-fit,minmax(min(100%,260px),1fr))] gap-5"><Field label="Full name" value={form.name} editing={editing} onChange={value => setForm(current => ({ ...current, name: value }))} /><Field label="Email address" value={form.email} editing={editing} type="email" onChange={value => setForm(current => ({ ...current, email: value }))} /><Field label="Mobile number" value={form.phone} editing={editing} type="tel" onChange={value => setForm(current => ({ ...current, phone: value }))} /></div>}
    </section>
  </>
}

function LegacyWalletView() {
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
    <PageHeading eyebrow="Helpy wallet" title="Pay your way" description="A simple balance for faster checkout, secure payments and refunds in one place." action={<button onClick={() => setDialog('topup')} className="inline-flex items-center gap-2 rounded-xl bg-[#0967ff] px-4 py-3 text-sm font-black text-white shadow-lg shadow-blue-200 transition hover:bg-[#0759df]"><Plus size={17} />Add funds</button>} />
    {notice && <div role="status" className="mb-5 flex items-center justify-between gap-3 rounded-2xl border border-emerald-100 bg-emerald-50 px-4 py-3 text-sm font-bold text-emerald-700"><span className="flex items-center gap-2"><CheckCircle2 size={17} />{notice}</span><button onClick={() => setNotice('')} aria-label="Dismiss message"><X size={16} /></button></div>}
    <section className="relative overflow-hidden rounded-[30px] bg-[linear-gradient(120deg,#073f9e_0%,#0967ff_53%,#38a3ff_100%)] p-7 text-white shadow-[0_24px_55px_rgba(9,103,255,.28)] sm:p-8"><div className="absolute -right-10 -top-20 h-64 w-64 rounded-full border-[26px] border-white/10" /><div className="absolute bottom-0 right-20 h-24 w-72 rounded-full bg-cyan-300/20 blur-2xl" /><div className="relative grid gap-6 lg:grid-cols-[1fr_auto]"><div><div className="flex items-center gap-2 text-sm font-bold text-blue-100"><Wallet size={17} />Available balance</div><p className="mt-4 text-4xl font-black tracking-[-.04em] sm:text-5xl">QAR {formattedBalance}</p><p className="mt-2 text-sm font-semibold text-blue-100">Ready for your next booking</p></div><div className="flex items-end gap-3"><button onClick={() => setDialog('topup')} className="rounded-xl bg-white px-5 py-3 text-sm font-black text-[#0967ff] shadow-lg shadow-blue-950/10 transition">Top up</button><button onClick={() => setDialog('withdraw')} className="rounded-xl border border-white/35 bg-white/10 px-5 py-3 text-sm font-black text-white transition hover:bg-white/20">Withdraw</button></div></div></section>
    <section className="mt-6 grid gap-6 2xl:grid-cols-[minmax(0,1fr)_320px]"><div className="overflow-hidden rounded-[26px] border border-blue-100 bg-white shadow-sm"><div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 px-6 py-5"><div><h2 className="text-lg font-black text-[#0b1637]">Recent activity</h2><p className="mt-1 text-sm font-medium text-slate-500">Every wallet movement, clearly itemised.</p></div><button className="text-sm font-black text-[#0967ff]">Download statement</button></div><div className="divide-y divide-slate-100">{transactions.map(({ label, merchant, date, amount: transactionAmount, positive, icon: Icon }) => <div key={label} className="flex items-center gap-4 px-6 py-4"><span className={`grid h-11 w-11 place-items-center rounded-2xl ${positive ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-500'}`}><Icon size={18} /></span><div className="min-w-0 flex-1"><p className="text-sm font-black text-[#0b1637]">{label}</p><p className="mt-0.5 truncate text-xs font-semibold text-slate-500">{merchant} · {date}</p></div><p className={`text-sm font-black ${positive ? 'text-emerald-600' : 'text-slate-800'}`}>{transactionAmount}</p></div>)}</div></div>
      <div className="rounded-[26px] border border-blue-100 bg-white p-6 shadow-sm"><div className="flex items-center gap-3"><span className="grid h-10 w-10 place-items-center rounded-xl bg-blue-50 text-[#0967ff]"><CreditCard size={19} /></span><div><h2 className="text-base font-black text-[#0b1637]">Payment method</h2><p className="text-xs font-semibold text-slate-500">Used for wallet top ups</p></div></div><div className="mt-6 rounded-2xl border border-slate-100 bg-slate-50 p-4"><div className="flex items-center justify-between"><span className="rounded-md bg-white px-2 py-1 text-[11px] font-black text-[#0967ff] shadow-sm">VISA</span><span className="text-xs font-black text-slate-500">Primary</span></div><p className="mt-5 text-lg font-black tracking-[.14em] text-[#0b1637]">•••• 4242</p><p className="mt-2 text-xs font-bold text-slate-500">Siraj Sayed · Expires 08/28</p></div><button onClick={() => setDialog('topup')} className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl border border-blue-100 py-3 text-sm font-black text-[#0967ff] transition hover:bg-blue-50"><Plus size={16} />Use another card</button><div className="mt-5 flex items-start gap-2 rounded-xl bg-blue-50 p-3 text-xs font-semibold leading-5 text-slate-600"><LockKeyhole size={15} className="mt-0.5 shrink-0 text-[#0967ff]" />Your card details are securely handled by our payment partner.</div></div></section>
    {dialog && <WalletDialog kind={dialog} amount={amount} setAmount={setAmount} method={method} setMethod={setMethod} balance={balance} onClose={() => { setDialog(null); setNotice('') }} onSubmit={submit} />}
  </>
}

function WalletDialog({ kind, amount, setAmount, method, setMethod, balance, onClose, onSubmit }: { kind: 'topup' | 'withdraw'; amount: string; setAmount: (value: string) => void; method: 'Visa •••• 4242' | 'Debit •••• 2201'; setMethod: (value: 'Visa •••• 4242' | 'Debit •••• 2201') => void; balance: number; onClose: () => void; onSubmit: () => void }) {
  const isTopup = kind === 'topup'
  return <div className="fixed inset-0 z-[70] grid place-items-center bg-[#091737]/45 px-4 py-6 backdrop-blur-sm" role="dialog" aria-modal="true" aria-labelledby="wallet-dialog-title"><div className="w-full max-w-md rounded-[28px] bg-white p-6 shadow-2xl"><div className="flex items-start justify-between gap-4"><div><p className="text-[11px] font-black uppercase tracking-[.15em] text-[#0967ff]">Helpy wallet</p><h2 id="wallet-dialog-title" className="mt-1 text-2xl font-black text-[#0b1637]">{isTopup ? 'Top up your balance' : 'Withdraw your funds'}</h2><p className="mt-2 text-sm leading-6 font-medium text-slate-500">{isTopup ? 'Choose an amount and payment method.' : `Available to withdraw: QAR ${balance.toFixed(2)}`}</p></div><button onClick={onClose} className="rounded-full bg-slate-100 p-2 text-slate-500" aria-label="Close"><X size={18} /></button></div><label className="mt-6 block"><span className="text-xs font-black text-slate-600">Amount in QAR</span><div className="mt-2 flex items-center rounded-xl border border-blue-100 bg-blue-50/50 px-4 focus-within:border-[#0967ff] focus-within:ring-2 focus-within:ring-blue-100"><span className="text-lg font-black text-[#0967ff]">QAR</span><input value={amount} onChange={event => setAmount(event.target.value.replace(/[^0-9.]/g, ''))} inputMode="decimal" className="h-14 w-full bg-transparent px-3 text-xl font-black text-[#0b1637] outline-none" aria-label="Amount in QAR" /></div></label><div className="mt-3 flex gap-2">{[100, 200, 500].map(value => <button key={value} onClick={() => setAmount(String(value))} className={`rounded-lg border px-3 py-2 text-xs font-black transition ${amount === String(value) ? 'border-[#0967ff] bg-blue-50 text-[#0967ff]' : 'border-slate-100 text-slate-500 hover:border-blue-100'}`}>QAR {value}</button>)}</div><div className="mt-6"><p className="text-xs font-black text-slate-600">{isTopup ? 'Pay with' : 'Deposit to'}</p><div className="mt-2 grid gap-2">{(['Visa •••• 4242', 'Debit •••• 2201'] as const).map(item => <button key={item} onClick={() => setMethod(item)} className={`flex items-center gap-3 rounded-xl border p-3 text-left ${method === item ? 'border-[#0967ff] bg-blue-50' : 'border-slate-100 hover:border-blue-100'}`}><span className="grid h-9 w-9 place-items-center rounded-lg bg-white text-[#0967ff] shadow-sm"><CreditCard size={16} /></span><span className="flex-1 text-sm font-black text-[#0b1637]">{item}</span>{method === item && <CheckCircle2 size={18} className="text-[#0967ff]" />}</button>)}</div></div><button onClick={onSubmit} className="mt-6 w-full rounded-xl bg-[#0967ff] py-3.5 text-sm font-black text-white transition hover:bg-[#0759df]">{isTopup ? 'Add funds' : 'Request withdrawal'}</button></div></div>
}

function LegacyFavoritesView({ navigate }: { navigate: Navigate }) {
  const [favourites, setFavourites] = useState(favouriteProviders)
  return <>
    <PageHeading eyebrow="Your saved list" title="Providers you love" description="Keep reliable local professionals within easy reach, then book again whenever life calls." action={<button onClick={() => navigate('all-services')} className="inline-flex items-center gap-2 rounded-xl bg-[#0967ff] px-4 py-3 text-sm font-black text-white shadow-lg shadow-blue-200 transition hover:bg-[#0759df]">Explore services <ArrowRight size={16} /></button>} />
    {favourites.length === 0 ? <div className="rounded-[28px] border border-dashed border-blue-200 bg-white px-6 py-20 text-center"><span className="mx-auto grid h-16 w-16 place-items-center rounded-3xl bg-rose-50 text-rose-400"><Heart size={29} /></span><h2 className="mt-5 text-xl font-black text-[#0b1637]">Your saved list is waiting</h2><p className="mx-auto mt-2 max-w-sm text-sm leading-6 font-medium text-slate-500">Browse trusted local providers and tap the heart on the ones you want to come back to.</p><button onClick={() => navigate('all-services')} className="mt-6 rounded-xl bg-[#0967ff] px-5 py-3 text-sm font-black text-white">Explore services</button></div> : <><div className="mb-5 flex items-center gap-2 text-sm font-bold text-slate-500"><Heart size={16} className="fill-rose-400 text-rose-400" /><span>{favourites.length} trusted providers saved for later</span></div><section className="grid gap-5 md:grid-cols-2 2xl:grid-cols-3">{favourites.map(provider => <article key={provider.id} onClick={() => navigate('service-detail', provider.service)} onKeyDown={event => { if (event.target === event.currentTarget && (event.key === 'Enter' || event.key === ' ')) { event.preventDefault(); navigate('service-detail', provider.service) } }} role="link" tabIndex={0} aria-label={`Book ${provider.name} again`} className="group cursor-pointer overflow-hidden rounded-[26px] border border-blue-100 bg-white shadow-sm transition duration-300 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-blue-200"><div className="relative h-44 overflow-hidden bg-blue-50"><img src={provider.image} alt="" className="h-full w-full object-cover transition duration-500" /><div className="absolute inset-0 bg-gradient-to-t from-[#071b52]/50 via-transparent to-transparent" /><span className="absolute bottom-3 left-3 rounded-full bg-white/95 px-2.5 py-1 text-[11px] font-black text-[#0b1637]">{provider.category}</span><button onClick={event => { event.stopPropagation(); setFavourites(items => items.filter(item => item.id !== provider.id)) }} className="absolute right-3 top-3 grid h-9 w-9 place-items-center rounded-xl bg-white text-rose-500 shadow-md transition" aria-label={`Remove ${provider.name} from favorites`}><Heart size={17} fill="currentColor" /></button></div><div className="p-5"><div className="flex items-start justify-between gap-3"><div><h2 className="text-lg font-black tracking-tight text-[#0b1637]">{provider.name}</h2><p className="mt-1 flex items-center gap-1 text-xs font-bold text-slate-500"><Star size={14} className="fill-amber-400 text-amber-400" />{provider.rating} <span className="text-slate-300">·</span> {provider.reviews} reviews</p></div><span className="rounded-lg bg-blue-50 px-2 py-1 text-[11px] font-black text-[#0967ff]">Saved</span></div><div className="mt-5 flex items-center justify-between gap-3"><span className="text-sm font-black text-[#0967ff]">{provider.price}</span><span className="rounded-xl bg-[#0967ff] px-4 py-2.5 text-sm font-black text-white transition group-hover:bg-[#0759df]">Book again</span></div></div></article>)}</section></>}
  </>
}

function LegacyAddressesView({ navigate }: { navigate: Navigate }) {
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
    <PageHeading eyebrow="Booking locations" title="Saved addresses" description="Make checkout faster by keeping the places you use most ready for your next service." action={<button onClick={() => setEditor('new')} className="inline-flex items-center gap-2 rounded-xl bg-[#0967ff] px-4 py-3 text-sm font-black text-white shadow-lg shadow-blue-200 transition hover:bg-[#0759df]"><Plus size={17} />Add address</button>} />
    {primary && <div className="mb-6 flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-blue-100 bg-blue-50 px-5 py-4"><div className="flex items-center gap-3"><span className="grid h-10 w-10 place-items-center rounded-xl bg-white text-[#0967ff] shadow-sm"><MapPin size={18} /></span><div><p className="text-sm font-black text-[#0b1637]">Your default service location</p><p className="mt-0.5 text-xs font-semibold text-slate-500">{primary.label} · {primary.address}</p></div></div><button onClick={() => navigate('all-services')} className="text-sm font-black text-[#0967ff]">Book a service</button></div>}
    <section className="grid gap-4">{addresses.map(address => <article key={address.id} className="group flex flex-col gap-5 rounded-[24px] border border-blue-100 bg-white p-5 shadow-sm transition hover:border-blue-200 sm:flex-row sm:items-center"><span className={`grid h-14 w-14 shrink-0 place-items-center rounded-2xl ${address.icon === 'work' ? 'bg-violet-50 text-violet-600' : address.icon === 'other' ? 'bg-amber-50 text-amber-600' : 'bg-blue-50 text-[#0967ff]'}`}>{address.icon === 'work' ? <Building2 size={22} /> : address.icon === 'other' ? <MapPin size={22} /> : <Home size={22} />}</span><div className="min-w-0 flex-1"><div className="flex flex-wrap items-center gap-2"><h2 className="text-base font-black text-[#0b1637]">{address.label}</h2>{address.primary && <span className="rounded-full bg-blue-50 px-2.5 py-1 text-[10px] font-black uppercase tracking-wide text-[#0967ff]">Default</span>}</div><p className="mt-1 text-sm font-bold text-slate-600">{address.address}</p><p className="mt-1 text-xs font-semibold text-slate-400">{address.detail}</p></div><div className="flex items-center gap-2"><button onClick={() => setEditor(address)} className="rounded-xl border border-slate-100 p-2.5 text-slate-500 transition hover:border-blue-100 hover:bg-blue-50 hover:text-[#0967ff]" aria-label={`Edit ${address.label}`}><Edit3 size={16} /></button>{!address.primary && <button onClick={() => makePrimary(address.id)} className="rounded-xl border border-slate-100 px-3 py-2.5 text-xs font-black text-slate-600 transition hover:border-blue-100 hover:bg-blue-50 hover:text-[#0967ff]">Set default</button>}<button onClick={() => remove(address.id)} className="rounded-xl border border-rose-100 p-2.5 text-rose-500 transition hover:bg-rose-50" aria-label={`Delete ${address.label}`}><Trash2 size={16} /></button></div></article>)}</section>
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

const asRecord = (value: unknown): Record<string, unknown> => value && typeof value === 'object' ? value as Record<string, unknown> : {}
const valueOf = (row: Record<string, unknown>, ...keys: string[]) => keys.map(key => row[key]).find(value => value !== null && value !== undefined && value !== '')
const textOf = (row: Record<string, unknown>, ...keys: string[]) => String(valueOf(row, ...keys) || '')
const money = (value: unknown) => new Intl.NumberFormat('en-QA', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(Number(value) || 0)

function WalletView() {
  const data = useHelpyData()
  const rows = data.walletHistory.map(asRecord)
  return <>
    <PageHeading title="Wallet" />
    <section className="relative overflow-hidden rounded-[30px] bg-[linear-gradient(120deg,#073f9e_0%,#0967ff_53%,#38a3ff_100%)] p-7 text-white shadow-[0_24px_55px_rgba(9,103,255,.28)] sm:p-8"><div className="relative"><div className="flex items-center gap-2 text-sm font-bold text-blue-100"><Wallet size={17} />Available balance</div><p className="mt-4 text-4xl font-black tracking-[-.04em] sm:text-5xl">QAR {money(data.profile?.wallet)}</p></div></section>
    <section className="mt-6 overflow-hidden rounded-[26px] border border-blue-100 bg-white shadow-sm"><div className="border-b border-slate-100 px-6 py-5"><h2 className="text-lg font-black text-[#0b1637]">Wallet activity</h2></div>{data.accountLoading && !rows.length ? <p className="px-6 py-12 text-center text-sm font-bold text-slate-500">Loading wallet activity…</p> : rows.length ? <div className="divide-y divide-slate-100">{rows.map((row, index) => { const amount = valueOf(row, 'amount', 'wallet_amount', 'transaction_amount', 'value'); const title = textOf(row, 'title', 'transaction_type_text', 'type_text', 'description', 'remarks') || 'Wallet activity'; const time = textOf(row, 'created_at_formatted', 'created_at', 'date'); return <div key={textOf(row, 'id', 'wallet_history_id', 'transaction_id') || index} className="flex items-center gap-4 px-6 py-4"><span className="grid h-11 w-11 place-items-center rounded-2xl bg-blue-50 text-[#0967ff]"><Wallet size={18}/></span><div className="min-w-0 flex-1"><p className="text-sm font-black text-[#0b1637]">{title}</p>{time && <p className="mt-0.5 text-xs font-semibold text-slate-500">{time}</p>}</div>{amount !== undefined && <p className="text-sm font-black text-[#0b1637]">QAR {money(amount)}</p>}</div> })}</div> : <div className="px-6 py-14 text-center"><Wallet className="mx-auto text-[#0967ff]" size={26}/><p className="mt-3 text-sm font-bold text-slate-600">No wallet activity was returned.</p></div>}</section>
  </>
}

function FavoritesView({ navigate }: { navigate: Navigate }) {
  const data = useHelpyData()
  const saved = data.favorites.map((value, index) => {
    const raw = asRecord(value)
    const id = textOf(raw, 'service_vendor_mapp_id', 'service_vendor_map_id', 'service_id', 'vendor_id', 'id')
    const related = data.services.find(service => String(service.serviceVendorMapId) === id || String(service.serviceId) === id || String(service.vendorId) === id)
    const name = textOf(raw, 'service_name', 'name_english', 'name', 'vendor_name', 'provider_name') || related?.name
    const provider = related?.provider && related.provider !== data.profile?.name ? related.provider : ''
    const image = textOf(raw, 'service_image_url', 'image_url', 'image', 'vendor_profile_image_url') || related?.image
    const category = textOf(raw, 'category_name', 'category_name_english') || related?.category
    return { key: id || String(index), name, provider, image, category, related }
  }).filter(item => Boolean(item.name || item.provider))
  return <>
    <PageHeading title="Saved services" action={<button onClick={() => navigate('all-services')} className="inline-flex items-center gap-2 rounded-xl bg-[#0967ff] px-4 py-3 text-sm font-black text-white shadow-lg shadow-blue-200">Browse services <ArrowRight size={16}/></button>} />
    {data.accountLoading && !saved.length ? <div className="rounded-[28px] border border-blue-100 bg-white px-6 py-16 text-center text-sm font-bold text-slate-500">Loading saved services…</div> : saved.length ? <section className="grid min-w-0 grid-cols-[repeat(auto-fill,minmax(min(100%,260px),1fr))] gap-5">{saved.map(item => <button key={item.key} onClick={() => item.related && navigate('service-detail', { service: item.related })} disabled={!item.related} className="min-w-0 overflow-hidden rounded-[24px] border border-blue-100 bg-white text-left shadow-sm disabled:cursor-default">{item.image ? <img src={item.image} alt="" className="h-44 w-full object-cover"/> : <div className="grid h-44 place-items-center bg-blue-50 text-2xl font-black text-blue-300">{(item.name || item.provider).slice(0, 1)}</div>}<div className="p-5"><p className="text-xs font-black text-[#0967ff]">{item.provider || item.category || 'Saved service'}</p><h2 className="mt-1 text-lg font-black text-[#0b1637] [overflow-wrap:anywhere]">{item.name || item.provider}</h2><p className="mt-2 min-h-5 text-xs font-semibold text-[#75839d]">{item.category || 'Service details'}</p>{item.related && <div className="mt-4 flex items-end justify-between"><span className="text-sm font-black text-[#0b1637]">QAR {money(item.related.price)}</span><span className="text-xs font-black text-[#66758f]"><Star size={14} className="mr-1 inline fill-amber-400 text-amber-400"/>{item.related.rating || 'New'}</span></div>}</div></button>)}</section> : <div className="rounded-[28px] border border-dashed border-blue-200 bg-white px-6 py-20 text-center"><Heart className="mx-auto text-[#0967ff]" size={29}/><h2 className="mt-5 text-xl font-black text-[#0b1637]">No saved services yet</h2><p className="mt-2 text-sm font-medium text-slate-500">Services you save from Helpy will appear here.</p></div>}
  </>
}

function AddressesView() {
  const data = useHelpyData()
  return <>
    <PageHeading title="Saved addresses" />
    {data.accountLoading && !data.addresses.length ? <div className="rounded-[28px] border border-blue-100 bg-white px-6 py-16 text-center text-sm font-bold text-slate-500">Loading saved addresses…</div> : data.addresses.length ? <section className="grid gap-4">{data.addresses.map(address => { const raw = address.raw; const details = ['building', 'building_no', 'building_number', 'street', 'street_name', 'zone', 'zone_number', 'floor', 'flat', 'apartment', 'landmark', 'notes', 'city_name', 'state_name'].map(key => textOf(raw, key)).filter(Boolean); return <article key={address.id} className="flex gap-5 rounded-[24px] border border-blue-100 bg-white p-5 shadow-sm"><span className="grid h-14 w-14 shrink-0 place-items-center rounded-2xl bg-blue-50 text-[#0967ff]"><MapPin size={22}/></span><div className="min-w-0"><h2 className="text-base font-black text-[#0b1637]">{address.title || 'Saved address'}</h2><p className="mt-1 text-sm font-bold text-slate-600">{address.address || 'Address details unavailable'}</p>{details.length > 0 && <p className="mt-2 text-sm leading-6 font-medium text-slate-500">{[...new Set(details)].join(' · ')}</p>}</div></article> })}</section> : <div className="rounded-[28px] border border-dashed border-blue-200 bg-white px-6 py-20 text-center"><MapPin className="mx-auto text-[#0967ff]" size={29}/><h2 className="mt-5 text-xl font-black text-[#0b1637]">No saved addresses yet</h2><p className="mt-2 text-sm font-medium text-slate-500">Your saved service locations will appear here.</p></div>}
  </>
}

function NotificationsView({ navigate }: { navigate: Navigate }) {
  const data = useHelpyData()
  type NotificationRow = { id: string; icon: ElementType; iconClass: string; title: string; description: string; time: string; unread: boolean; screen: Screen; params?: any }
  const mapNotification = (value: unknown, index: number): NotificationRow => {
    const row = value && typeof value === 'object' ? value as Record<string, unknown> : {}
    const text = (...keys: string[]) => String(keys.map(key => row[key]).find(item => item !== null && item !== undefined && item !== '') || '')
    const type = text('notification_type', 'type', 'event_type').toLowerCase()
    const bookingId = text('booking_id', 'order_id')
    const peerId = text('sender_id', 'vendor_id', 'from_id')
    const isMessage = type.includes('message') || type.includes('chat')
    const isWallet = type.includes('wallet') || type.includes('payment') || type.includes('refund')
    const isReview = type.includes('review') || type.includes('rating')
    const isOffer = type.includes('offer') || type.includes('promo')
    const target: Screen = bookingId ? 'order-detail' : isMessage ? 'chat-thread' : isWallet ? 'wallet' : isReview ? 'reviews' : isOffer ? 'deals' : 'notifications'
    const Icon = bookingId ? CalendarDays : isMessage ? MessageCircle : isWallet ? Wallet : isReview ? Star : isOffer ? Gift : Bell
    const iconClass = bookingId ? 'bg-blue-50 text-[#0967ff]' : isMessage ? 'bg-violet-50 text-violet-600' : isWallet ? 'bg-emerald-50 text-emerald-600' : isReview ? 'bg-amber-50 text-amber-600' : isOffer ? 'bg-rose-50 text-rose-500' : 'bg-blue-50 text-[#0967ff]'
    return { id: text('id', 'notification_id') || String(index), icon: Icon, iconClass, title: text('title', 'notification_title', 'subject') || 'Helpy update', description: text('message', 'body', 'description', 'notification_message'), time: text('created_at_formatted', 'time_ago', 'created_at', 'date'), unread: !row.read_at && row.is_read !== 1 && row.is_read !== true && row.status !== 'read', screen: target, params: bookingId ? { id: bookingId } : peerId ? { peerId } : undefined }
  }
  const [notifications, setNotifications] = useState<NotificationRow[]>([])
  const [error, setError] = useState('')
  useEffect(() => { setNotifications(data.notifications.map(mapNotification)) }, [data.notifications])
  const unreadCount = notifications.filter(notification => notification.unread).length
  const markAllRead = async () => {
    const previous = notifications
    setNotifications(items => items.map(item => ({ ...item, unread: false }))); setError('')
    try { await helpyApi.markAllNotificationsRead(); await data.refreshAccount() } catch (cause) { setNotifications(previous); setError(cause instanceof Error ? cause.message : 'Unable to mark notifications as read.') }
  }
  const open = async (id: string, target: Screen, params?: any) => {
    setNotifications(items => items.map(item => item.id === id ? { ...item, unread: false } : item))
    try { await helpyApi.markNotificationRead(id) } catch { /* Keep navigation responsive if this notification was already read. */ }
    if (target !== 'notifications') navigate(target, params)
  }
  return <>
    <PageHeading eyebrow="The latest from Helpy" title="Notifications" description={unreadCount ? `${unreadCount} updates are waiting for you. Stay on top of every booking, message and wallet movement.` : 'You are all caught up. New booking and account updates will appear here.'} action={<button onClick={() => void markAllRead()} disabled={!unreadCount} className="rounded-xl border border-blue-100 bg-white px-4 py-3 text-sm font-black text-[#0967ff] transition hover:bg-blue-50 disabled:cursor-not-allowed disabled:opacity-50">Mark all as read</button>} />
    {error && <div role="alert" className="mb-5 rounded-2xl border border-rose-100 bg-rose-50 px-4 py-3 text-sm font-bold text-rose-600">{error}</div>}
    {data.accountLoading && !notifications.length && <div className="rounded-[28px] border border-blue-100 bg-white px-6 py-16 text-center text-sm font-bold text-slate-500">Loading notifications from Helpy…</div>}
    {!data.accountLoading && !notifications.length && <div className="rounded-[28px] border border-dashed border-blue-200 bg-white px-6 py-20 text-center"><span className="mx-auto grid h-16 w-16 place-items-center rounded-3xl bg-blue-50 text-[#0967ff]"><Bell size={28}/></span><h2 className="mt-5 text-xl font-black text-[#0b1637]">You are all caught up</h2><p className="mt-2 text-sm font-medium text-slate-500">New booking and account notifications will appear here.</p></div>}
    {!!notifications.length &&
    <section className="overflow-hidden rounded-[28px] border border-blue-100 bg-white shadow-sm"><div className="flex items-center justify-between border-b border-slate-100 px-6 py-4"><span className="text-xs font-black uppercase tracking-[.15em] text-slate-400">Today</span>{unreadCount > 0 && <span className="rounded-full bg-[#0967ff] px-2.5 py-1 text-[10px] font-black text-white">{unreadCount} new</span>}</div><div className="divide-y divide-slate-100">{notifications.map(({ id, icon: Icon, iconClass, title, description, time, unread, screen: target, params }) => <button key={id} onClick={() => open(id, target, params)} className={`flex w-full items-start gap-4 px-6 py-5 text-left transition hover:bg-slate-50 ${unread ? 'bg-blue-50/40' : ''}`}><span className={`grid h-11 w-11 shrink-0 place-items-center rounded-2xl ${iconClass}`}><Icon size={19} /></span><span className="min-w-0 flex-1"><span className="flex flex-wrap items-center justify-between gap-2"><span className="text-sm font-black text-[#0b1637]">{title}</span><span className="text-xs font-bold text-slate-400">{time}</span></span><span className="mt-1 block max-w-2xl text-sm leading-6 font-medium text-slate-500">{description}</span></span>{unread && <span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-[#0967ff]" />}</button>)}</div></section>
    }
  </>
}

function ContactView({ navigate }: { navigate: Navigate }) {
  const [subject, setSubject] = useState('Booking help')
  const [message, setMessage] = useState('')
  const [sent, setSent] = useState(false)
  return <>
    <PageHeading eyebrow="We are here for you" title="How can we help?" description="Get fast answers, chat with our support team or send us the details and we’ll follow up." action={<button onClick={() => navigate('chat-thread', { name: 'Helpy Support', providerBg: 'bg-brand-500', providerEmoji: 'HS' })} className="inline-flex items-center gap-2 rounded-xl bg-[#0967ff] px-4 py-3 text-sm font-black text-white shadow-lg shadow-blue-200 transition hover:bg-[#0759df]"><MessageCircle size={17} />Chat with us</button>} />
    <section className="grid gap-4 md:grid-cols-3"><button onClick={() => navigate('chat-thread', { name: 'Helpy Support', providerBg: 'bg-brand-500', providerEmoji: 'HS' })} className="group rounded-[24px] border border-blue-100 bg-white p-5 text-left shadow-sm transition"><span className="grid h-11 w-11 place-items-center rounded-2xl bg-blue-50 text-[#0967ff]"><MessageCircle size={20} /></span><h2 className="mt-5 text-base font-black text-[#0b1637]">Live chat</h2><p className="mt-1 text-sm leading-6 font-medium text-slate-500">The quickest route for booking questions.</p><span className="mt-4 inline-flex items-center gap-1 text-sm font-black text-[#0967ff]">Start chat <ArrowRight size={14} /></span></button><a href="tel:+97452055553" className="group rounded-[24px] border border-blue-100 bg-white p-5 shadow-sm transition"><span className="grid h-11 w-11 place-items-center rounded-2xl bg-emerald-50 text-emerald-600"><Phone size={20} /></span><h2 className="mt-5 text-base font-black text-[#0b1637]">Call Helpy</h2><p className="mt-1 text-sm leading-6 font-medium text-slate-500">+974 5205 5553<br />Sun–Thu, 10 AM–4 PM</p><span className="mt-4 inline-flex items-center gap-1 text-sm font-black text-[#0967ff]">Call now <ArrowRight size={14} /></span></a><a href="mailto:helpyapp.tech@gmail.com" className="group rounded-[24px] border border-blue-100 bg-white p-5 shadow-sm transition"><span className="grid h-11 w-11 place-items-center rounded-2xl bg-violet-50 text-violet-600"><Mail size={20} /></span><h2 className="mt-5 text-base font-black text-[#0b1637]">Email us</h2><p className="mt-1 text-sm leading-6 font-medium text-slate-500">helpyapp.tech@gmail.com<br />We reply within one business day.</p><span className="mt-4 inline-flex items-center gap-1 text-sm font-black text-[#0967ff]">Write email <ArrowRight size={14} /></span></a></section>
    <section className="mt-6 grid gap-6 2xl:grid-cols-[minmax(0,1fr)_320px]"><div className="rounded-[28px] border border-blue-100 bg-white p-6 shadow-sm sm:p-7"><h2 className="text-xl font-black text-[#0b1637]">Send a message</h2><p className="mt-1 text-sm leading-6 font-medium text-slate-500">Tell us a little about what you need. Including a booking reference helps us respond faster.</p>{sent ? <div className="mt-6 rounded-2xl border border-emerald-100 bg-emerald-50 p-6 text-center"><span className="mx-auto grid h-12 w-12 place-items-center rounded-2xl bg-white text-emerald-600 shadow-sm"><CheckCircle2 size={24} /></span><h3 className="mt-4 text-lg font-black text-emerald-800">Your message is on its way</h3><p className="mt-1 text-sm font-semibold text-emerald-700">We’ll get back to you within one business day.</p><button onClick={() => { setSent(false); setMessage('') }} className="mt-4 text-sm font-black text-[#0967ff]">Send another message</button></div> : <><div className="mt-6"><label className="text-xs font-black text-slate-600">Topic</label><select value={subject} onChange={event => setSubject(event.target.value)} className="mt-2 h-12 w-full rounded-xl border border-slate-100 bg-slate-50 px-4 text-sm font-bold text-slate-700 outline-none focus:border-[#0967ff] focus:ring-2 focus:ring-blue-100"><option>Booking help</option><option>Payment or wallet</option><option>Provider feedback</option><option>Privacy & data</option><option>Something else</option></select></div><div className="mt-4"><label className="text-xs font-black text-slate-600">Message</label><textarea value={message} onChange={event => setMessage(event.target.value)} rows={5} placeholder="Describe your question or issue…" className="mt-2 w-full resize-none rounded-xl border border-slate-100 bg-slate-50 px-4 py-3 text-sm font-medium text-slate-700 outline-none placeholder:text-slate-400 focus:border-[#0967ff] focus:ring-2 focus:ring-blue-100" /></div><button onClick={() => setSent(true)} disabled={!message.trim()} className="mt-5 inline-flex items-center gap-2 rounded-xl bg-[#0967ff] px-5 py-3.5 text-sm font-black text-white transition hover:bg-[#0759df] disabled:cursor-not-allowed disabled:opacity-50"><Send size={16} />Send message</button></>}</div><div className="rounded-[28px] border border-blue-100 bg-[#0b63e6] p-6 text-white shadow-lg shadow-blue-100"><span className="grid h-11 w-11 place-items-center rounded-2xl bg-white/15"><Sparkles size={20} /></span><h2 className="mt-5 text-xl font-black">A smoother service, every time.</h2><p className="mt-3 text-sm leading-6 font-semibold text-blue-100">Need to change a booking? The fastest option is often to message your provider directly from your order.</p><button onClick={() => navigate('orders')} className="mt-6 inline-flex items-center gap-2 rounded-xl bg-white px-4 py-3 text-sm font-black text-[#0967ff] transition">View my bookings <ArrowRight size={15} /></button></div></section>
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
  return <label className="block min-w-0"><span className="mb-2 block text-xs font-bold text-slate-500">{label}</span>{editing ? <input value={value} type={type} onChange={event => onChange(event.target.value)} className="h-12 min-w-0 w-full rounded-xl border border-blue-100 bg-blue-50/50 px-4 text-sm font-semibold text-[#0b1637] outline-none focus:border-[#0967ff] focus:ring-2 focus:ring-blue-100" /> : <div className="min-h-12 min-w-0 rounded-xl border border-slate-100 bg-slate-50 px-4 py-3 text-sm font-semibold leading-6 text-slate-700 [overflow-wrap:anywhere]">{value || 'Not provided'}</div>}</label>
}

function ToggleRow({ label, description, enabled, onChange }: { label: string; description: string; enabled: boolean; onChange: () => void }) {
  return <div className="flex items-center gap-3 rounded-xl bg-slate-50 p-3"><button onClick={onChange} className={`relative h-6 w-11 shrink-0 rounded-full transition ${enabled ? 'bg-[#0967ff]' : 'bg-slate-300'}`} role="switch" aria-checked={enabled} aria-label={label}><span className={`absolute top-1 h-4 w-4 rounded-full bg-white shadow-sm transition ${enabled ? 'left-6' : 'left-1'}`} /></button><div><p className="text-sm font-black text-[#0b1637]">{label}</p><p className="mt-0.5 text-xs font-semibold text-slate-500">{description}</p></div></div>
}

function TextInput({ label, value, onChange, placeholder }: { label: string; value: string; onChange: (value: string) => void; placeholder: string }) {
  return <label><span className="mb-2 block text-xs font-black text-slate-600">{label}</span><input value={value} onChange={event => onChange(event.target.value)} placeholder={placeholder} className="h-12 w-full rounded-xl border border-slate-100 bg-slate-50 px-4 text-sm font-bold text-slate-700 outline-none placeholder:font-medium placeholder:text-slate-400 focus:border-[#0967ff] focus:ring-2 focus:ring-blue-100" /></label>
}
