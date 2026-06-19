import { useRef, useState } from 'react'
import { ArrowLeft, Building2, CheckCircle2, Home, MapPin, Navigation, Search } from 'lucide-react'
import { useNav } from '../context/NavContext'
import { StatusBar } from '../components/shared'

const SAVED = [
  {icon: Home, label:'Home', addr:'Viva Bahriya 10, The Pearl-Qatar', primary:true},
  {icon: Building2, label:'Work', addr:'West Bay Tower, Floor 12, Doha', primary:false},
  {icon: Home, label:'Parents', addr:'Al Sadd Street, Villa 5, Doha', primary:false},
]
const NEARBY = [
  'Al Waab Street, Doha',
  'Lusail Marina, Lusail City',
  'Hamad International Airport',
  'Al Corniche Street, West Bay',
  'Msheireb Downtown Doha',
  'Al Wakrah, Doha',
  'Qatar University Area, Doha',
]

const MAP_AREAS = [
  { label: 'Lusail', addr: 'Lusail Marina, Lusail City', x: 55, y: 28 },
  { label: 'Pearl', addr: 'Viva Bahriya 10, The Pearl-Qatar', x: 58, y: 38 },
  { label: 'West Bay', addr: 'Al Corniche Street, West Bay', x: 56, y: 46 },
  { label: 'Doha', addr: 'Msheireb Downtown Doha', x: 55, y: 54 },
  { label: 'Al Waab', addr: 'Al Waab Street, Doha', x: 50, y: 58 },
  { label: 'Airport', addr: 'Hamad International Airport', x: 60, y: 66 },
  { label: 'Wakrah', addr: 'Al Wakrah, Doha', x: 56, y: 79 },
]

export default function LocationPickerPage() {
  const { goBack } = useNav()
  const [q, setQ] = useState('')
  const [selected, setSelected] = useState('Viva Bahriya 10, The Pearl-Qatar')
  const [confirmed, setConfirmed] = useState(false)
  const [mapZoom, setMapZoom] = useState(1)
  const pinchDistanceRef = useRef<number | null>(null)
  const pinchZoomRef = useRef(1)

  const suggestions = NEARBY.filter(n => n.toLowerCase().includes(q.toLowerCase()))

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
    const nextZoom = Math.min(1.85, Math.max(1, pinchZoomRef.current * (nextDistance / pinchDistanceRef.current)))
    setMapZoom(nextZoom)
  }

  const handleMapTouchEnd = () => {
    pinchDistanceRef.current = null
    pinchZoomRef.current = mapZoom
  }

  const clampZoom = (value: number) => Math.min(1.85, Math.max(1, value))

  const handleMapWheel = (event: React.WheelEvent<HTMLDivElement>) => {
    if (!event.ctrlKey && Math.abs(event.deltaY) < 40) return
    event.preventDefault()
    const direction = event.deltaY > 0 ? -1 : 1
    const sensitivity = event.ctrlKey ? 0.018 : 0.006
    setMapZoom(zoom => clampZoom(zoom + direction * Math.min(0.18, Math.abs(event.deltaY) * sensitivity)))
  }

  const handleMapDoubleClick = () => {
    setMapZoom(zoom => zoom > 1.2 ? 1 : 1.55)
  }

  if (confirmed) return (
    <div className="relative flex flex-col flex-1 overflow-hidden bg-[#d8edff]">
      <img src="/assets/home-wave-background-extra-light-preview.png" alt="" className="absolute inset-0 h-full w-full object-cover object-top" />
      <div className="relative z-10 flex flex-1 flex-col items-center justify-center px-8 gap-5">
        <div className="w-20 h-20 rounded-full bg-white flex items-center justify-center shadow-md"><CheckCircle2 size={40} className="text-[#0967ff]"/></div>
        <p className="text-[22px] font-black text-[#10152f] text-center">Location set</p>
        <p className="text-[14px] font-semibold text-[#65708a] text-center leading-relaxed">{selected}</p>
        <button onClick={goBack} className="w-full py-4 rounded-[18px] bg-[#0967ff] text-white text-[14px] font-black shadow-lg shadow-blue-200">Back to Home</button>
      </div>
    </div>
  )

  return (
    <div className="relative flex flex-col flex-1 bg-[#d8edff] overflow-hidden">
      <img src="/assets/home-wave-background-extra-light-preview.png" alt="" className="absolute inset-0 h-full w-full object-cover object-top" />
      <StatusBar/>
      <div className="relative z-10 flex items-center gap-3 px-4 pt-1 pb-3 shrink-0">
        <button onClick={goBack} className="w-10 h-10 bg-white rounded-[14px] shadow-sm flex items-center justify-center"><ArrowLeft size={20} className="text-[#10152f]"/></button>
        <div><p className="text-[20px] font-black text-[#10152f]">Set Location</p><p className="text-[12px] font-semibold text-[#65708a]">Choose your service address</p></div>
      </div>

      <div
        className="relative z-10 mx-4 mb-4 rounded-[24px] overflow-hidden shadow-sm ring-1 ring-white/70"
        style={{height:230, touchAction:'none'}}
        onTouchStart={handleMapTouchStart}
        onTouchMove={handleMapTouchMove}
        onTouchEnd={handleMapTouchEnd}
        onTouchCancel={handleMapTouchEnd}
        onWheel={handleMapWheel}
        onDoubleClick={handleMapDoubleClick}
      >
        <div className="relative w-full h-full bg-[#e9f7ff]">
          <div
            className="absolute inset-0 origin-center transition-transform duration-500 ease-out"
            style={{ transform: `scale(${mapZoom})` }}
          >
            <img
              src="/assets/qatar-map-helpy-theme.png"
              alt=""
              className="absolute inset-0 h-full w-full object-cover"
              aria-hidden="true"
            />
            <div className="absolute inset-0 bg-white/5" />

            {MAP_AREAS.map(area => {
              const active = selected === area.addr
              return (
                <button
                  key={area.addr}
                  onClick={()=>setSelected(area.addr)}
                  className="absolute z-20 -translate-x-1/2 -translate-y-1/2"
                  style={{ left: `${area.x}%`, top: `${area.y}%` }}
                >
                  <span
                    className={`flex items-center justify-center rounded-full shadow-lg ring-4 transition ${active ? 'h-10 w-10 bg-[#0967ff] text-white ring-blue-100 scale-110' : 'h-7 w-7 bg-white text-[#0967ff] ring-white/80'}`}
                    style={{ transform: `scale(${1 / mapZoom})` }}
                  >
                    <MapPin size={active ? 19 : 14} fill={active ? 'white' : '#0967ff'} />
                  </span>
                  <span
                    className={`absolute left-1/2 top-full mt-1 -translate-x-1/2 whitespace-nowrap rounded-full px-2 py-0.5 text-[10px] font-black shadow-sm ${active ? 'bg-[#0967ff] text-white' : 'bg-white/95 text-[#10152f]'}`}
                    style={{ transform: `translateX(-50%) scale(${1 / mapZoom})`, transformOrigin: 'top center' }}
                  >
                    {area.label}
                  </span>
                </button>
              )
            })}
          </div>

          <div className="absolute left-5 top-5 z-20 rounded-full bg-white/90 px-3 py-1 text-[11px] font-black text-[#0967ff] shadow-sm">Qatar map</div>

          <div className="absolute right-3 top-3 z-30 rounded-full bg-white/90 px-3 py-1 text-[11px] font-black text-[#65708a] shadow-sm">
            Pinch / scroll to zoom
          </div>

          <div className="absolute bottom-3 left-3 right-16 z-20 rounded-[16px] bg-white/95 px-3 py-2 shadow-sm">
            <p className="text-[10px] font-black uppercase tracking-wide text-[#65708a]">Selected</p>
            <p className="truncate text-[12px] font-black text-[#0967ff]">{selected}</p>
          </div>
          <button onClick={()=>setMapZoom(1)} className="absolute bottom-3 right-3 z-20 w-10 h-10 bg-white rounded-[15px] shadow-sm flex items-center justify-center"><Navigation size={17} className="text-[#0967ff]"/></button>
        </div>
      </div>

      <div className="relative z-10 px-4 mb-4 shrink-0">
        <div className="flex items-center gap-2 bg-white rounded-[19px] px-3.5 py-3 shadow-sm">
          <Search size={17} className="text-[#65708a]"/>
          <input value={q} onChange={e=>setQ(e.target.value)} placeholder="Search for an area or street..." className="flex-1 bg-transparent text-[14px] font-semibold outline-none placeholder:text-[#8b92a8]"/>
        </div>
      </div>

      <div className="relative z-10 flex-1 overflow-y-auto px-4 pb-4 space-y-4">
        {!q && (
          <div>
            <p className="text-[14px] font-bold text-gray-900 mb-2">Saved Addresses</p>
            <div className="bg-white rounded-2xl shadow-sm overflow-hidden divide-y divide-gray-50">
              {SAVED.map((s,i)=>(
                <SavedAddressButton key={i} item={s} selected={selected} onSelect={setSelected} />
              ))}
            </div>
          </div>
        )}

        <div>
          <p className="text-[14px] font-bold text-gray-900 mb-2">{q ? 'Search Results' : 'Nearby Locations'}</p>
          <div className="bg-white rounded-2xl shadow-sm overflow-hidden divide-y divide-gray-50">
            {(q ? suggestions : NEARBY).map((n,i)=>(
              <button key={i} onClick={()=>setSelected(n)}
                className={`w-full flex items-center gap-3 p-4 active:bg-blue-50 transition-colors ${selected===n?'bg-blue-50':''}`}>
                <div className="w-9 h-9 rounded-xl bg-gray-50 flex items-center justify-center shrink-0"><MapPin size={15} className="text-gray-400"/></div>
                <p className="flex-1 text-[13px] font-semibold text-gray-800 text-left">{n}</p>
                {selected===n&&<CheckCircle2 size={16} className="text-[#0967ff] shrink-0"/>}
              </button>
            ))}
          </div>
        </div>

        <button onClick={()=>setConfirmed(true)} className="w-full py-4 rounded-[18px] bg-[#0967ff] text-white text-[14px] font-black shadow-lg shadow-blue-200">
          Confirm Location
        </button>
      </div>
    </div>
  )
}

function SavedAddressButton({
  item,
  selected,
  onSelect
}: {
  item: typeof SAVED[number]
  selected: string
  onSelect: (addr: string) => void
}) {
  const Icon = item.icon

  return (
    <button
      onClick={()=>onSelect(item.addr)}
      className={`w-full flex items-center gap-3 p-4 active:bg-blue-50 transition-colors ${selected===item.addr?'bg-blue-50':''}`}
    >
      <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center shrink-0">
        <Icon size={18} className="text-[#0967ff]"/>
      </div>
      <div className="flex-1 text-left">
        <div className="flex items-center gap-2">
          <p className="text-[13px] font-bold text-gray-900">{item.label}</p>
          {item.primary&&<span className="text-[10px] font-bold text-[#0967ff] bg-blue-50 px-2 py-0.5 rounded-full">Primary</span>}
        </div>
        <p className="text-[11px] text-gray-500 mt-0.5">{item.addr}</p>
      </div>
      {selected===item.addr&&<CheckCircle2 size={18} className="text-[#0967ff] shrink-0"/>}
    </button>
  )
}
