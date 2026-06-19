import { Home, ShoppingBag, MessageCircle, User } from 'lucide-react'
import { useNav } from '../context/NavContext'

export function StatusBar({ light = false, time = '9:41' }: { light?: boolean; time?: string }) {
  const c = light ? 'text-white' : 'text-black'
  const fill = light ? 'white' : '#0b1020'
  return (
    <div className="flex items-center justify-between px-6 pt-4 pb-2 shrink-0 z-20 relative">
      <span className={`text-[17px] font-black tracking-tight ${c}`}>{time}</span>
      <div className="flex items-center gap-1.5">
        <svg width="24" height="16" viewBox="0 0 24 16" fill="none">
          {[0,6,12,18].map((x,i)=><rect key={x} x={x} y={[9,6,3,0][i]} width="4" height={[7,10,13,16][i]} rx="1.5" fill={fill}/>) }
        </svg>
        <svg width="22" height="16" viewBox="0 0 22 16" fill="none">
          <circle cx="11" cy="13" r="2" fill={fill}/>
          <path d="M6.5,9.5 C8.1,8 9.6,7.2 11,7.2 C12.4,7.2 13.9,8 15.5,9.5" stroke={fill} strokeWidth="2" strokeLinecap="round" fill="none"/>
          <path d="M2.5,5.7 C5,3.5 7.8,2.4 11,2.4 C14.2,2.4 17,3.5 19.5,5.7" stroke={fill} strokeWidth="2" strokeLinecap="round" fill="none"/>
        </svg>
        <svg width="31" height="16" viewBox="0 0 31 16" fill="none">
          <rect x="1" y="2" width="25" height="12" rx="3" stroke={fill} strokeWidth="2"/>
          <rect x="4" y="5" width="18" height="6" rx="1.5" fill={fill}/>
          <path d="M28,6 L28,10" stroke={fill} strokeWidth="2" strokeLinecap="round"/>
        </svg>
      </div>
    </div>
  )
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
      <div className="pointer-events-auto bg-white/96 backdrop-blur-xl rounded-[24px] shadow-[0_14px_36px_rgba(15,23,42,0.14)] border border-white/80 flex items-center justify-around px-2 max-[360px]:px-1 pt-2 pb-3 max-[360px]:pb-2">
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
