import { useEffect } from 'react'
import { StatusBar } from '../components/shared'
import { useNav } from '../context/NavContext'

export default function SplashPage() {
  const { navigate } = useNav()

  useEffect(() => {
    const timer = window.setTimeout(() => navigate('login'), 3300)
    return () => window.clearTimeout(timer)
  }, [navigate])

  return (
    <div className="relative flex flex-col flex-1 overflow-hidden bg-white">
      <div className="absolute inset-x-0 bottom-[-120px] h-[330px] bg-[radial-gradient(circle_at_50%_15%,rgba(9,103,255,0.16),rgba(216,237,255,0.42)_38%,rgba(255,255,255,0)_72%)]" />
      <div className="absolute left-[-120px] top-[12%] h-[260px] w-[260px] rounded-full bg-[#e9f6ff] blur-3xl" />
      <div className="absolute right-[-120px] top-[18%] h-[220px] w-[220px] rounded-full bg-[#f3fbff] blur-3xl" />
      <StatusBar />

      <div className="relative z-10 flex flex-1 flex-col items-center justify-center px-8 pb-8 text-center">
        <div className="splash-logo-lockup">
          <img src="/assets/helpy-logo-transparent.png" alt="Helpy" className="mx-auto h-[150px] w-[210px] object-contain" />
          <p className="-mt-3 text-[72px] font-black leading-none tracking-[-0.04em] text-[#151033]">HELPY</p>
        </div>

        <div className="mascot-stage relative mt-7 h-[210px] w-full max-w-[430px] overflow-hidden">
          <div className="mascot-ground absolute bottom-5 left-1/2 h-[4px] w-[330px] -translate-x-1/2 rounded-full bg-gradient-to-r from-transparent via-[#0967ff]/18 to-transparent" />
          <div className="mascot-traveler absolute bottom-5 left-1/2 h-[194px] w-[122px]">
            <div className="mascot-turner relative h-full w-full">
              <div className="mascot-shadow absolute bottom-[2px] left-1/2 h-4 w-[94px] -translate-x-1/2 rounded-full bg-[#0967ff]/16 blur-md" />
              <div className="mascot-body absolute inset-0 z-10 flex items-end justify-center">
                <div className="mascot-sprite h-full w-full" role="img" aria-label="Helpy mascot walking" />
              </div>
            </div>
          </div>
        </div>

        <div className="splash-loader mt-7 flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-[#0967ff]" />
          <span className="h-2 w-2 rounded-full bg-[#7ebcff]" />
          <span className="h-2 w-2 rounded-full bg-[#cfe9ff]" />
        </div>
      </div>

      <style>{`
        .splash-logo-lockup {
          animation: logoReveal .95s cubic-bezier(.2,.9,.2,1) both;
        }
        .mascot-stage {
          animation: stageReveal .55s ease-out .45s both;
        }
        .mascot-traveler {
          animation: travelAcross 3s cubic-bezier(.34,.02,.18,1) .12s both;
          transform: translateX(-232px);
        }
        .mascot-turner {
          animation: turnForward 3s ease-in-out .12s both;
          transform-origin: 50% 100%;
        }
        .mascot-body {
          animation: walkingBody .55s cubic-bezier(.45,.05,.55,.95) .12s 4, finalStand .62s cubic-bezier(.2,.8,.2,1) 2.3s both;
          transform-origin: 50% 88%;
        }
        .mascot-sprite {
          background-image: url('/assets/helpy-mascot-walk-cycle.png');
          background-position: 0 0;
          background-repeat: no-repeat;
          background-size: 700% 100%;
          filter: drop-shadow(0 9px 10px rgba(24,79,151,.16));
          mix-blend-mode: multiply;
          animation: spriteWalk .55s steps(6, end) .12s 4 alternate both;
          will-change: background-position;
        }
        .splash-loader span {
          animation: dotPulse 1s ease-in-out infinite;
        }
        .splash-loader span:nth-child(2) { animation-delay: .12s; }
        .splash-loader span:nth-child(3) { animation-delay: .24s; }
        @keyframes logoReveal {
          0% { opacity: 0; transform: translateY(18px) scale(.94); filter: blur(6px); }
          70% { opacity: 1; transform: translateY(-3px) scale(1.015); filter: blur(0); }
          100% { opacity: 1; transform: translateY(0) scale(1); filter: blur(0); }
        }
        @keyframes stageReveal {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes travelAcross {
          0% { opacity: 0; transform: translateX(-235px); }
          8% { opacity: 1; }
          72% { opacity: 1; transform: translateX(18px); }
          100% { opacity: 1; transform: translateX(18px); }
        }
        @keyframes turnForward {
          0%, 68% { transform: perspective(520px) rotateY(-13deg) rotateZ(1deg); }
          84% { transform: perspective(520px) rotateY(2deg) rotateZ(0deg); }
          100% { transform: perspective(480px) rotateY(0deg) rotateZ(0deg); }
        }
        @keyframes walkingBody {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-2px); }
        }
        @keyframes spriteWalk {
          from { background-position: 0 0; }
          to { background-position: 100% 0; }
        }
        @keyframes finalStand {
          0% { transform: translateY(-4px) rotate(.8deg) scaleY(1.008); }
          68% { transform: translateY(1px) rotate(-.25deg) scaleY(.996); }
          100% { transform: translateY(0) rotate(0deg) scaleY(1); }
        }
        @keyframes dotPulse {
          0%, 100% { opacity: .35; transform: scale(.86); }
          50% { opacity: 1; transform: scale(1.15); }
        }
        @media (max-width: 380px) {
          .splash-logo-lockup img { height: 130px; width: 188px; }
          .splash-logo-lockup p { font-size: 62px; }
          .mascot-stage { height: 194px; margin-top: 24px; }
          .mascot-traveler { height: 178px; width: 112px; }
        }
      `}</style>
    </div>
  )
}
