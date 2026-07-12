import { useState } from 'react'
import { ArrowLeft, Bell, Star, Heart, MapPin, ChevronRight, CreditCard, Plus, Minus, Clock, CheckCircle2, Search, Shield, FileText, MessageCircle, Phone, Mail, Send, CalendarDays, X } from 'lucide-react'
import { useNav } from '../context/NavContext'
import { StatusBar } from '../components/shared'

/* ── shared sub-page shell ── */
function Shell({ title, sub, children, rightEl }: { title:string;sub?:string;children:React.ReactNode;rightEl?:React.ReactNode }) {
  const { goBack } = useNav()
  return (
    <div className="flex flex-col flex-1 bg-[#F4F6FF] overflow-hidden">
      <StatusBar/>
      <div className="flex items-center justify-between px-4 pt-1 pb-3 shrink-0">
        <div className="flex items-center gap-3">
          <button onClick={goBack} className="w-10 h-10 bg-white rounded-xl shadow-sm flex items-center justify-center"><ArrowLeft size={20} className="text-gray-600"/></button>
          <div><p className="text-[18px] font-bold text-gray-900">{title}</p>{sub&&<p className="text-[11px] text-gray-400">{sub}</p>}</div>
        </div>
        {rightEl}
      </div>
      <div className="flex-1 overflow-y-auto px-4 pb-28 space-y-4">{children}</div>
    </div>
  )
}

/* ── Notifications ── */
function NotificationsPage() {
  const NOTIFS = [
    {icon:'QR',color:'bg-green-100', title:'Wallet Top Up',             body:'250.00 QR was added to your Helpy Wallet using your credit card.',time:'9:20 AM',read:false},
    {icon:'QR',color:'bg-sky-100',   title:'Withdrawal Processed',      body:'300.00 QR withdrawal request was processed to your debit card.',time:'Yesterday',read:true},
    {icon:'📅',color:'bg-blue-100', title:'Booking Confirmed',        body:'Scrubs Cleaning confirmed your May 30 booking at 12:00 PM.',time:'10:30 AM',read:false},
    {icon:'💬',color:'bg-purple-100',title:'New Message',              body:'Scrubs Cleaning: "Hi! We\'re on our way to your location."',time:'9:45 AM', read:false},
    {icon:'💰',color:'bg-green-100', title:'Payment Processed',         body:'Payment of 160.00 QR confirmed for General Cleaning.',  time:'Yesterday',read:true},
    {icon:'⭐',color:'bg-amber-100', title:'Leave a Review',            body:'How was your Deep Cleaning with Happy Home Services?',   time:'May 28',   read:true},
    {icon:'🎁',color:'bg-pink-100',  title:'Special Offer',             body:'Get 20% OFF your next booking this weekend only!',       time:'May 25',   read:true},
    {icon:'🔔',color:'bg-blue-100',  title:'Booking Reminder',          body:'Reminder: Scrubs Cleaning tomorrow at 12:00 PM.',        time:'May 29',   read:true},
  ]
  const [list, setList] = useState(NOTIFS)
  return (
    <Shell title="Notifications" sub={`${list.filter(n=>!n.read).length} unread`} rightEl={<button onClick={()=>setList(l=>l.map(n=>({...n,read:true})))} className="text-brand-500 text-[12px] font-semibold">Mark all read</button>}>
      <div className="bg-white rounded-2xl shadow-sm overflow-hidden divide-y divide-gray-50">
        {list.map((n,i)=>(
          <button key={i} onClick={()=>setList(l=>l.map((x,j)=>j===i?{...x,read:true}:x))} className={`w-full flex items-start gap-3 p-4 text-left ${!n.read?'bg-blue-50/30':''}`}>
            <div className={`w-10 h-10 rounded-xl ${n.color} flex items-center justify-center shrink-0 text-lg`}>{n.icon}</div>
            <div className="flex-1">
              <div className="flex items-start justify-between gap-2">
                <p className={`text-[13px] ${n.read?'font-semibold text-gray-700':'font-bold text-gray-900'}`}>{n.title}</p>
                <span className="text-[10px] text-gray-400 shrink-0">{n.time}</span>
              </div>
              <p className="text-[11px] text-gray-500 mt-0.5 leading-snug">{n.body}</p>
            </div>
            {!n.read&&<span className="w-2 h-2 rounded-full bg-brand-500 shrink-0 mt-2"/>}
          </button>
        ))}
      </div>
    </Shell>
  )
}

/* ── Order Detail ── */
function OrderDetailPage() {
  const { params, navigate } = useNav()
  const o = params || { provider:'Scrubs Cleaning', service:'General Cleaning', date:'May 30, 2024', time:'12:00 PM', price:'160.00', status:'Confirmed', providerBg:'bg-red-500', providerEmoji:'🧹', location:'The Pearl-Qatar' }
  const SC: Record<string,string> = { Confirmed:'bg-green-100 text-green-600', 'In Progress':'bg-amber-100 text-amber-600', Completed:'bg-blue-100 text-blue-600' }
  return (
    <Shell title="Order Details">
      <div className="bg-white rounded-2xl shadow-sm p-5">
        <div className="flex items-center gap-3 mb-4">
          <div className={`w-14 h-14 rounded-full ${o.providerBg} flex items-center justify-center text-white text-2xl shadow-sm`}>{o.providerEmoji}</div>
          <div className="flex-1">
            <p className="text-[16px] font-bold text-gray-900">{o.provider}</p>
            <p className="text-[13px] text-brand-500 font-semibold">{o.service}</p>
          </div>
          <span className={`text-[11px] font-semibold px-3 py-1 rounded-full ${SC[o.status]||'bg-gray-100 text-gray-600'}`}>{o.status}</span>
        </div>
        <div className="space-y-3 pt-3 border-t border-gray-50">
          {[{icon:CalendarDays,label:'Date & Time',val:`${o.date} • ${o.time}`},{icon:MapPin,label:'Location',val:o.location}].map(({icon:I,label,val})=>(
            <div key={label} className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-blue-50 flex items-center justify-center"><I size={15} className="text-brand-500"/></div>
              <div><p className="text-[10px] text-gray-400">{label}</p><p className="text-[13px] font-semibold text-gray-800">{val}</p></div>
            </div>
          ))}
        </div>
      </div>
      <div className="bg-white rounded-2xl shadow-sm p-5">
        <p className="text-[14px] font-bold text-gray-800 mb-3">Payment Summary</p>
        <div className="space-y-2">
          <div className="flex justify-between"><span className="text-[13px] text-gray-500">Service fee</span><span className="text-[13px] font-semibold">{o.price} QR</span></div>
          <div className="flex justify-between"><span className="text-[13px] text-gray-500">Platform fee</span><span className="text-[13px] font-semibold text-green-500">FREE</span></div>
          <div className="h-px bg-gray-100 my-1"/>
          <div className="flex justify-between"><span className="text-[14px] font-bold text-gray-900">Total</span><span className="text-[14px] font-bold text-brand-500">{o.price} QR</span></div>
        </div>
      </div>
      {o.status !== 'Completed' && (
        <button onClick={()=>navigate('chat-thread',{name:o.provider,providerBg:o.providerBg,providerEmoji:o.providerEmoji,id:o.id})}
          className="w-full py-4 rounded-2xl bg-brand-500 text-white text-[14px] font-bold flex items-center justify-center gap-2">
          <MessageCircle size={18}/> Chat with Provider
        </button>
      )}
      {o.status === 'Completed' && (
        <button className="w-full py-4 rounded-2xl bg-amber-500 text-white text-[14px] font-bold flex items-center justify-center gap-2">
          <Star size={18}/> Leave a Review
        </button>
      )}
    </Shell>
  )
}

/* ── Wallet ── */
function WalletPage() {
  const [flow, setFlow] = useState<'home'|'topup'|'withdraw'|'done'>('home')
  const [method, setMethod] = useState<'Credit Card'|'Debit Card'>('Credit Card')
  const [lastAction, setLastAction] = useState<'Top-up completed'|'Withdraw processed'>('Top-up completed')
  const TX = [
    {type:'credit',label:'General Cleaning Refund',   date:'May 30',amount:'+20.00'},
    {type:'debit', label:'Payment - Scrubs Cleaning', date:'May 30',amount:'-160.00'},
    {type:'credit',label:'Referral Bonus',             date:'May 25',amount:'+15.00'},
    {type:'debit', label:'Payment - Happy Home',       date:'May 20',amount:'-220.00'},
    {type:'credit',label:'Top Up',                    date:'May 18',amount:'+200.00'},
  ]

  if (flow === 'done') {
    return (
      <Shell title="My Wallet" sub={lastAction}>
        <div className="flex flex-col items-center justify-center py-16 text-center gap-4">
          <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center">
            <CheckCircle2 size={42} className="text-green-500"/>
          </div>
          <div>
            <p className="text-[22px] font-black text-gray-900">{lastAction}</p>
            <p className="mt-2 text-[13px] leading-5 text-gray-500">Your {method.toLowerCase()} request was processed successfully.</p>
          </div>
          <button onClick={()=>setFlow('home')} className="w-full h-13 py-4 rounded-2xl bg-brand-500 text-white text-[14px] font-black">Back to Wallet</button>
        </div>
      </Shell>
    )
  }

  if (flow === 'topup' || flow === 'withdraw') {
    const isTopUp = flow === 'topup'
    return (
      <Shell title={isTopUp ? 'Top Up Wallet' : 'Withdraw Funds'} sub="Choose a payment method">
        <div className="rounded-3xl p-5 text-white" style={{background:'linear-gradient(135deg,#1D4ED8,#2563EB,#3B82F6)'}}>
          <p className="text-white/70 text-[13px]">{isTopUp ? 'Amount to add' : 'Amount to withdraw'}</p>
          <p className="text-[34px] font-black mt-1">{isTopUp ? '250.00' : '300.00'} QR</p>
        </div>
        <div className="bg-white rounded-2xl shadow-sm p-4 space-y-3">
          <p className="text-[14px] font-black text-gray-900">Payment Method</p>
          {(['Credit Card','Debit Card'] as const).map(m=>(
            <button key={m} onClick={()=>setMethod(m)} className={`w-full flex items-center gap-3 p-4 rounded-2xl border text-left ${method===m?'border-brand-500 bg-blue-50':'border-gray-100 bg-white'}`}>
              <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center"><CreditCard size={18} className="text-brand-500"/></div>
              <div className="flex-1"><p className="text-[14px] font-bold text-gray-900">{m}</p><p className="text-[11px] text-gray-500">Ending in {m==='Credit Card'?'4242':'2201'}</p></div>
              {method===m&&<CheckCircle2 size={19} className="text-brand-500"/>}
            </button>
          ))}
        </div>
        <button
          onClick={()=>{setLastAction(isTopUp ? 'Top-up completed' : 'Withdraw processed'); setFlow('done')}}
          className="w-full py-4 rounded-2xl bg-brand-500 text-white text-[14px] font-black shadow-lg shadow-blue-200"
        >
          {isTopUp ? 'Confirm Top Up' : 'Process Withdrawal'}
        </button>
      </Shell>
    )
  }

  return (
    <Shell title="My Wallet" sub="Balance & payment history">
      <div className="rounded-3xl p-6 text-white" style={{background:'linear-gradient(135deg,#1D4ED8,#2563EB,#3B82F6)'}}>
        <p className="text-white/70 text-[13px]">Available Balance</p>
        <p className="text-[36px] font-black mt-1">855.00 QR</p>
        <div className="flex gap-3 mt-4">
          <button onClick={()=>setFlow('topup')} className="flex-1 bg-white/20 rounded-xl py-2.5 text-[13px] font-bold">Top Up</button>
          <button onClick={()=>setFlow('withdraw')} className="flex-1 bg-white rounded-xl py-2.5 text-[13px] font-bold text-brand-500">Withdraw</button>
        </div>
      </div>
      <div>
        <p className="text-[15px] font-bold text-gray-900 mb-3">Recent Transactions</p>
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden divide-y divide-gray-50">
          {TX.map((t,i)=>(
            <div key={i} className="flex items-center gap-3 p-4">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${t.type==='credit'?'bg-green-50':'bg-red-50'}`}>
                <span className={`text-lg font-bold ${t.type==='credit'?'text-green-500':'text-red-400'}`}>{t.type==='credit'?'↑':'↓'}</span>
              </div>
              <div className="flex-1"><p className="text-[13px] font-bold text-gray-900">{t.label}</p><p className="text-[11px] text-gray-400">{t.date}</p></div>
              <p className={`text-[14px] font-bold ${t.type==='credit'?'text-green-500':'text-red-400'}`}>{t.amount} QR</p>
            </div>
          ))}
        </div>
      </div>
    </Shell>
  )
}

/* ── Favorites ── */
function FavoritesPage() {
  const { navigate } = useNav()
  const [favs, setFavs] = useState([
    {id:'scrubs',name:'Scrubs Cleaning',  tag:'Home Services',rating:'4.8',from:'160.00',emoji:'🧹',bg:'bg-red-500',  service:{name:'General Cleaning',provider:'Scrubs Cleaning',price:'160.00',providerBg:'bg-red-500',providerEmoji:'🧹'}},
    {id:'glow',  name:'Glow Salon & Spa', tag:'Salon & Spa',  rating:'4.9',from:'80.00', emoji:'💆',bg:'bg-pink-500', service:{name:'Luxury Spa Package',provider:'Glow Salon & Spa',price:'120.00',providerBg:'bg-pink-500',providerEmoji:'💅'}},
    {id:'spark', name:'Sparkle Auto Wash',tag:'Car Services', rating:'4.7',from:'45.00', emoji:'🚗',bg:'bg-blue-500', service:{name:'Premium Car Wash',provider:'Sparkle Auto Wash',price:'45.00',providerBg:'bg-blue-500',providerEmoji:'🚗'}},
  ])
  return (
    <Shell title="My Favorites" sub={`${favs.length} saved services`}>
      {favs.length === 0 && <div className="flex flex-col items-center py-16 gap-3"><span className="text-5xl">💔</span><p className="text-[14px] font-semibold text-gray-400">No favorites yet</p></div>}
      {favs.map(f=>(
        <button key={f.id} onClick={()=>navigate('service-detail',f.service)} className="w-full bg-white rounded-2xl shadow-sm p-4 flex items-center gap-4 text-left active:scale-[0.99] transition-transform">
          <div className={`w-14 h-14 rounded-2xl ${f.bg} flex items-center justify-center text-white text-2xl shrink-0`}>{f.emoji}</div>
          <div className="flex-1">
            <p className="text-[14px] font-bold text-gray-900">{f.name}</p>
            <span className="text-[11px] font-semibold text-brand-500 bg-blue-50 px-2 py-0.5 rounded-full">{f.tag}</span>
            <div className="flex items-center gap-2 mt-1">
              <div className="flex items-center gap-1"><Star size={12} className="text-amber-400 fill-amber-400"/><span className="text-[12px] font-semibold text-gray-700">{f.rating}</span></div>
              <span className="text-[12px] font-bold text-brand-500">from {f.from} QR</span>
            </div>
          </div>
          <button onClick={e=>{e.stopPropagation();setFavs(p=>p.filter(x=>x.id!==f.id))}} className="w-9 h-9 rounded-xl bg-red-50 flex items-center justify-center">
            <Heart size={16} className="text-red-400 fill-red-400"/>
          </button>
        </button>
      ))}
    </Shell>
  )
}

/* ── Addresses ── */
function AddressesPage() {
  const [addrs] = useState([
    {label:'Home',    addr:'Viva Bahriya 10, The Pearl-Qatar', icon:'🏠', primary:true},
    {label:'Work',    addr:'West Bay Tower, Floor 12, Doha',    icon:'🏢', primary:false},
    {label:'Parents', addr:'Al Sadd Street, Villa 5, Doha',    icon:'🏡', primary:false},
  ])
  return (
    <Shell title="Manage Addresses" sub="Your saved delivery locations">
      <div className="bg-white rounded-2xl shadow-sm overflow-hidden divide-y divide-gray-50">
        {addrs.map((a,i)=>(
          <div key={i} className="flex items-start gap-3 p-4">
            <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center shrink-0 text-xl">{a.icon}</div>
            <div className="flex-1">
              <div className="flex items-center gap-2"><p className="text-[13px] font-bold text-gray-900">{a.label}</p>{a.primary&&<span className="text-[10px] font-bold text-brand-500 bg-blue-50 px-2 py-0.5 rounded-full">Primary</span>}</div>
              <p className="text-[11px] text-gray-500 mt-0.5">{a.addr}</p>
            </div>
            <ChevronRight size={15} className="text-gray-300 shrink-0 mt-1"/>
          </div>
        ))}
      </div>
      <button className="w-full py-4 rounded-2xl border-2 border-dashed border-brand-500 text-brand-500 text-[14px] font-bold">+ Add New Address</button>
    </Shell>
  )
}

/* ── Contact Us ── */
function ContactPage() {
  const { params } = useNav()
  const isProviderInquiry = params?.topic === 'provider'
  const [msg, setMsg] = useState(isProviderInquiry ? 'Hi Helpy, I would like to learn more about becoming a service provider.' : '')
  const [sent, setSent] = useState(false)
  return (
    <Shell title={isProviderInquiry ? 'Partner with Helpy' : 'Contact Us'} sub={isProviderInquiry ? 'Start your provider journey' : "We're here to help"}>
      {isProviderInquiry && (
        <div className="rounded-2xl border border-blue-100 bg-blue-50 p-4">
          <p className="text-[14px] font-black text-[#10152f]">Bring your services to more customers</p>
          <p className="mt-1 text-[12px] leading-5 font-semibold text-[#65708a]">Send us a message and our partnerships team will guide you through the next steps.</p>
        </div>
      )}
      <div className="grid grid-cols-2 gap-3">
        {[{icon:Phone,label:'Call Us',sub:'+974 5205 5553',color:'bg-green-50 text-green-500'},{icon:Mail,label:'Email Us',sub:'helpyapp.tech@gmail.com',color:'bg-blue-50 text-blue-500'}].map(({icon:I,label,sub,color})=>(
          <button key={label} className={`flex flex-col items-center gap-2 bg-white rounded-2xl p-4 shadow-sm`}>
            <div className={`w-10 h-10 rounded-xl ${color.split(' ')[0]} flex items-center justify-center`}><I size={18} className={color.split(' ')[1]}/></div>
            <p className="text-[13px] font-bold text-gray-900">{label}</p>
            <p className="break-all text-center text-[11px] leading-4 text-gray-500 max-[360px]:text-[10px]">{sub}</p>
          </button>
        ))}
      </div>
      {sent ? (
        <div className="bg-green-50 rounded-2xl p-6 flex flex-col items-center gap-3">
          <CheckCircle2 size={40} className="text-green-500"/><p className="text-[15px] font-bold text-green-700">Message Sent!</p>
          <p className="text-[12px] text-green-600 text-center">We'll respond within 24 hours.</p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl shadow-sm p-5 space-y-3">
          <p className="text-[14px] font-bold text-gray-800">Send a Message</p>
          <textarea value={msg} onChange={e=>setMsg(e.target.value)} rows={4} placeholder="Describe your issue or question..." className="w-full bg-gray-50 rounded-xl px-4 py-3 text-[13px] outline-none placeholder:text-gray-400 resize-none"/>
          <button onClick={()=>setSent(true)} className="w-full py-3.5 rounded-xl bg-brand-500 text-white text-[14px] font-bold flex items-center justify-center gap-2">
            <Send size={16}/> Send Message
          </button>
        </div>
      )}
      <div className="bg-blue-50 rounded-2xl p-4">
        <p className="text-[13px] font-bold text-gray-800 mb-1">📞 Support Hours</p>
        <p className="text-[12px] text-gray-600">Sunday – Thursday: 10:00 AM – 4:00 PM</p>
        <p className="text-[12px] text-gray-600">Friday &amp; Saturday: Closed</p>
      </div>
    </Shell>
  )
}

/* ── Terms ── */
function TermsPage() {
  return (
    <Shell title="Terms of Service" sub="Last updated May 2024">
      {[
        {title:'1. Acceptance of Terms',body:'By using Helpy, you agree to these Terms of Service. Please read them carefully before using our platform.'},
        {title:'2. Service Description',body:'Helpy is a marketplace connecting customers with local service providers including cleaning, maintenance, beauty, and more across Qatar.'},
        {title:'3. User Responsibilities',body:'Users must provide accurate information, treat service providers respectfully, and pay for services as agreed. Any abuse of the platform will result in account suspension.'},
        {title:'4. Payments & Refunds',body:'All payments are processed securely. Refunds are available within 24 hours of booking cancellation, subject to provider\'s cancellation policy.'},
        {title:'5. Privacy',body:'We protect your personal data as outlined in our Privacy Policy. We never sell your data to third parties.'},
        {title:'6. Liability',body:'Helpy acts as an intermediary. While we vet all service providers, we cannot be held liable for service quality issues. All disputes are resolved per our dispute resolution process.'},
      ].map(s=>(
        <div key={s.title} className="bg-white rounded-2xl shadow-sm p-4">
          <p className="text-[13px] font-bold text-gray-900 mb-1.5">{s.title}</p>
          <p className="text-[12px] text-gray-600 leading-relaxed">{s.body}</p>
        </div>
      ))}
    </Shell>
  )
}

/* ── Privacy ── */
function PrivacyPage() {
  return (
    <Shell title="Privacy Policy" sub="How we protect your data">
      {[
        {title:'Data We Collect',body:'We collect your name, email, phone number, location, and booking history to provide our services effectively.'},
        {title:'How We Use Your Data',body:'Your data is used to facilitate bookings, improve our services, send relevant notifications, and ensure platform safety.'},
        {title:'Data Sharing',body:'We share only necessary information with service providers to fulfill your bookings. We never sell your personal data to advertisers.'},
        {title:'Your Rights',body:'You have the right to access, correct, or delete your personal data at any time by contacting support@helpy.qa.'},
        {title:'Cookies',body:'We use cookies to improve your app experience and analyze usage patterns. You can manage cookie preferences in your device settings.'},
        {title:'Security',body:'We use industry-standard encryption to protect your data. All payment information is processed securely and never stored on our servers.'},
      ].map(s=>(
        <div key={s.title} className="bg-white rounded-2xl shadow-sm p-4">
          <p className="text-[13px] font-bold text-gray-900 mb-1.5">{s.title}</p>
          <p className="text-[12px] text-gray-600 leading-relaxed">{s.body}</p>
        </div>
      ))}
    </Shell>
  )
}

/* ── Router: render the right page based on screen name ── */
export default function HelperPages({ screen }: { screen: string }) {
  switch (screen) {
    case 'notifications':  return <NotificationsPage/>
    case 'order-detail':   return <OrderDetailPage/>
    case 'wallet':         return <WalletPage/>
    case 'favorites':      return <FavoritesPage/>
    case 'addresses':      return <AddressesPage/>
    case 'contact-us':     return <ContactPage/>
    case 'terms':          return <TermsPage/>
    case 'privacy':        return <PrivacyPage/>
    default:               return <NotificationsPage/>
  }
}
