import { useState } from 'react'
import { ArrowLeft } from 'lucide-react'
import { useNav } from '../context/NavContext'
import { StatusBar, HelpyLogo } from '../components/shared'

const CODE = '123456'

export default function VerifyPage() {
  const { goBack, login } = useNav()
  const [digits, setDigits] = useState(CODE.split(''))
  const [error, setError] = useState(false)
  const verify = () => digits.join('') === CODE ? login() : setError(true)

  return (
    <div className="relative flex flex-col flex-1 overflow-hidden bg-[#d8edff]">
      <img src="/assets/home-wave-background.png" alt="" aria-hidden="true" className="absolute inset-0 h-full w-full object-cover object-center opacity-80" />
      <div className="absolute inset-0 bg-white/30 backdrop-blur-[1px]" />
      <div className="absolute -top-24 left-1/2 h-[230px] w-[300px] -translate-x-1/2 rounded-full bg-white/70 blur-3xl" />
      <div className="absolute inset-x-0 bottom-0 h-[260px] bg-gradient-to-t from-[#d8edff]/70 via-white/18 to-transparent" />
      <StatusBar />
      <div className="relative z-10 flex-1 px-7 pt-7">
        <div className="flex items-start justify-between">
          <button onClick={goBack} className="w-11 h-11 rounded-full bg-white/90 shadow flex items-center justify-center"><ArrowLeft size={23}/></button>
          <div className="-mt-2"><HelpyLogo size="sm" /></div>
        </div>
        <div className="mt-10 rounded-[28px] bg-white/58 px-4 py-6 shadow-[0_18px_46px_rgba(15,23,42,0.12)] backdrop-blur-md">
          <h1 className="text-[36px] leading-none font-black tracking-tight text-[#0c1230]">Verify Code</h1>
          <p className="mt-4 text-[16px] leading-6 text-[#10152f] font-semibold">We've sent a verification code to<br/><span className="text-[#0059b8] font-black">user@helpy.app</span>.</p>
        </div>
        <div className="mt-8 flex justify-between gap-2">
          {digits.map((d,i)=>(
            <input key={i} value={d} maxLength={1} inputMode="numeric" onChange={(e)=>{ const arr=[...digits]; arr[i]=e.target.value.replace(/\D/g,'').slice(-1); setDigits(arr); setError(false)}}
              className={`w-[46px] h-[56px] bg-white rounded-xl text-center text-[28px] font-black text-[#0059a9] outline-none shadow-[0_10px_20px_rgba(15,23,42,0.10)] ${error?'ring-2 ring-red-400':''}`}/>
          ))}
        </div>
        <button onClick={verify} className="mt-8 w-full h-[56px] rounded-xl bg-[#0057ac] text-white text-[20px] font-black shadow-lg">Continue</button>
        {error && <p className="mt-3 text-center text-red-500 font-bold">Enter verification code 123456</p>}
        <div className="mt-7 mx-auto max-w-[260px] rounded-2xl bg-white/88 px-5 py-3 text-center text-[16px] text-[#10152f] shadow-[0_12px_30px_rgba(15,23,42,0.14)] backdrop-blur">
          <p className="font-semibold">Didn't get a code?</p>
          <p className="mt-1"><button onClick={()=>setDigits(CODE.split(''))} className="text-[#0059a9] font-black">Resend OTP</button> <span className="text-[#4b5563] font-bold">00:20</span></p>
        </div>
      </div>
    </div>
  )
}
