import { useEffect, useState, type MouseEvent } from 'react'
import { ArrowRight, BriefcaseBusiness, CheckCircle2, X } from 'lucide-react'

type ProviderPromotionProps = {
  onClick: () => void
  compact?: boolean
  dismissible?: boolean
}

const DISMISS_KEY = 'helpy_provider_promotion_dismissed'
const DISMISS_EVENT = 'helpy-provider-promotion-dismissed'

export default function ProviderPromotion({ onClick, compact = false, dismissible = true }: ProviderPromotionProps) {
  const [dismissed, setDismissed] = useState(() => dismissible && window.sessionStorage.getItem(DISMISS_KEY) === 'true')

  useEffect(() => {
    if (!dismissible) return
    const syncDismissal = () => setDismissed(true)
    window.addEventListener(DISMISS_EVENT, syncDismissal)
    return () => window.removeEventListener(DISMISS_EVENT, syncDismissal)
  }, [dismissible])

  if (dismissed) return null

  const dismiss = (event: MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation()
    window.sessionStorage.setItem(DISMISS_KEY, 'true')
    setDismissed(true)
    window.dispatchEvent(new Event(DISMISS_EVENT))
  }

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={onClick}
      onKeyDown={(event)=>{
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault()
          onClick()
        }
      }}
      className={`group relative min-h-[108px] w-full overflow-hidden rounded-[22px] bg-[linear-gradient(120deg,#0758d4_0%,#0967ff_58%,#1678f2_100%)] text-left shadow-[0_12px_28px_rgba(9,103,255,0.20)] transition active:scale-[0.985] ${compact ? 'p-3.5' : 'p-4'}`}
    >
      <span className="absolute -right-12 -top-16 h-44 w-44 rounded-full border-[26px] border-white/10" aria-hidden="true" />
      <span className="absolute right-7 top-1 h-16 w-16 rounded-full border border-white/10" aria-hidden="true" />
      <span className="absolute inset-y-0 right-0 w-[42%] bg-[linear-gradient(135deg,transparent_20%,rgba(255,255,255,0.08)_20%,rgba(255,255,255,0.08)_22%,transparent_22%)]" aria-hidden="true" />
      {dismissible && (
        <button
          onClick={dismiss}
          className="absolute right-3.5 top-2.5 z-10 flex h-6 w-6 items-center justify-center rounded-full border border-white/20 bg-[#0758d4]/35 text-white shadow-sm backdrop-blur-sm transition hover:bg-white/20 active:scale-90"
          aria-label="Dismiss service provider promotion"
          title="Dismiss"
        >
          <X size={14} strokeWidth={2.5} />
        </button>
      )}
      <div className="relative flex items-start gap-3 pr-[88px]">
        <div className="mt-1 flex h-11 w-11 shrink-0 items-center justify-center rounded-[15px] bg-white text-[#0967ff] shadow-[0_8px_18px_rgba(1,39,112,0.18)]">
          <BriefcaseBusiness size={22} strokeWidth={2.2} />
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-1.5">
            <p className="text-[10px] font-black uppercase tracking-[0.13em] text-white/70">Helpy Partner Network</p>
            <CheckCircle2 size={13} className="shrink-0 text-[#dfff2d]" fill="#dfff2d" stroke="#0967ff" strokeWidth={3} />
          </div>
          <p className="mt-0.5 text-[17px] leading-5 font-black tracking-[-0.02em] text-white">Become a Service Provider</p>
          <p className="mt-1 text-[11px] leading-4 font-semibold text-white/80">Reach more customers and grow with Helpy.</p>
        </div>
      </div>
      <span className="absolute right-4 top-[56px] z-10 flex h-9 items-center gap-1 rounded-full bg-white px-3.5 text-[11px] font-black text-[#0967ff] shadow-[0_5px_14px_rgba(1,39,112,0.18)] transition group-hover:bg-[#edf5ff]">
        Join <ArrowRight size={14} strokeWidth={2.5} />
      </span>
    </div>
  )
}
