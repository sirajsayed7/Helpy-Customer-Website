import { useState } from 'react'
import { ArrowLeft, Check, CheckCircle2, Clock, ExternalLink, LoaderCircle, MapPin, ShieldCheck, Sparkles, X } from 'lucide-react'
import { StatusBar } from '../components/shared'
import { useNav } from '../context/NavContext'
import { DATES, PROVIDERS } from '../pages/ServiceDetailPage'
import { useHelpyData, type LiveService } from '../context/HelpyDataContext'
import { hasHelpyUserSession, helpyApi } from '../api/helpy'

export default function BookingCheckoutPage() {
  const { goBack, navigate, params } = useNav()
  const data = useHelpyData()
  const provider = params?.provider || 'Service provider'
  const cfg = PROVIDERS[provider] || {
    label: provider,
    duration: params?.liveService?.duration || 'Duration confirmed by provider',
    providerImage: params?.providerImage || params?.liveService?.image || '',
    logoImg: '',
    services: [{ label: params?.name || params?.liveService?.name || 'Service', desc: params?.liveService?.description || 'Service details will be confirmed before booking.', price: Number(params?.price || params?.liveService?.price || 0), icon: Sparkles }],
    extras: [],
  }
  const serviceAddresses = data.addresses.map(address => ({ label: address.title, address: address.address, details: '' }))
  const fallbackAddress = { label: 'Service location', address: 'Choose a saved location', details: '' }
  const selectedServices: string[] = params?.selectedServices?.length ? params.selectedServices : [cfg.services[0].label]
  const selectedOptions = cfg.services.filter(s => selectedServices.includes(s.label))
  const [extras, setExtras] = useState<string[]>([])
  const [selectedAddressIndex, setSelectedAddressIndex] = useState(0)
  const selectedAddress = serviceAddresses[selectedAddressIndex] || fallbackAddress
  const [addressPickerOpen, setAddressPickerOpen] = useState(false)
  const [notes, setNotes] = useState('')
  const [processing, setProcessing] = useState(false)
  const [error, setError] = useState('')
  const [bookingId, setBookingId] = useState<string | number | null>(null)
  const [paymentUrl, setPaymentUrl] = useState('')
  const liveService = params?.liveService as LiveService | undefined
  const selDate = typeof params?.selDate === 'number' ? params.selDate : 1
  const selTime = params?.selTime || '12:00 PM'
  const providerImage = params?.providerImage || cfg.logoImg || cfg.providerImage
  const equipmentLabel = params?.equipmentLabel || ''
  const equipmentAdjustment = Number(params?.equipmentAdjustment || 0)

  const servicesTotal = selectedOptions.reduce((sum, s) => sum + s.price, 0)
  const selectedExtraOptions = cfg.extras.filter(x => extras.includes(x.label))
  const extrasTotal = extras.reduce((sum, e) => sum + (cfg.extras.find(x => x.label === e)?.price || 0), 0)
  const total = Math.max(0, servicesTotal + equipmentAdjustment + extrasTotal)

  const toggleExtra = (label: string) => {
    setExtras(prev => prev.includes(label) ? prev.filter(x => x !== label) : [...prev, label])
  }

  const localDateTime = (date: string, time: string) => {
    const match = time.match(/^(\d{1,2}):(\d{2})\s*(AM|PM)$/i)
    if (!match) return ''
    let hours = Number(match[1]) % 12
    if (match[3].toUpperCase() === 'PM') hours += 12
    return `${date} ${String(hours).padStart(2, '0')}:${match[2]}:00`
  }

  const startSecureCheckout = async () => {
    if (processing) return
    if (!hasHelpyUserSession()) { navigate('login'); return }
    if (!liveService?.serviceVendorMapId || !liveService.vendorId || !data.profile) {
      setError('This service is missing the backend booking details required to continue.')
      return
    }
    if (!data.addresses.length) {
      setError('Add a saved service address before continuing.')
      return
    }
    const selectedDate = params?.selectedDate || DATES[selDate]?.iso
    const start = localDateTime(selectedDate, selTime)
    if (!start) { setError('Choose a valid service time before continuing.'); return }
    const endDate = new Date(start.replace(' ', 'T'))
    endDate.setHours(endDate.getHours() + 1)
    const end = `${endDate.getFullYear()}-${String(endDate.getMonth() + 1).padStart(2, '0')}-${String(endDate.getDate()).padStart(2, '0')} ${String(endDate.getHours()).padStart(2, '0')}:${String(endDate.getMinutes()).padStart(2, '0')}:00`
    const raw = liveService.raw || {}
    const nested = (value: unknown) => value && typeof value === 'object' ? value as Record<string, unknown> : {}
    const serviceRecord = nested(raw.service)
    const bookingTypeRecord = nested(raw.booking_type)
    const bookingType = Number(raw.booking_type_id || bookingTypeRecord.booking_type_id) || 1
    const userId = Number(data.profile.raw.id || data.profile.raw.user_id)
    if (!userId) { setError('Your account is missing its backend user ID. Please sign in again.'); return }

    setProcessing(true); setError('')
    try {
      const quote = await helpyApi.bookingPreflight(liveService.serviceVendorMapId, 'online')
      const price = Number(quote.final_price || total).toFixed(2)
      const created = await helpyApi.createBooking({
        service_vendor_mapp_id: liveService.serviceVendorMapId,
        user_id: userId,
        provider_id: liveService.vendorId,
        booking_type: bookingType,
        booking_date_time: start,
        booking_end_datetime: end,
        total_price: price,
        payment_type: 'online',
        discount_amount: '0.00',
        wallet_balance: Number(data.profile.wallet || 0).toFixed(2),
        wallet_amount: '0.00',
        payment_gateway_amount: price,
        final_price: price,
        location: selectedAddress.address,
        requirements: notes.trim(),
        booking_address: selectedAddress.address,
        booking_address_id: data.addresses[selectedAddressIndex]?.id || '0',
        payment_status: '1',
        services: [{
          user_id: userId, service_id: liveService.serviceId, provider_id: liveService.vendorId,
          service_type_id: bookingType, category_id: liveService.categoryId,
          service_vendor_mapp_id: liveService.serviceVendorMapId, category_name: liveService.category,
          name: String(serviceRecord.name_english || serviceRecord.name || liveService.name),
          user_name: data.profile.name, service_name: liveService.name,
          service_type_name: String(bookingTypeRecord.name_english || bookingTypeRecord.name || 'On-Premise'),
          provider_name: liveService.provider, total_price: price, discount_price: '0.00', final_price: price,
        }],
      })
      const createdId = String(created.booking_id || created.id || '')
      if (!createdId) throw new Error('The booking was created without a booking reference.')
      setBookingId(createdId)
      const name = data.profile.name.trim().split(/\s+/)
      const tap = await helpyApi.createTapPayment({ bookingId: createdId, firstName: name[0] || 'Helpy', lastName: name.slice(1).join(' ') || 'User', email: data.profile.email, phone: data.profile.phone })
      const url = tap.resultObj?.payUrl?.trim()
      if (tap.returnCode !== '200' || tap.gateway.toLowerCase() !== 'tap' || !url || !url.startsWith('https://')) throw new Error('Tap did not return a secure payment link.')
      setPaymentUrl(url)
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'Unable to start secure checkout. Please try again.')
    } finally { setProcessing(false) }
  }

  const verifyPayment = async () => {
    if (!bookingId) return
    setProcessing(true); setError('')
    try {
      const rows = await helpyApi.getBookingDetails(bookingId)
      const row = rows[0] || {}
      const payment = row.payment && typeof row.payment === 'object' ? row.payment as Record<string, unknown> : {}
      const paymentStatus = String(row.payment_status || payment.payment_status || '').toLowerCase()
      const bookingStatus = Number(row.booking_status)
      if (![0, 1, 2].includes(bookingStatus) && !['success', 'paid', 'captured'].includes(paymentStatus)) throw new Error('Payment is still being confirmed. Please check My bookings in a moment.')
      await data.refreshAccount()
      navigate('booking-success', { bookingId, provider, service: liveService?.name || selectedServices.join(', '), amount: total, paymentMethod: 'Tap' })
    } catch (cause) { setError(cause instanceof Error ? cause.message : 'We could not verify that payment yet.') }
    finally { setProcessing(false) }
  }

  const confirmBooking = () => {
    void startSecureCheckout()
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

          <div className="mt-4">
            <div className="mb-2 flex items-center justify-between"><p className="text-[13px] font-black text-gray-950">Service address</p><button onClick={() => setAddressPickerOpen(true)} className="text-[10px] font-black text-brand-500">Change</button></div>
            <button onClick={() => setAddressPickerOpen(true)} className="flex w-full items-center gap-3 rounded-[18px] border border-[#dce8f6] bg-[#f5f9ff] p-3 text-left transition active:bg-[#edf5ff]">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[13px] bg-[#0967ff] text-white"><MapPin size={18} fill="white" /></span>
              <span className="min-w-0 flex-1"><span className="block text-[12px] font-black text-[#182238]">{selectedAddress.label}</span><span className="mt-0.5 block truncate text-[11px] font-semibold text-[#59677e]">{selectedAddress.address}</span><span className="mt-0.5 block truncate text-[9px] font-medium text-[#909bad]">{selectedAddress.details}</span></span>
              <CheckCircle2 size={18} className="shrink-0 text-[#0967ff]" />
            </button>
            <label className="mt-4 block text-[13px] font-black text-gray-950">Notes for the provider
              <textarea value={notes} onChange={event => setNotes(event.target.value)} placeholder="Optional arrival or access instructions" className="mt-2 h-20 w-full resize-none rounded-[14px] border border-[#dce8f6] bg-[#f8fbff] p-3 text-[12px] font-medium text-[#1d293d] outline-none focus:border-[#8eb7ff]" />
            </label>
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
                    <button key={label} onClick={()=>toggleExtra(label)}
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
            <button onClick={confirmBooking} disabled={processing} className="flex h-[58px] items-center justify-center gap-2 rounded-[18px] bg-brand-500 px-6 text-[15px] font-black text-white shadow-lg shadow-blue-200 disabled:opacity-60">
              {processing ? <><LoaderCircle size={17} className="animate-spin" />Preparing secure checkout</> : 'Continue to secure payment'}
            </button>
          </div>
          {error && <p role="alert" className="mt-4 rounded-[14px] bg-red-50 px-3 py-2.5 text-[12px] font-bold leading-5 text-red-600">{error}</p>}
        </div>
      </div>

      {addressPickerOpen && (
        <div className="absolute inset-0 z-[70] flex items-end bg-[#0b1830]/45 backdrop-blur-[2px]" role="dialog" aria-modal="true" aria-label="Choose service address">
          <button className="absolute inset-0" onClick={() => setAddressPickerOpen(false)} aria-label="Close address picker" />
          <section className="relative z-10 w-full rounded-t-[28px] bg-[#f7faff] px-4 pb-[max(16px,env(safe-area-inset-bottom))] pt-2 shadow-[0_-18px_50px_rgba(10,26,54,0.20)]">
            <div className="mx-auto h-1 w-10 rounded-full bg-[#d2dbe7]" />
            <div className="mt-3 flex items-center justify-between"><div><p className="text-[17px] font-black text-[#11182d]">Choose service address</p><p className="mt-0.5 text-[10px] font-semibold text-[#7d899d]">Where should the provider arrive?</p></div><button onClick={() => setAddressPickerOpen(false)} className="flex h-9 w-9 items-center justify-center rounded-full bg-white text-[#59667a] shadow-sm" aria-label="Close"><X size={17} /></button></div>
            <div className="mt-4 overflow-hidden rounded-[20px] border border-[#e0e8f2] bg-white">
              {(serviceAddresses.length ? serviceAddresses : [fallbackAddress]).map((item, index) => {
                const active = item.address === selectedAddress.address
                return <button key={`${item.address}-${index}`} onClick={() => { setSelectedAddressIndex(index); setAddressPickerOpen(false) }} className={`flex w-full items-center gap-3 px-3 py-3 text-left ${index ? 'border-t border-[#edf2f7]' : ''} ${active ? 'bg-[#f2f7ff]' : 'bg-white'}`}><span className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-[12px] ${active ? 'bg-[#0967ff] text-white' : 'bg-[#edf4fc] text-[#0967ff]'}`}><MapPin size={16} fill={active ? 'white' : '#0967ff'} /></span><span className="min-w-0 flex-1"><span className="block text-[12px] font-black text-[#1d293d]">{item.label}</span><span className="mt-0.5 block truncate text-[10px] font-semibold text-[#68758a]">{item.address}</span><span className="mt-0.5 block truncate text-[9px] text-[#98a2b1]">{item.details}</span></span>{active && <CheckCircle2 size={18} className="shrink-0 text-[#0967ff]" />}</button>
              })}
            </div>
          </section>
        </div>
      )}

      {paymentUrl && (
        <div className="absolute inset-0 z-[80] flex flex-col bg-[#f7faff]" role="dialog" aria-modal="true" aria-label="Secure Tap payment">
          <div className="flex items-center justify-between border-b border-[#e0e8f2] bg-white px-4 py-3"><div className="flex items-center gap-2"><span className="grid h-9 w-9 place-items-center rounded-[12px] bg-blue-50 text-[#0967ff]"><ShieldCheck size={18}/></span><div><p className="text-[13px] font-black text-[#182238]">Secure payment by Tap</p><p className="text-[9px] font-semibold text-[#748198]">Your card details stay with Tap.</p></div></div><a href={paymentUrl} target="_blank" rel="noreferrer" className="grid h-9 w-9 place-items-center rounded-full bg-[#edf5ff] text-[#0967ff]" aria-label="Open payment securely"><ExternalLink size={17}/></a></div>
          <iframe src={paymentUrl} title="Tap secure checkout" className="min-h-0 flex-1 border-0 bg-white" />
          <div className="border-t border-[#e0e8f2] bg-white px-4 pb-[max(14px,env(safe-area-inset-bottom))] pt-3"><button onClick={() => void verifyPayment()} disabled={processing} className="flex h-[52px] w-full items-center justify-center gap-2 rounded-[16px] bg-[#0967ff] text-[13px] font-black text-white disabled:opacity-60">{processing ? <LoaderCircle size={17} className="animate-spin"/> : <CheckCircle2 size={17}/>}I’ve completed payment</button><p className="mt-2 text-center text-[9px] font-semibold text-[#7d899d]">We verify payment directly with Helpy before confirming.</p></div>
        </div>
      )}
    </div>
  )
}
