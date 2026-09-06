import { useState } from 'react'
import { Check, CreditCard, LockKeyhole, LoaderCircle, Plus, ShieldCheck, Smartphone, X } from 'lucide-react'
import type { BookedService } from '../context/NavContext'

type PaymentMethod = 'card' | 'apple' | 'google' | 'new-card'

const METHODS: { id: PaymentMethod; label: string }[] = [
  { id: 'card', label: '•••• 4242' },
  { id: 'apple', label: 'Apple Pay' },
  { id: 'google', label: 'Google Pay' },
  { id: 'new-card', label: 'Add card' },
]

function MethodMark({ method }: { method: PaymentMethod }) {
  if (method === 'card') return <CreditCard size={18} />
  if (method === 'apple') return <Smartphone size={18} />
  if (method === 'google') return <span className="text-[17px] font-black text-[#4285f4]">G</span>
  return <Plus size={19} strokeWidth={2.5} />
}

export default function PaymentSheet({ booking, providerLabel, providerImage, serviceCount, onClose, onPaid }: {
  booking: BookedService
  providerLabel: string
  providerImage?: string
  serviceCount: number
  onClose: () => void
  onPaid: (method: string) => void
}) {
  const [method, setMethod] = useState<PaymentMethod>('card')
  const [cardNumber, setCardNumber] = useState('')
  const [expiry, setExpiry] = useState('')
  const [cvv, setCvv] = useState('')
  const [processing, setProcessing] = useState(false)

  const amount = Number(booking.price || 0)
  const newCardReady = cardNumber.replace(/\D/g, '').length >= 12 && expiry.replace(/\D/g, '').length === 4 && cvv.length >= 3
  const canPay = method !== 'new-card' || newCardReady
  const formatCard = (value: string) => value.replace(/\D/g, '').slice(0, 16).replace(/(.{4})/g, '$1 ').trim()
  const formatExpiry = (value: string) => {
    const clean = value.replace(/\D/g, '').slice(0, 4)
    return clean.length > 2 ? `${clean.slice(0, 2)}/${clean.slice(2)}` : clean
  }

  const pay = () => {
    if (!canPay || processing) return
    setProcessing(true)
    window.setTimeout(() => onPaid(METHODS.find(item => item.id === method)?.label || 'Card'), 900)
  }

  return (
    <div className="absolute inset-0 z-[80] flex items-end bg-[#0b1830]/55 backdrop-blur-[2px]" role="dialog" aria-modal="true" aria-label="Payment">
      <button className="absolute inset-0" onClick={onClose} aria-label="Close payment" />
      <section className="relative z-10 flex max-h-[88%] w-full flex-col overflow-hidden rounded-t-[28px] bg-[#f7faff] shadow-[0_-18px_50px_rgba(10,26,54,0.22)]">
        <div className="shrink-0 bg-white px-4 pb-3 pt-2">
          <div className="mx-auto mb-3 h-1 w-10 rounded-full bg-[#d3dbe6]" />
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-[12px] border border-[#e1e9f3] bg-[#f4f8fd] text-[10px] font-black text-[#0967ff]">{providerImage ? <img src={providerImage} alt="" className="h-full w-full object-cover" /> : providerLabel.slice(0, 2).toUpperCase()}</div>
            <div className="min-w-0 flex-1"><p className="text-[8px] font-black uppercase tracking-[0.12em] text-[#8a96a8]">Payment for</p><p className="mt-0.5 truncate text-[13px] font-black text-[#182238]">{providerLabel}</p><p className="mt-0.5 text-[9px] font-semibold text-[#7d899d]">{serviceCount} {serviceCount === 1 ? 'service' : 'services'} · {booking.date}</p></div>
            <button onClick={onClose} className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#f1f5fa] text-[#59667a] active:bg-[#e7edf5]" aria-label="Close payment"><X size={18} /></button>
          </div>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto px-4 pb-4 pt-3">
          <div className="flex items-end justify-between rounded-[18px] border border-[#dce8f6] bg-[#edf5ff] px-4 py-3">
            <div><p className="text-[9px] font-bold text-[#70809a]">Total to pay</p><p className="mt-0.5 text-[24px] font-black tracking-[-0.5px] text-[#0967ff]">{amount.toFixed(2)} <span className="text-[11px] tracking-normal">QAR</span></p></div>
            <div className="flex items-center gap-1.5 rounded-full bg-white px-2.5 py-1.5 text-[#087a54] shadow-sm"><ShieldCheck size={12} /><span className="text-[8px] font-black">Protected</span></div>
          </div>

          <div className="mt-4 flex items-center justify-between"><div><p className="text-[13px] font-black text-[#182238]">Payment method</p><p className="mt-0.5 text-[9px] font-semibold text-[#8a96a8]">Choose one option</p></div><LockKeyhole size={14} className="text-[#8a96a8]" /></div>
          <div className="mt-2.5 grid grid-cols-4 gap-2">
            {METHODS.map(item => {
              const active = item.id === method
              return <button key={item.id} onClick={() => setMethod(item.id)} className={`relative flex min-h-[64px] min-w-0 flex-col items-center justify-center gap-1.5 rounded-[14px] border px-1 transition ${active ? 'border-[#0967ff] bg-[#edf5ff] text-[#0967ff] shadow-[0_5px_15px_rgba(9,103,255,0.10)]' : 'border-[#e0e7f0] bg-white text-[#647188]'}`}><MethodMark method={item.id} /><span className="truncate text-[8px] font-black">{item.label}</span>{active && <span className="absolute right-1.5 top-1.5 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-[#0967ff] text-white"><Check size={8} strokeWidth={3} /></span>}</button>
            })}
          </div>

          {method === 'new-card' ? (
            <div className="mt-4 rounded-[18px] border border-[#e0e8f2] bg-white p-3.5 shadow-[0_6px_18px_rgba(35,71,113,0.04)]">
              <p className="text-[11px] font-black text-[#243047]">Enter card details</p>
              <div className="mt-2.5 flex items-center gap-2 rounded-[13px] border border-[#dfe7f0] bg-[#f8fbff] px-3 py-3 focus-within:border-[#8fbaff] focus-within:ring-2 focus-within:ring-[#dcecff]"><CreditCard size={16} className="shrink-0 text-[#7d899c]" /><input value={cardNumber} onChange={event => setCardNumber(formatCard(event.target.value))} inputMode="numeric" autoComplete="cc-number" placeholder="Card number" className="min-w-0 flex-1 bg-transparent text-[12px] font-bold tracking-[0.06em] text-[#182238] outline-none placeholder:tracking-normal placeholder:text-[#a4afbe]" /></div>
              <div className="mt-2 grid grid-cols-2 gap-2">
                <input value={expiry} onChange={event => setExpiry(formatExpiry(event.target.value))} inputMode="numeric" autoComplete="cc-exp" placeholder="MM/YY" className="rounded-[13px] border border-[#dfe7f0] bg-[#f8fbff] px-3 py-3 text-[12px] font-bold text-[#182238] outline-none focus:border-[#8fbaff] focus:ring-2 focus:ring-[#dcecff] placeholder:text-[#a4afbe]" />
                <input value={cvv} onChange={event => setCvv(event.target.value.replace(/\D/g, '').slice(0, 4))} inputMode="numeric" autoComplete="cc-csc" placeholder="CVV" type="password" className="rounded-[13px] border border-[#dfe7f0] bg-[#f8fbff] px-3 py-3 text-[12px] font-bold text-[#182238] outline-none focus:border-[#8fbaff] focus:ring-2 focus:ring-[#dcecff] placeholder:text-[#a4afbe]" />
              </div>
              <div className="mt-3 flex items-center gap-2 border-t border-[#edf1f6] pt-3"><span className="text-[8px] font-black uppercase tracking-wide text-[#96a1b1]">We accept</span><span className="rounded bg-[#1434cb] px-2 py-1 text-[8px] font-black italic text-white">VISA</span><span className="flex items-center"><i className="h-4 w-4 rounded-full bg-[#eb001b]"/><i className="-ml-1.5 h-4 w-4 rounded-full bg-[#f79e1b] opacity-90"/></span><span className="rounded bg-[#1677b8] px-1.5 py-1 text-[7px] font-black text-white">AMEX</span></div>
            </div>
          ) : (
            <div className="mt-4 flex items-center gap-3 rounded-[18px] border border-[#dfe8f2] bg-white p-3.5"><div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[12px] bg-[#edf5ff] text-[#0967ff]"><ShieldCheck size={18} /></div><div><p className="text-[11px] font-black text-[#243047]">Pay with {METHODS.find(item => item.id === method)?.label}</p><p className="mt-0.5 text-[9px] font-semibold text-[#8793a5]">Your payment will be authorized securely.</p></div></div>
          )}
        </div>

        <footer className="shrink-0 border-t border-[#e0e8f2] bg-white px-4 pb-[max(14px,env(safe-area-inset-bottom))] pt-3">
          <button onClick={pay} disabled={!canPay || processing} className="flex h-[52px] w-full items-center justify-center gap-2 rounded-[16px] bg-[#0967ff] text-[13px] font-black text-white shadow-[0_9px_22px_rgba(9,103,255,0.22)] active:scale-[0.99] disabled:bg-[#aecbf2] disabled:shadow-none">{processing ? <><LoaderCircle size={17} className="animate-spin" /> Processing</> : <>Pay {amount.toFixed(2)} QAR <LockKeyhole size={14} /></>}</button>
          <p className="mt-2 text-center text-[8px] font-semibold text-[#909bad]">Your full card number is never stored by Helpy</p>
        </footer>
      </section>
    </div>
  )
}
