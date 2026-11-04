import { Home, ShoppingBag, MessageCircle, User } from 'lucide-react'
import { useNav } from '../context/NavContext'

// The browser app is content-first, not a device-frame mockup.  Individual
// pages still render this shared slot so their layouts automatically begin at
// the very top without each screen needing special-case spacing.
export function StatusBar(_: { light?: boolean; time?: string }) {
  return null
}

const TABS = [
  { id:'home',   label:'Home',    Icon: Home },
  { id:'orders', label:'Order',   Icon: ShoppingBag },
  { id:'chat',   label:'Chat',    Icon: MessageCircle, badge: true },
  { id:'profile',label:'Profile', Icon: User },
]

export function BottomNav() {
  const { activeTab, setActiveTab, bookedServices } = useNav()
  const unread = Math.max(3, bookedServices.length)
  return (
    <div className="absolute bottom-2 left-3 right-3 z-50 pointer-events-none" style={{paddingBottom:'env(safe-area-inset-bottom)'}}>
      <div className="pointer-events-auto flex items-center justify-around rounded-[24px] border border-white/95 bg-white/[.86] px-2 pb-3 pt-2 shadow-[0_14px_36px_rgba(25,66,121,.16),inset_0_1px_0_rgba(255,255,255,.95)] backdrop-blur-2xl max-[360px]:px-1 max-[360px]:pb-2">
        {TABS.map(({ id, label, Icon, badge }) => {
          const active = activeTab === id
          return (
            <button key={id} onClick={() => setActiveTab(id)} className={`relative flex flex-col items-center gap-0.5 min-w-[62px] max-[360px]:min-w-[56px] rounded-2xl transition-all ${active ? 'text-[#0867e8]' : 'text-[#5e6678]'}`}>
              {active && <span className="absolute -top-2 h-1 w-9 rounded-full bg-[#0867e8]"/>}
              <div className={`relative w-10 h-9 rounded-[16px] flex items-center justify-center transition-all ${active ? 'bg-blue-50' : ''}`}>
                <Icon size={22} strokeWidth={active ? 2.7 : 2.1} className={active ? 'text-[#0867e8]' : 'text-[#4b5565]'}/>
                {badge && unread > 0 && (
                  <span className="absolute -top-2 -right-1 min-w-[19px] h-[19px] px-1 rounded-full bg-[#0867e8] text-white text-[10px] font-black flex items-center justify-center">{unread}</span>
                )}
              </div>
              <span className={`text-[11px] font-bold ${active ? 'text-[#0867e8]' : 'text-[#4b5565]'}`}>{label}</span>
            </button>
          )
        })}
      </div>
    </div>
  )
}

export function HelpyLogo({ size = 'md', withWord = true }: { size?: 'sm'|'md'|'lg'|'xl'; withWord?: boolean }) {
  const cls = size === 'xl' ? 'w-36' : size === 'lg' ? 'w-[120px]' : size === 'md' ? 'w-24' : 'w-[72px]'
  const word = size === 'xl' ? 'text-[28px]' : size === 'lg' ? 'text-[24px]' : 'text-[18px]'
  return (
    <div className="flex flex-col items-center justify-center leading-none">
      <img src="/assets/helpy-logo-transparent.png" alt="Helpy" className={`${cls} object-contain`} />
      {withWord && <span className={`${word} font-black tracking-tight text-[#111032] -mt-1`}>Helpy</span>}
    </div>
  )
}
