import { useEffect, useState } from 'react'
import { ArrowLeft, Check, Clock } from 'lucide-react'
import { StatusBar } from '../components/shared'
import { useNav } from '../context/NavContext'
import { DATES, PROVIDERS } from '../pages/ServiceDetailPage'

export default function BookingCheckoutPage() {
  const { goBack, navigate, params, addBooking } = useNav()
  const provider = params?.provider || 'Glow Salon & Spa'
  const cfg = PROVIDERS[provider] || PROVIDERS['Glow Salon & Spa']
  const selectedServices: string[] = params?.selectedServices?.length ? params.selectedServices : [cfg.services[0].label]
  const selectedOptions = cfg.services.filter(s => selectedServices.includes(s.label))
  const [extras, setExtras] = useState<string[]>([])
  const [pendingConfirm, setPendingConfirm] = useState(false)
  const [countdown, setCountdown] = useState(15)
  const selDate = typeof params?.selDate === 'number' ? params.selDate : 1
  const selTime = params?.selTime || '12:00 PM'
  const providerImage = params?.providerImage || cfg.logoImg || cfg.providerImage
  const equipmentLabel = params?.equipmentLabel || ''
  const equipmentAdjustment = Number(params?.equipmentAdjustment || 0)

  const servicesTotal = selectedOptions.reduce((sum, s) => sum + s.price, 0)
  const selectedExtraOptions = cfg.extras.filter(x => extras.includes(x.label))
  const extrasTotal = extras.reduce((sum, e) => sum + (cfg.extras.find(x => x.label === e)?.price || 0), 0)
  const total = Math.max(0, servicesTotal + equipmentAdjustment + extrasTotal)

  useEffect(() => {
    if (!pendingConfirm) return
    if (countdown <= 0) {
      finalizeBooking()
      return
    }
    const timer = window.setTimeout(() => setCountdown(value => value - 1), 1000)
    return () => window.clearTimeout(timer)
  }, [pendingConfirm, countdown])

  const toggleExtra = (label: string) => {
    setExtras(prev => prev.includes(label) ? prev.filter(x => x !== label) : [...prev, label])
  }

  const finalizeBooking = () => {
    const booking = {
      id: Date.now().toString(),
      provider,
      service: equipmentLabel ? `${selectedServices.join(', ')} - ${equipmentLabel}` : selectedServices.join(', '),
      date: DATES[selDate].day + ', 2026',
      time: selTime,
      price: total.toFixed(2),
      status: 'Confirmed' as const,
      providerBg: params?.providerBg || 'bg-blue-500',
      providerEmoji: params?.providerEmoji || cfg.label.slice(0, 2).toUpperCase(),
      providerImage,
    }
    addBooking(booking)
    navigate('booking-success', booking)
  }

  const confirmBooking = () => {
    if (pendingConfirm) return
    setCountdown(15)
    setPendingConfirm(true)
  }

  const cancelPendingBooking = () => {
    setPendingConfirm(false)
    setCountdown(15)
  }

  return (
    <div className="relative flex flex-col flex-1 bg-[#eef7ff] overflow-hidden">
      <img src="/assets/home-wave-background-extra-light-preview.png" alt="" className="absolute inset-0 h-full w-full object-cover object-top" aria-hidden="true" />
      <div className="absolute inset-0 bg-white/30" aria-hidden="true" />
      <StatusBar />

      <div className="relative z-10 flex items-center gap-3 px-4 pt-2 pb-3">
        <button onClick={goBack} className="w-11 h-11 rounded-full bg-white shadow-sm flex items-center justify-center text-brand-500">
          <ArrowLeft size={22}/>
        </button>
        <div className="min-w-0">
          <h1 className="text-[25px] leading-7 font-black text-gray-950">Checkout</h1>
          <p className="text-[12px] font-semibold text-[#65708a]">Review your booking before confirming.</p>
        </div>
      </div>

      <div className="relative z-10 flex-1 overflow-y-auto px-4 pb-7">
        <div className="rounded-[24px] bg-white border border-gray-100 shadow-sm p-4">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-[18px] font-black text-gray-950">{cfg.label}</p>
              <p className="text-[12px] text-gray-500 mt-1">Confirm the details and add anything extra.</p>
            </div>
            <button onClick={goBack} className="rounded-full bg-blue-50 px-4 py-2.5 text-[12px] font-black text-brand-500">
              Edit time
            </button>
          </div>

          <div className="mt-4 rounded-[18px] bg-gray-50 p-4 space-y-2">
            <p className="text-[14px] font-black text-gray-950">Overview</p>
            {selectedOptions.map(s => (
              <div key={s.label} className="flex justify-between gap-3 text-[13px]">
                <span className="text-gray-600">{s.label}</span>
                <span className="font-black text-gray-950">{s.price.toFixed(2)} QR</span>
              </div>
            ))}
            {equipmentLabel && (
              <div className="flex justify-between gap-3 text-[13px]">
                <span className="text-gray-600">{equipmentLabel}</span>
                <span className={`font-black ${equipmentAdjustment < 0 ? 'text-green-600' : 'text-gray-950'}`}>{equipmentAdjustment ? `${equipmentAdjustment.toFixed(2)} QR` : 'Included'}</span>
              </div>
            )}
            {selectedExtraOptions.map(extra => (
              <div key={extra.label} className="flex justify-between gap-3 text-[13px]">
                <span className="text-gray-600">{extra.label}</span>
                <span className="font-black text-brand-500">+ {extra.price.toFixed(2)} QR</span>
              </div>
            ))}
            <div className="border-t border-gray-200 pt-3 mt-3 flex items-center justify-between gap-3">
              <span className="text-[13px] text-gray-600">{DATES[selDate].day}, 2026 at {selTime}</span>
              <span className="flex items-center gap-1 text-[13px] font-black text-brand-500"><Clock size={14}/>{cfg.duration}</span>
            </div>
          </div>

          {cfg.extras.length > 0 && (
            <div className="mt-6">
              <p className="text-[18px] font-black text-gray-950 mb-3">Add Extras (Optional)</p>
              <div className="grid grid-cols-3 max-[360px]:grid-cols-2 gap-3">
                {cfg.extras.map(({label, price, icon: Icon}) => {
                  const selected = extras.includes(label)
                  return (
                    <button key={label} onClick={()=>!pendingConfirm && toggleExtra(label)}
                      disabled={pendingConfirm}
                      className={`relative min-h-[132px] rounded-[18px] p-3 text-left border shadow-sm transition ${selected?'border-brand-500 bg-blue-50':'border-gray-100 bg-white'}`}>
                      <span className={`absolute top-3 right-3 w-6 h-6 rounded-md border-2 flex items-center justify-center ${selected?'border-brand-500 bg-brand-500':'border-gray-300 bg-white'}`}>
                        {selected&&<Check size={13} className="text-white"/>}
                      </span>
                      <div className="w-11 h-11 rounded-2xl bg-blue-50 flex items-center justify-center"><Icon size={22} className="text-brand-500"/></div>
                      <p className="mt-4 pr-3 text-[13px] leading-4 font-black text-gray-950">{label}</p>
                      <p className="mt-3 text-[13px] font-black text-brand-500">+ {price.toFixed(2)} QR</p>
                    </button>
                  )
                })}
              </div>
            </div>
          )}

          <div className="mt-6 flex items-center gap-4 rounded-[20px] bg-blue-50 px-4 py-4">
            <div className="flex-1">
              <p className="text-[12px] text-gray-500">Total Price</p>
              <p className="text-[28px] font-black text-brand-500">{total.toFixed(2)} QR</p>
            </div>
            <button onClick={confirmBooking} disabled={pendingConfirm} className={`h-[58px] rounded-[18px] px-6 text-[15px] font-black text-white shadow-lg shadow-blue-200 ${pendingConfirm ? 'bg-brand-500/60' : 'bg-brand-500'}`}>
              {pendingConfirm ? `Sending in ${countdown}s` : 'Confirm Booking'}
            </button>
          </div>

          {pendingConfirm && (
            <div className="mt-3 rounded-[18px] border border-blue-100 bg-white px-4 py-3 shadow-sm">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-[13px] font-black text-gray-950">Booking will be sent in {countdown} seconds</p>
                  <p className="mt-0.5 text-[11px] text-gray-500">You can cancel before it is confirmed.</p>
                </div>
                <button onClick={cancelPendingBooking} className="shrink-0 rounded-full bg-red-50 px-4 py-2 text-[12px] font-black text-red-500">
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
