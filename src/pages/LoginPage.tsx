import { Mail, Lock, Eye } from 'lucide-react'
import { useNav } from '../context/NavContext'
import { StatusBar, HelpyLogo } from '../components/shared'

export default function LoginPage() {
  const { navigate } = useNav()
  return (
    <div className="relative flex flex-col flex-1 overflow-hidden bg-[#d8edff]">
      <img src="/assets/home-wave-background.png" alt="" aria-hidden="true" className="absolute inset-0 h-full w-full object-cover object-top opacity-65" />
      <div className="absolute inset-0 bg-white/35 backdrop-blur-[1px]" />
      <div className="absolute left-1/2 top-[62px] h-[110px] w-[110px] -translate-x-1/2 rounded-full bg-white/85 blur-2xl" />
      <StatusBar />
      <div className="relative z-10 flex-1 overflow-y-auto px-7 pb-6">
        <div className="pt-14 flex justify-center"><HelpyLogo size="lg" /></div>
        <div className="text-center mt-5 mb-7">
          <h1 className="text-[27px] font-black tracking-tight text-[#10112f]">Welcome back</h1>
          <p className="mt-2 text-[14px] leading-5 text-[#7a8394] font-medium">Sign in to continue and explore services near you.</p>
        </div>

        <div className="space-y-2.5">
          <div className="h-[50px] rounded-[17px] border border-[#d7e7ff] bg-white/90 flex items-center px-4 gap-3 shadow-sm">
            <Mail size={20} className="text-[#7b8396]" />
            <input className="flex-1 min-w-0 bg-transparent outline-none text-[15px] placeholder:text-[#8b93a6]" placeholder="Email or phone number" />
          </div>
          <div className="h-[50px] rounded-[17px] border border-[#d7e7ff] bg-white/90 flex items-center px-4 gap-3 shadow-sm">
            <Lock size={20} className="text-[#7b8396]" />
            <input className="flex-1 min-w-0 bg-transparent outline-none text-[15px] placeholder:text-[#8b93a6]" placeholder="Password" type="password" />
            <Eye size={20} className="text-[#7b8396] shrink-0" />
          </div>
        </div>
        <div className="text-right mt-2.5 mb-4"><button className="text-[#0067e8] text-[13px] font-bold">Forgot password?</button></div>
        <button onClick={()=>navigate('verify')} className="w-full h-[52px] rounded-[17px] bg-gradient-to-r from-[#0679ff] to-[#0059d9] text-white text-[16px] font-black shadow-[0_14px_28px_rgba(0,96,222,0.22)]">Sign In</button>

        <div className="flex items-center gap-5 my-4"><div className="h-px bg-[#dbe2ee] flex-1"/><span className="text-[#7b8396] text-[14px] font-medium">or</span><div className="h-px bg-[#dbe2ee] flex-1"/></div>
        <div className="space-y-3">
          <button onClick={()=>navigate('verify')} className="w-full h-[50px] rounded-[17px] bg-white border border-[#e1e8f3] shadow-sm flex items-center justify-center gap-3 text-[15px] font-black text-[#121630] active:scale-[0.99] transition">
            <GoogleIcon />
            Continue with Google
          </button>
        </div>
        <button onClick={()=>navigate('verify')} className="mt-5 w-full h-[52px] rounded-[18px] bg-[#f3f8ff] text-[15px] font-bold text-[#11152d]">Don't have an account? <span className="text-[#0067e8]">Sign Up</span></button>
      </div>
    </div>
  )
}

function GoogleIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 48 48" aria-hidden="true" className="shrink-0">
      <path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3C33.7 32.7 29.3 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.9 1.2 8 3.1l5.7-5.7C34.1 6.1 29.3 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.4-.4-3.5z"/>
      <path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.7 15.1 19 12 24 12c3.1 0 5.9 1.2 8 3.1l5.7-5.7C34.1 6.1 29.3 4 24 4 16.2 4 9.5 8.5 6.3 14.7z"/>
      <path fill="#4CAF50" d="M24 44c5.2 0 9.9-2 13.4-5.2l-6.2-5.2C29.2 35.1 26.7 36 24 36c-5.2 0-9.6-3.3-11.3-7.8L6.1 33.3C9.3 39.6 16.1 44 24 44z"/>
      <path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3c-.8 2.2-2.2 4.1-4.1 5.6l6.2 5.2C36.9 39.2 44 34 44 24c0-1.3-.1-2.4-.4-3.5z"/>
    </svg>
  )
}
