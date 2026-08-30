import { useRef, useState } from 'react'
import { ArrowLeft, BriefcaseBusiness, Building2, Check, CheckCircle2, ChevronDown, Home, LocateFixed, MapPin, Navigation, Pencil, Plus, School, Search, X } from 'lucide-react'
import { useNav } from '../context/NavContext'
import { StatusBar } from '../components/shared'

type AddressKind = 'home' | 'work' | 'school' | 'building'
type SavedAddress = { id: number; kind: AddressKind; label: string; address: string; details: string }

const INITIAL_ADDRESSES: SavedAddress[] = [
  { id: 1, kind: 'home', label: 'Home', address: 'Viva Bahriya 10, The Pearl-Qatar', details: 'Tower 10, Floor 13, Apartment 18' },
  { id: 2, kind: 'work', label: 'Work', address: 'West Bay Tower, Doha', details: 'Floor 12, Reception' },
  { id: 3, kind: 'school', label: 'School', address: 'Education City, Al Rayyan', details: 'Gate 2, Main reception' },
  { id: 4, kind: 'building', label: 'Apartment', address: 'Lusail Marina, Lusail City', details: 'Marina Promenade, Building 7' },
]

const MAP_AREAS = [
  { label: 'Lusail', address: 'Lusail Marina, Lusail City', x: 55, y: 27 },
  { label: 'The Pearl', address: 'Viva Bahriya 10, The Pearl-Qatar', x: 59, y: 37 },
  { label: 'West Bay', address: 'West Bay Tower, Doha', x: 56, y: 46 },
  { label: 'Doha', address: 'Msheireb Downtown Doha', x: 55, y: 55 },
  { label: 'Al Rayyan', address: 'Education City, Al Rayyan', x: 48, y: 57 },
  { label: 'Airport', address: 'Hamad International Airport', x: 61, y: 67 },
  { label: 'Al Wakrah', address: 'Al Wakrah, Qatar', x: 57, y: 80 },
]

const kindIcons = { home: Home, work: BriefcaseBusiness, school: School, building: Building2 }
const blankForm = { label: '', address: '', details: '', kind: 'home' as AddressKind }

export default function LocationPickerPage() {
  const { goBack } = useNav()
  const [addresses, setAddresses] = useState(INITIAL_ADDRESSES)
  const [selected, setSelected] = useState(INITIAL_ADDRESSES[0].address)
  const [confirmed, setConfirmed] = useState(false)
  const [mapZoom, setMapZoom] = useState(1)
  const [editorOpen, setEditorOpen] = useState(false)
  const [addingLocation, setAddingLocation] = useState(false)
  const [draftLocation, setDraftLocation] = useState('Msheireb Downtown Doha')
  const [editingId, setEditingId] = useState<number | null>(null)
  const [form, setForm] = useState(blankForm)
  const pinchDistanceRef = useRef<number | null>(null)
  const pinchZoomRef = useRef(1)
  const selectedSaved = addresses.find(item => item.address === selected)

  const getTouchDistance = (touches: React.TouchList) => {
    const a = touches[0]
    const b = touches[1]
    return Math.hypot(a.clientX - b.clientX, a.clientY - b.clientY)
  }

  const handleMapTouchStart = (event: React.TouchEvent<HTMLDivElement>) => {
    if (event.touches.length !== 2) return
    pinchDistanceRef.current = getTouchDistance(event.touches)
    pinchZoomRef.current = mapZoom
  }

  const handleMapTouchMove = (event: React.TouchEvent<HTMLDivElement>) => {
    if (event.touches.length !== 2 || !pinchDistanceRef.current) return
    event.preventDefault()
    const nextDistance = getTouchDistance(event.touches)
    setMapZoom(Math.min(1.75, Math.max(1, pinchZoomRef.current * (nextDistance / pinchDistanceRef.current))))
  }

  const handleMapTouchEnd = () => {
    pinchDistanceRef.current = null
    pinchZoomRef.current = mapZoom
  }

  const openAdd = () => {
    setEditingId(null)
    setDraftLocation('Msheireb Downtown Doha')
    setAddingLocation(true)
  }

  const openEdit = (item: SavedAddress) => {
    setEditingId(item.id)
    setForm({ label: item.label, address: item.address, details: item.details, kind: item.kind })
    setEditorOpen(true)
  }

  const saveAddress = () => {
    if (!form.label.trim() || !form.address.trim()) return
    if (editingId !== null) {
      const previous = addresses.find(item => item.id === editingId)
      setAddresses(items => items.map(item => item.id === editingId ? { ...item, ...form } : item))
      if (previous?.address === selected) setSelected(form.address)
    } else {
      setAddresses(items => [...items, { id: Date.now(), ...form }])
      setSelected(form.address)
    }
    setEditorOpen(false)
  }

  const confirmNewLocation = () => {
    setForm({ ...blankForm, address: draftLocation })
    setEditingId(null)
    setAddingLocation(false)
    setEditorOpen(true)
  }

  if (addingLocation) return (
    <NewLocationPicker
      value={draftLocation}
      onChange={setDraftLocation}
      onBack={() => setAddingLocation(false)}
      onConfirm={confirmNewLocation}
    />
  )

  if (confirmed) return (
    <div className="relative flex flex-1 flex-col overflow-hidden bg-[#eaf5ff]">
      <img src="/assets/home-wave-background-extra-light-preview.png" alt="" className="absolute inset-0 h-full w-full object-cover object-top" />
      <div className="relative z-10 flex flex-1 flex-col items-center justify-center px-7">
        <div className="flex h-20 w-20 items-center justify-center rounded-[26px] bg-white shadow-[0_16px_40px_rgba(9,103,255,0.14)]"><CheckCircle2 size={42} className="text-[#0967ff]" strokeWidth={2.3} /></div>
        <p className="mt-6 text-[23px] font-black text-[#11182d]">Location updated</p>
        <p className="mt-2 max-w-[290px] text-center text-[14px] font-semibold leading-6 text-[#69758d]">{selected}</p>
        <button onClick={goBack} className="mt-8 w-full rounded-[18px] bg-[#0967ff] py-4 text-[14px] font-black text-white shadow-[0_12px_25px_rgba(9,103,255,0.24)]">Back to Home</button>
      </div>
    </div>
  )

  return (
    <div className="relative flex flex-1 flex-col overflow-hidden bg-[#dceeff]">
      <StatusBar />
      <div className="relative h-[292px] shrink-0 overflow-hidden bg-[#dceeff]">
        <div className="absolute inset-0" style={{ touchAction: 'none' }} onTouchStart={handleMapTouchStart} onTouchMove={handleMapTouchMove} onTouchEnd={handleMapTouchEnd} onTouchCancel={handleMapTouchEnd} onDoubleClick={() => setMapZoom(zoom => zoom > 1.2 ? 1 : 1.5)}>
          <div className="absolute inset-0 origin-center transition-transform duration-500 ease-out" style={{ transform: `scale(${mapZoom})` }}>
            <img src="/assets/qatar-map-helpy-theme.png?v=2" alt="" aria-hidden="true" className="h-full w-full object-cover" style={{ filter: 'contrast(1.13) saturate(1.12)' }} />
            <div className="absolute inset-0 bg-gradient-to-b from-white/5 via-transparent to-[#dceeff]/30" />
            {MAP_AREAS.map(area => {
              const active = selected === area.address
              return (
                <button key={area.address} onClick={() => setSelected(area.address)} className="absolute z-20 -translate-x-1/2 -translate-y-1/2" style={{ left: `${area.x}%`, top: `${area.y}%` }} aria-label={`Select ${area.label}`}>
                  <span className={`flex items-center justify-center rounded-full shadow-[0_5px_14px_rgba(9,103,255,0.25)] ring-[3px] ring-white transition-all ${active ? 'h-10 w-10 bg-[#0967ff] text-white' : 'h-7 w-7 bg-white text-[#0967ff]'}`} style={{ transform: `scale(${1 / mapZoom})` }}><MapPin size={active ? 19 : 14} fill={active ? 'white' : '#0967ff'} /></span>
                </button>
              )
            })}
          </div>
        </div>

        <div className="absolute left-4 right-4 top-2 z-30 flex items-center justify-between">
          <button onClick={goBack} className="flex h-11 w-11 items-center justify-center rounded-[15px] bg-white/95 text-[#11182d] shadow-[0_5px_18px_rgba(35,71,113,0.12)] backdrop-blur"><ArrowLeft size={20} /></button>
          <button className="flex h-11 items-center gap-2 rounded-full bg-white/95 px-4 text-[#11182d] shadow-[0_5px_18px_rgba(35,71,113,0.12)] backdrop-blur"><span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#8a1538] text-[11px] font-black text-white">QA</span><span className="text-[13px] font-black">Qatar</span><ChevronDown size={15} className="text-[#778298]" /></button>
        </div>
        <div className="absolute bottom-6 left-4 z-30 rounded-full bg-white/95 px-3.5 py-2 shadow-[0_5px_18px_rgba(35,71,113,0.12)] backdrop-blur"><p className="text-[11px] font-black text-[#0967ff]">Tap a pin to choose an area</p></div>
        <button onClick={() => setMapZoom(1)} className="absolute bottom-6 right-4 z-30 flex h-10 w-10 items-center justify-center rounded-[14px] bg-[#0967ff] text-white shadow-[0_8px_18px_rgba(9,103,255,0.28)]" aria-label="Reset map view"><Navigation size={17} fill="white" /></button>
      </div>

      <section className="relative z-40 -mt-4 flex min-h-0 flex-1 flex-col overflow-hidden rounded-t-[30px] bg-[#f8fbff] shadow-[0_-10px_34px_rgba(35,71,113,0.10)]">
        <div className="mx-auto mt-2.5 h-1 w-10 rounded-full bg-[#d4dfec]" />
        <div className="flex-1 overflow-y-auto px-4 pb-3 pt-3">
          <div className="flex items-end justify-between">
            <div><p className="text-[20px] font-black tracking-[-0.35px] text-[#11182d]">Your locations</p><p className="mt-0.5 text-[11px] font-semibold text-[#7a8599]">Choose where you need the service</p></div>
            <button onClick={openAdd} className="flex items-center gap-1 rounded-full bg-[#e7f1ff] px-3 py-2 text-[11px] font-black text-[#0967ff] active:scale-95"><Plus size={14} strokeWidth={3} /> Add new</button>
          </div>

          <div className="mt-3 rounded-[20px] border border-[#dfeaf7] bg-white p-3 shadow-[0_6px_18px_rgba(35,71,113,0.06)]">
            <div className="mb-2 flex items-center justify-between"><span className="rounded-full bg-[#0967ff] px-2.5 py-1 text-[9px] font-black uppercase tracking-[0.11em] text-white">Current address</span>{selectedSaved && <button onClick={() => openEdit(selectedSaved)} className="flex h-8 w-8 items-center justify-center rounded-full bg-[#f1f6fc] text-[#708098]" aria-label="Edit current address"><Pencil size={14} /></button>}</div>
            <div className="flex items-start gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[13px] bg-[#e9f3ff] text-[#0967ff]"><MapPin size={19} fill="#0967ff" /></div>
              <div className="min-w-0 flex-1"><p className="text-[14px] font-black text-[#11182d]">{selectedSaved?.label ?? 'Selected on map'}</p><p className="mt-0.5 truncate text-[12px] font-semibold text-[#536078]">{selected}</p>{selectedSaved?.details && <p className="mt-0.5 truncate text-[11px] font-medium text-[#939caf]">{selectedSaved.details}</p>}</div>
              <CheckCircle2 size={19} className="mt-2 shrink-0 text-[#0967ff]" fill="#e7f1ff" />
            </div>
          </div>

          <p className="mb-1.5 mt-4 text-[12px] font-black uppercase tracking-[0.08em] text-[#7c879b]">Saved addresses</p>
          <div className="overflow-hidden rounded-[20px] border border-[#e2ebf5] bg-white shadow-[0_6px_18px_rgba(35,71,113,0.05)]">{addresses.map((item, index) => <AddressRow key={item.id} item={item} selected={selected === item.address} divided={index !== addresses.length - 1} onSelect={() => setSelected(item.address)} onEdit={() => openEdit(item)} />)}</div>
        </div>

        <div className="shrink-0 border-t border-[#e7eef6] bg-white/95 px-4 pb-[max(14px,env(safe-area-inset-bottom))] pt-3 backdrop-blur"><button onClick={() => setConfirmed(true)} className="flex w-full items-center justify-center gap-2 rounded-[18px] bg-[#0967ff] py-3.5 text-[14px] font-black text-white shadow-[0_10px_22px_rgba(9,103,255,0.24)] active:scale-[0.99]">Use this location <Check size={17} strokeWidth={3} /></button></div>
      </section>

      {editorOpen && (
        <div className="absolute inset-0 z-50 flex items-end bg-[#091225]/40 p-3 backdrop-blur-[3px]" onClick={() => setEditorOpen(false)}>
          <div className="w-full rounded-[28px] bg-white p-5 shadow-2xl" onClick={event => event.stopPropagation()}>
            <div className="flex items-start justify-between"><div><p className="text-[20px] font-black text-[#11182d]">{editingId === null ? 'Add new address' : 'Edit address'}</p><p className="mt-0.5 text-[12px] font-semibold text-[#7a8599]">Add details so your provider can find you easily.</p></div><button onClick={() => setEditorOpen(false)} className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#f1f5fa] text-[#65728a]"><X size={17} /></button></div>
            <div className="mt-4 grid grid-cols-4 gap-2">{(['home', 'work', 'school', 'building'] as AddressKind[]).map(kind => { const Icon = kindIcons[kind]; const active = form.kind === kind; return <button key={kind} onClick={() => setForm(current => ({ ...current, kind }))} className={`flex flex-col items-center gap-1 rounded-[14px] border py-2 text-[9px] font-black capitalize ${active ? 'border-[#0967ff] bg-[#eaf3ff] text-[#0967ff]' : 'border-[#e4ebf3] text-[#7a8599]'}`}><Icon size={16} /> {kind}</button> })}</div>
            <div className="mt-3 space-y-2.5">
              <Field label="Location name" value={form.label} placeholder="e.g. Home" onChange={value => setForm(current => ({ ...current, label: value }))} />
              <Field label="Address" value={form.address} placeholder="Area, street or building" onChange={value => setForm(current => ({ ...current, address: value }))} />
              <Field label="Additional details" value={form.details} placeholder="Floor, apartment, landmark (optional)" onChange={value => setForm(current => ({ ...current, details: value }))} />
            </div>
            <button onClick={saveAddress} disabled={!form.label.trim() || !form.address.trim()} className="mt-4 w-full rounded-[17px] bg-[#0967ff] py-3.5 text-[14px] font-black text-white shadow-[0_10px_22px_rgba(9,103,255,0.22)] disabled:cursor-not-allowed disabled:opacity-40">{editingId === null ? 'Save address' : 'Save changes'}</button>
          </div>
        </div>
      )}
    </div>
  )
}

function NewLocationPicker({ value, onChange, onBack, onConfirm }: { value: string; onChange: (value: string) => void; onBack: () => void; onConfirm: () => void }) {
  const [mapOffset, setMapOffset] = useState({ x: 0, y: 0 })
  const dragStart = useRef<{ x: number; y: number; originX: number; originY: number } | null>(null)

  const handlePointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
    dragStart.current = { x: event.clientX, y: event.clientY, originX: mapOffset.x, originY: mapOffset.y }
    event.currentTarget.setPointerCapture(event.pointerId)
  }

  const handlePointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    if (!dragStart.current) return
    const x = Math.max(-105, Math.min(105, dragStart.current.originX + event.clientX - dragStart.current.x))
    const y = Math.max(-145, Math.min(145, dragStart.current.originY + event.clientY - dragStart.current.y))
    setMapOffset({ x, y })
  }

  const handlePointerUp = (event: React.PointerEvent<HTMLDivElement>) => {
    if (!dragStart.current) return
    const distance = Math.hypot(event.clientX - dragStart.current.x, event.clientY - dragStart.current.y)
    dragStart.current = null
    if (distance > 12) {
      const locationIndex = Math.min(MAP_AREAS.length - 1, Math.max(0, Math.round(((mapOffset.y + 145) / 290) * (MAP_AREAS.length - 1))))
      onChange(MAP_AREAS[locationIndex].address)
    }
  }

  const useCurrentLocation = () => {
    setMapOffset({ x: 0, y: -22 })
    onChange('Viva Bahriya 10, The Pearl-Qatar')
  }

  return (
    <div className="relative flex flex-1 flex-col overflow-hidden bg-[#dceeff]">
      <StatusBar />
      <div className="relative min-h-0 flex-1 overflow-hidden bg-[#dceeff] touch-none" onPointerDown={handlePointerDown} onPointerMove={handlePointerMove} onPointerUp={handlePointerUp} onPointerCancel={() => { dragStart.current = null }}>
        <img src="/assets/qatar-map-helpy-theme.png?v=2" alt="" aria-hidden="true" draggable={false} className="pointer-events-none absolute inset-0 h-full w-full select-none object-cover transition-transform duration-150" style={{ filter: 'contrast(1.32) saturate(1.35) brightness(.94)', transform: `translate3d(${mapOffset.x}px, ${mapOffset.y}px, 0)` }} />
        <div className="absolute inset-0 bg-gradient-to-b from-white/5 via-transparent to-[#cfe7fb]/20" />

        <div className="absolute left-4 right-4 top-3 z-20 flex items-center justify-between">
          <button onClick={onBack} className="flex h-11 w-11 items-center justify-center rounded-[15px] bg-white/95 text-[#11182d] shadow-[0_7px_20px_rgba(35,71,113,0.16)] backdrop-blur" aria-label="Back to saved locations"><ArrowLeft size={21} /></button>
          <div className="rounded-full bg-white/95 px-4 py-2.5 shadow-[0_7px_20px_rgba(35,71,113,0.14)] backdrop-blur">
            <p className="text-[11px] font-black text-[#0967ff]">Move the map to adjust</p>
          </div>
        </div>

        <div className="pointer-events-none absolute left-1/2 top-[45%] z-20 -translate-x-1/2 -translate-y-full">
          <div className="relative flex h-[58px] w-[58px] items-center justify-center rounded-full bg-[#0967ff] text-white shadow-[0_12px_28px_rgba(9,103,255,0.35)] ring-[6px] ring-white/95">
            <MapPin size={27} fill="white" />
            <span className="absolute -bottom-[16px] left-1/2 h-[18px] w-1.5 -translate-x-1/2 rounded-b-full bg-[#0967ff]" />
          </div>
          <div className="mx-auto mt-5 h-2.5 w-10 rounded-full bg-[#416f9d]/20 blur-[2px]" />
        </div>

        <button onPointerDown={event => event.stopPropagation()} onClick={useCurrentLocation} className="absolute bottom-5 right-4 z-20 flex h-12 w-12 items-center justify-center rounded-[17px] bg-[#0967ff] text-white shadow-[0_9px_22px_rgba(9,103,255,0.32)]" aria-label="Use current location"><LocateFixed size={21} strokeWidth={2.5} /></button>
      </div>

      <section className="relative z-30 -mt-2 shrink-0 rounded-t-[30px] bg-white px-4 pb-[max(16px,env(safe-area-inset-bottom))] pt-3 shadow-[0_-12px_34px_rgba(35,71,113,0.12)]">
        <div className="mx-auto h-1 w-10 rounded-full bg-[#d6e0ec]" />
        <div className="mt-3 text-center">
          <p className="text-[22px] font-black tracking-[-0.4px] text-[#11182d]">Select location</p>
          <p className="mt-1 text-[11px] font-semibold text-[#7b869b]">Place the pin exactly where you need the service</p>
        </div>
        <label className="mt-4 flex items-center gap-2.5 rounded-[16px] border border-[#dde8f4] bg-[#f5f9ff] px-3.5 py-3.5 focus-within:border-[#8db9ff] focus-within:ring-2 focus-within:ring-[#deecff]">
          <Search size={18} className="shrink-0 text-[#7d899e]" />
          <input value={value} onChange={event => onChange(event.target.value)} placeholder="Search area, street or building" className="min-w-0 flex-1 bg-transparent text-[13px] font-bold text-[#243047] outline-none placeholder:text-[#98a2b3]" />
          {value && <button type="button" onClick={() => onChange('')} className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#e6edf6] text-[#79869a]" aria-label="Clear address"><X size={13} /></button>}
        </label>
        <button onClick={onConfirm} disabled={!value.trim()} className="mt-3 flex w-full items-center justify-center gap-2 rounded-[18px] bg-[#0967ff] py-3.5 text-[14px] font-black text-white shadow-[0_10px_22px_rgba(9,103,255,0.24)] active:scale-[0.99] disabled:opacity-40">Confirm location <Check size={17} strokeWidth={3} /></button>
      </section>
    </div>
  )
}

function AddressRow({ item, selected, divided, onSelect, onEdit }: { item: SavedAddress; selected: boolean; divided: boolean; onSelect: () => void; onEdit: () => void }) {
  const Icon = kindIcons[item.kind]
  return (
    <div className={`flex items-center gap-2.5 px-3 py-3 ${divided ? 'border-b border-[#edf2f7]' : ''} ${selected ? 'bg-[#f3f8ff]' : ''}`}>
      <button onClick={onSelect} className="flex min-w-0 flex-1 items-center gap-3 text-left">
        <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-[13px] ${selected ? 'bg-[#0967ff] text-white' : 'bg-[#eef5fd] text-[#0967ff]'}`}><Icon size={18} /></div>
        <div className="min-w-0 flex-1"><div className="flex items-center gap-1.5"><p className="text-[13px] font-black text-[#11182d]">{item.label}</p>{selected && <span className="rounded-full bg-[#dcecff] px-1.5 py-0.5 text-[8px] font-black uppercase tracking-wide text-[#0967ff]">Selected</span>}</div><p className="mt-0.5 truncate text-[11px] font-semibold text-[#606d83]">{item.address}</p><p className="mt-0.5 truncate text-[10px] font-medium text-[#9aa3b3]">{item.details}</p></div>
      </button>
      <button onClick={onEdit} className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-[#8b96a8] active:bg-[#edf3fa]" aria-label={`Edit ${item.label}`}><Pencil size={15} /></button>
    </div>
  )
}

function Field({ label, value, placeholder, onChange }: { label: string; value: string; placeholder: string; onChange: (value: string) => void }) {
  return <label className="block"><span className="mb-1.5 block text-[11px] font-black text-[#4f5d74]">{label}</span><input value={value} onChange={event => onChange(event.target.value)} placeholder={placeholder} className="w-full rounded-[14px] border border-[#dfe8f2] bg-[#f8fbff] px-3.5 py-3 text-[13px] font-semibold text-[#11182d] outline-none transition focus:border-[#8fbaff] focus:ring-2 focus:ring-[#dcecff] placeholder:text-[#a4adbb]" /></label>
}
