import { ArrowRight, CheckCircle2, Download, Globe2, ShieldCheck, Smartphone } from 'lucide-react'

const ONE_LINK_URL = 'https://onelink.to/zv7wrj/'

export default function AppDownloadPage() {
  const openStore = () => window.location.assign(ONE_LINK_URL)

  return (
    <main className="relative flex min-h-[100dvh] overflow-hidden bg-[#edf6ff] px-5 py-6 text-[#0c1a41] sm:items-center sm:justify-center sm:p-10">
      <div className="pointer-events-none absolute -left-24 top-[-5rem] h-80 w-80 rounded-full bg-[#a7d6ff]/55 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-24 -right-24 h-96 w-96 rounded-full bg-[#b8f0eb]/55 blur-3xl" />
      <section className="relative z-10 mx-auto flex w-full max-w-[1060px] overflow-hidden rounded-[34px] border border-white/90 bg-white/72 shadow-[0_28px_80px_rgba(32,83,145,.16)] backdrop-blur-xl lg:min-h-[620px]">
        <div className="relative hidden w-[46%] overflow-hidden bg-[linear-gradient(145deg,#0b3cae_0%,#0967ff_53%,#14b7c6_100%)] p-11 text-white lg:block">
          <div className="absolute -right-24 -top-20 h-80 w-80 rounded-full border-[36px] border-white/15" />
          <div className="absolute -bottom-24 -left-20 h-80 w-80 rounded-full border-[36px] border-white/10" />
          <img src="/assets/helpy-logo-transparent.png" alt="Helpy" className="relative h-16 w-24 object-contain object-left brightness-0 invert" />
          <div className="relative mt-28">
            <span className="inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/10 px-3 py-2 text-xs font-black"><Smartphone size={15} />THE HELPY APP</span>
            <p className="mt-6 max-w-sm text-5xl font-black leading-[1.02] tracking-[-.06em]">Services, in your pocket.</p>
            <p className="mt-6 max-w-sm text-base font-semibold leading-7 text-blue-100">Book trusted local professionals, manage appointments and stay connected from the Helpy app.</p>
          </div>
          <div className="absolute bottom-11 left-11 right-11 flex gap-6 border-t border-white/20 pt-6 text-sm font-bold text-blue-100"><span className="inline-flex items-center gap-2"><CheckCircle2 size={17} />Verified pros</span><span className="inline-flex items-center gap-2"><CheckCircle2 size={17} />Easy booking</span></div>
        </div>

        <div className="flex min-w-0 flex-1 flex-col px-1 py-2 sm:px-8 sm:py-8 lg:px-14 lg:py-12">
          <header className="flex items-center justify-between px-4 py-3 sm:px-0"><img src="/assets/helpy-logo-transparent.png" alt="Helpy" className="h-12 w-20 object-contain object-left lg:hidden" /><span className="ml-auto inline-flex items-center gap-2 text-xs font-black text-[#687895]"><Globe2 size={16} />Available in Qatar</span></header>
          <div className="my-auto max-w-md px-4 py-12 sm:px-0">
            <span className="inline-flex items-center gap-2 rounded-full border border-blue-100 bg-blue-50 px-3 py-2 text-[11px] font-black tracking-[.09em] text-[#0967ff]"><Download size={14} />GET THE APP</span>
            <h1 className="mt-5 text-[38px] font-black leading-[1.03] tracking-[-.055em] text-[#0c1a41] sm:text-5xl">A better Helpy experience, wherever you are.</h1>
            <p className="mt-5 text-[15px] font-semibold leading-7 text-[#64738e]">Use the Helpy app to book services, receive updates, save places and manage everything in one place.</p>
            <button onClick={openStore} className="mt-8 flex h-14 w-full items-center justify-center gap-2 rounded-[18px] bg-[#0967ff] px-5 text-[15px] font-black text-white shadow-[0_14px_28px_rgba(9,103,255,.25)] transition hover:bg-[#0759df] active:scale-[.99]">Download Helpy <ArrowRight size={19} /></button>
            <a href={ONE_LINK_URL} className="mt-3 flex items-center justify-center gap-2 text-sm font-black text-[#0967ff] underline-offset-4 hover:underline">Open download link <ArrowRight size={15} /></a>
            <div className="mt-8 flex items-start gap-3 rounded-[18px] border border-[#dfeaf7] bg-white/80 p-4"><span className="grid h-9 w-9 shrink-0 place-items-center rounded-[12px] bg-[#ecf7f2] text-[#07966a]"><ShieldCheck size={19} /></span><p className="text-[12px] font-semibold leading-5 text-[#65738c]">The link detects your device and sends you to the right app store. If Helpy is already installed, it can open the app directly.</p></div>
          </div>
        </div>
      </section>
    </main>
  )
}
