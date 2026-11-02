import { ArrowLeft, Check, Mail, Phone, ShieldCheck, UserRound } from 'lucide-react'
import { useState } from 'react'
import { useNav } from '../context/NavContext'
import { StatusBar, HelpyLogo } from '../components/shared'
import { requestLoginOtp } from '../api/auth'

export default function SignUpPage() {
  const { goBack, navigate } = useNav()
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [phoneNumber, setPhoneNumber] = useState('')
  const [email, setEmail] = useState('')
  const [accepted, setAccepted] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const submit = async () => {
    const cleanFirstName = firstName.trim()
    const cleanLastName = lastName.trim()
    const cleanPhone = phoneNumber.replace(/[^\d+]/g, '')
    const cleanEmail = email.trim().toLowerCase()
    if (cleanFirstName.length < 2) { setError('Enter your first name.'); return }
    if (cleanLastName.length < 2) { setError('Enter your last name.'); return }
    if (!/^\+?\d{7,15}$/.test(cleanPhone)) { setError('Enter a valid phone number.'); return }
    if (!/^\S+@\S+\.\S+$/.test(cleanEmail)) { setError('Enter a valid email address.'); return }
    if (!accepted) { setError('Please accept the terms to continue.'); return }
    setLoading(true)
    setError('')
    try {
      await requestLoginOtp(cleanEmail)
      navigate('verify', { email: cleanEmail, firstName: cleanFirstName, lastName: cleanLastName, fullName: `${cleanFirstName} ${cleanLastName}`, phoneNumber: cleanPhone, signup: true })
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : 'Unable to send the verification code.')
    } finally {
      setLoading(false)
    }
  }

  return <div className="relative flex flex-1 flex-col overflow-hidden bg-[#edf6ff]">
    <div className="absolute -top-24 right-[-80px] h-72 w-72 rounded-full bg-[#9ed4ff]/50 blur-3xl" />
    <div className="absolute bottom-[-100px] left-[-70px] h-72 w-72 rounded-full bg-[#dce9ff] blur-3xl" />
    <div className="absolute inset-x-5 top-[112px] bottom-5 rounded-[34px] border border-white/80 bg-white/55 shadow-[0_24px_60px_rgba(35,92,166,.13)] backdrop-blur-xl" />
    <StatusBar />
    <div className="relative z-10 flex flex-1 flex-col px-6 pb-6">
      <div className="flex items-center justify-between pt-2"><button onClick={goBack} className="grid h-11 w-11 place-items-center rounded-2xl bg-white/90 text-[#173263] shadow-sm"><ArrowLeft size={21}/></button><HelpyLogo size="sm" withWord={false}/><span className="w-11" /></div>
      <div className="mt-6 px-2"><p className="text-[11px] font-black uppercase tracking-[.16em] text-[#0967ff]">Welcome to Helpy</p><h1 className="mt-2 text-[32px] font-black leading-[1.02] tracking-[-.05em] text-[#0b1637]">Create your account</h1><p className="mt-3 max-w-[310px] text-[14px] font-medium leading-6 text-[#667793]">Your account keeps your bookings, saved places and trusted providers all in one place.</p></div>
      <div className="mt-6 space-y-3 px-2">
        <div className="grid grid-cols-2 gap-3"><label className="block"><span className="mb-1.5 block text-[12px] font-black text-[#334565]">First name</span><span className="flex h-[54px] items-center gap-2 rounded-[18px] border border-[#d7e7fb] bg-white/90 px-3 shadow-sm focus-within:border-[#0967ff] focus-within:ring-4 focus-within:ring-blue-100"><UserRound size={18} className="shrink-0 text-[#7789a5]"/><input value={firstName} onChange={event => setFirstName(event.target.value)} autoComplete="given-name" placeholder="First" className="min-w-0 flex-1 bg-transparent text-[14px] font-semibold outline-none placeholder:font-medium placeholder:text-[#9aa8bc]"/></span></label><label className="block"><span className="mb-1.5 block text-[12px] font-black text-[#334565]">Last name</span><span className="flex h-[54px] items-center gap-2 rounded-[18px] border border-[#d7e7fb] bg-white/90 px-3 shadow-sm focus-within:border-[#0967ff] focus-within:ring-4 focus-within:ring-blue-100"><input value={lastName} onChange={event => setLastName(event.target.value)} autoComplete="family-name" placeholder="Last" className="min-w-0 flex-1 bg-transparent text-[14px] font-semibold outline-none placeholder:font-medium placeholder:text-[#9aa8bc]"/></span></label></div>
        <label className="block"><span className="mb-1.5 block text-[12px] font-black text-[#334565]">Phone number</span><span className="flex h-[54px] items-center gap-3 rounded-[18px] border border-[#d7e7fb] bg-white/90 px-4 shadow-sm focus-within:border-[#0967ff] focus-within:ring-4 focus-within:ring-blue-100"><Phone size={19} className="text-[#7789a5]"/><input value={phoneNumber} onChange={event => setPhoneNumber(event.target.value)} inputMode="tel" autoComplete="tel" placeholder="+974 55 000 000" className="min-w-0 flex-1 bg-transparent text-[15px] font-semibold outline-none placeholder:font-medium placeholder:text-[#9aa8bc]"/></span></label>
        <label className="block"><span className="mb-1.5 block text-[12px] font-black text-[#334565]">Email address</span><span className="flex h-[54px] items-center gap-3 rounded-[18px] border border-[#d7e7fb] bg-white/90 px-4 shadow-sm focus-within:border-[#0967ff] focus-within:ring-4 focus-within:ring-blue-100"><Mail size={19} className="text-[#7789a5]"/><input value={email} onChange={event => setEmail(event.target.value)} onKeyDown={event => event.key === 'Enter' && submit()} type="email" autoComplete="email" placeholder="you@example.com" className="min-w-0 flex-1 bg-transparent text-[15px] font-semibold outline-none placeholder:font-medium placeholder:text-[#9aa8bc]"/></span></label>
      </div>
      <div className="mx-2 mt-5 rounded-2xl border border-blue-100 bg-white/75 p-3.5"><div className="flex gap-3"><span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-blue-50 text-[#0967ff]"><ShieldCheck size={19}/></span><p className="text-[12px] font-semibold leading-5 text-[#5f7190]">We’ll send a secure 6-digit code to confirm your email. No password is required.</p></div></div>
      <label className="mx-2 mt-5 flex cursor-pointer items-start gap-3 text-[12px] font-semibold leading-5 text-[#61738f]"><button type="button" onClick={() => setAccepted(value => !value)} className={`mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-md border transition ${accepted ? 'border-[#0967ff] bg-[#0967ff] text-white' : 'border-[#bdcce0] bg-white text-transparent'}`} aria-label="Accept terms"><Check size={14} strokeWidth={3}/></button><span>I agree to Helpy’s <button type="button" onClick={() => navigate('terms')} className="font-black text-[#0967ff]">Terms</button> and <button type="button" onClick={() => navigate('privacy')} className="font-black text-[#0967ff]">Privacy Policy</button>.</span></label>
      {error && <p role="alert" className="mx-2 mt-3 text-[12px] font-bold text-red-500">{error}</p>}
      <button onClick={submit} disabled={loading} className="mx-2 mt-5 h-[54px] rounded-[18px] bg-gradient-to-r from-[#0967ff] to-[#005bdc] text-[15px] font-black text-white shadow-[0_15px_30px_rgba(9,103,255,.24)] disabled:cursor-wait disabled:opacity-70">{loading ? 'Sending code…' : 'Create account'}</button>
      <p className="mt-5 text-center text-[13px] font-semibold text-[#667793]">Already have an account? <button onClick={() => navigate('login')} className="font-black text-[#0967ff]">Sign in</button></p>
    </div>
  </div>
}
