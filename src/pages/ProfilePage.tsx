import { Bell, ChevronRight, Wallet, Globe, Heart, MapPin, MessageCircle, FileText, Shield, LogOut, PenLine, UserRound } from 'lucide-react'
import { useNav } from '../context/NavContext'
import { useHelpyData } from '../context/HelpyDataContext'
import { hasHelpyUserSession, helpyApi } from '../api/helpy'

const accountItems = [
  { Icon: Wallet, label: 'My Wallet', sub: 'View balance, payments & history', screen: 'wallet' },
  { Icon: Globe, label: 'Language', sub: 'Choose your preferred language', screen: null, right: 'English' },
  { Icon: Heart, label: 'My Favorites', sub: 'Saved services and businesses', screen: 'favorites' },
  { Icon: MapPin, label: 'Manage Addresses', sub: 'Your saved service locations', screen: 'addresses' },
]
const moreItems = [
  { Icon: MessageCircle, label: 'Contact Us', sub: 'We’re here to help', screen: 'contact-us' },
  { Icon: FileText, label: 'Terms of Service', sub: 'Read our terms and conditions', screen: 'terms' },
  { Icon: Shield, label: 'Privacy Policy', sub: 'How we protect your data', screen: 'privacy' },
]

export default function ProfilePage() {
  const { navigate } = useNav()
  const data = useHelpyData()
  const profile = data.profile
  const signedIn = hasHelpyUserSession()
  const initials = (profile?.name || 'H').split(/\s+/).map(word => word[0]).join('').slice(0, 2).toUpperCase()
  const signOut = () => { helpyApi.clearSession(); window.location.assign(`${window.location.pathname}${window.location.search}#home`) }
  return <div className="relative flex flex-1 flex-col overflow-hidden bg-[#edf7ff]">
    <div className="absolute inset-0 bg-[linear-gradient(180deg,#f7fcff_0%,#edf7ff_46%,#f3f8ff_100%)]"/>
    <div className="relative z-10 flex items-center justify-between px-5 pb-3 pt-3"><div><h1 className="text-[24px] font-bold text-gray-900">Profile</h1><p className="mt-0.5 text-[12px] text-gray-400">Manage your account and preferences</p></div><button onClick={() => navigate('notifications')} className="relative grid h-10 w-10 place-items-center rounded-xl bg-white shadow-sm"><Bell size={19} className="text-gray-600"/>{data.notifications.length > 0 && <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-brand-500"/>}</button></div>
    <div className="relative z-10 flex-1 space-y-4 overflow-y-auto px-4 pb-32">
      {!signedIn ? <div className="rounded-2xl bg-white p-5 text-center shadow-sm"><UserRound size={30} className="mx-auto text-[#0967ff]"/><h2 className="mt-3 text-[17px] font-black text-gray-900">Your Helpy account</h2><p className="mt-1 text-[12px] text-gray-500">Sign in to manage your profile, addresses and bookings.</p><button onClick={() => navigate('login')} className="mt-4 rounded-xl bg-brand-500 px-5 py-2.5 text-[13px] font-black text-white">Sign in</button></div> : <>
        <button onClick={() => navigate('profile')} className="flex w-full items-center gap-4 rounded-2xl bg-white p-4 text-left shadow-sm"><div className="relative shrink-0"><div className="grid h-[72px] w-[72px] place-items-center overflow-hidden rounded-full bg-gradient-to-br from-blue-300 to-blue-600 text-xl font-black text-white shadow-md">{profile?.image ? <img src={profile.image} alt="" className="h-full w-full object-cover"/> : initials}</div><span className="absolute bottom-0 right-0 grid h-6 w-6 place-items-center rounded-full border-2 border-white bg-brand-500"><PenLine size={11} className="text-white"/></span></div><div className="min-w-0 flex-1"><p className="truncate text-[18px] font-bold text-gray-900">{data.accountLoading ? 'Loading profile…' : profile?.name || 'Your profile'}</p><p className="mt-0.5 truncate text-[12px] text-gray-500">{profile?.email || ''}</p><div className="mt-1.5 flex w-fit items-center gap-1 rounded-full bg-blue-50 px-2.5 py-1"><span className="text-[11px] text-brand-500">✦</span><span className="text-[11px] font-semibold text-brand-500">Helpy member</span></div></div><ChevronRight size={18} className="text-gray-300"/></button>
        <SettingsList title="Account" items={accountItems} navigate={navigate}/>
        <SettingsList title="More" items={moreItems} navigate={navigate}/>
        <div className="overflow-hidden rounded-2xl bg-white shadow-sm"><button onClick={signOut} className="flex w-full items-center gap-3 px-4 py-4 active:bg-red-50"><span className="grid h-9 w-9 place-items-center rounded-xl bg-red-50"><LogOut size={17} className="text-red-500"/></span><span className="flex-1 text-left text-[14px] font-bold text-red-500">Sign Out</span><ChevronRight size={15} className="text-gray-300"/></button></div>
      </>}
    </div>
  </div>
}

function SettingsList({ title, items, navigate }: { title: string; items: Array<{ Icon: typeof Wallet; label: string; sub: string; screen: string | null; right?: string }>; navigate: (screen: any) => void }) { return <div><div className="mb-2 flex items-center gap-2 px-0.5"><span className="h-4 w-1 rounded-full bg-brand-500"/><p className="text-[14px] font-bold text-gray-800">{title}</p></div><div className="divide-y divide-gray-50 overflow-hidden rounded-2xl bg-white shadow-sm">{items.map(item => <button key={item.label} onClick={() => item.screen && navigate(item.screen)} className="flex w-full items-center gap-3 px-4 py-3.5 text-left active:bg-gray-50"><span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-blue-50"><item.Icon size={17} className="text-blue-500"/></span><span className="min-w-0 flex-1"><span className="block text-[13px] font-semibold text-gray-800">{item.label}</span><span className="mt-0.5 block text-[11px] text-gray-400">{item.sub}</span></span>{item.right ? <span className="rounded-xl bg-gray-100 px-3 py-1.5 text-[12px] font-semibold text-gray-700">{item.right}</span> : <ChevronRight size={15} className="shrink-0 text-gray-300"/>}</button>)}</div></div> }
