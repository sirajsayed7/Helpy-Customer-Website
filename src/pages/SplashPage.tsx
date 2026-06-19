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
          <div className="mascot-traveler absolute bottom-7 left-1/2 h-[190px] w-[156px]">
            <div className="mascot-turner relative h-full w-full">
              <span className="mascot-leg mascot-left-leg" />
              <span className="mascot-leg mascot-right-leg" />
              <span className="mascot-foot mascot-left-foot" />
              <span className="mascot-foot mascot-right-foot" />
              <div className="mascot-shadow absolute bottom-[1px] left-1/2 h-4 w-[92px] -translate-x-1/2 rounded-full bg-[#0967ff]/14 blur-md" />
              <div className="mascot-body absolute bottom-[19px] left-1/2 z-10 h-[169px] w-[150px] -translate-x-1/2 overflow-hidden rounded-[30px]">
                <img src="/assets/helpy-mascot-walk.png" alt="Helpy mascot" className="h-[218px] w-full object-cover object-top" />
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
          animation: walkingBody .4s ease-in-out .12s 5, finalStand .65s ease-out 2.12s both;
          transform-origin: 50% 100%;
        }
        .mascot-leg {
          position: absolute;
          bottom: 16px;
          z-index: 7;
          display: block;
          height: 28px;
          width: 25px;
          border-radius: 16px 16px 11px 11px;
          background: linear-gradient(180deg, #1775e9 0%, #0d55b9 100%);
          box-shadow: inset -5px -5px 10px rgba(3,44,120,.18);
        }
        .mascot-left-leg {
          left: 45px;
          animation: leftLegWalk .4s ease-in-out .12s 5, legSettleLeft .65s ease-out 2.12s both;
          transform-origin: 50% 0%;
        }
        .mascot-right-leg {
          right: 42px;
          animation: rightLegWalk .4s ease-in-out .12s 5, legSettleRight .65s ease-out 2.12s both;
          transform-origin: 50% 0%;
        }
        .mascot-foot {
          position: absolute;
          bottom: 2px;
          z-index: 8;
          display: block;
          height: 25px;
          width: 49px;
          border-radius: 56% 44% 36% 32% / 68% 66% 34% 32%;
          background:
            radial-gradient(circle at 31% 28%, rgba(255,232,129,.95) 0 10%, transparent 32%),
            linear-gradient(145deg, #ffc340 0%, #f4a21a 48%, #d97800 100%);
          box-shadow: inset -8px -7px 12px rgba(141,72,0,.16), 0 8px 14px rgba(187,111,0,.22);
        }
        .mascot-left-foot {
          left: 32px;
          animation: leftFootWalk .4s ease-in-out .12s 5, footSettleLeft .65s ease-out 2.12s both;
          transform-origin: 80% 50%;
        }
        .mascot-right-foot {
          right: 29px;
          animation: rightFootWalk .4s ease-in-out .12s 5, footSettleRight .65s ease-out 2.12s both;
          transform-origin: 20% 50%;
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
          68% { opacity: 1; transform: translateX(18px); }
          100% { opacity: 1; transform: translateX(18px); }
        }
        @keyframes turnForward {
          0%, 66% { transform: perspective(480px) rotateY(-21deg) rotateZ(2deg); }
          82% { transform: perspective(480px) rotateY(4deg) rotateZ(0deg); }
          100% { transform: perspective(480px) rotateY(0deg) rotateZ(0deg); }
        }
        @keyframes walkingBody {
          0%, 100% { transform: translateX(-50%) translateY(0) rotate(-1.8deg); }
          50% { transform: translateX(-50%) translateY(-7px) rotate(1.8deg); }
        }
        @keyframes finalStand {
          from { transform: translateX(-50%) translateY(-4px) rotate(1deg); }
          to { transform: translateX(-50%) translateY(0) rotate(0deg); }
        }
        @keyframes leftLegWalk {
          0%, 100% { transform: translateX(-4px) rotate(-8deg); }
          50% { transform: translateX(8px) rotate(12deg); }
        }
        @keyframes rightLegWalk {
          0%, 100% { transform: translateX(8px) rotate(12deg); }
          50% { transform: translateX(-4px) rotate(-8deg); }
        }
        @keyframes legSettleLeft {
          to { transform: translateX(-2px) rotate(-3deg); }
        }
        @keyframes legSettleRight {
          to { transform: translateX(2px) rotate(3deg); }
        }
        @keyframes leftFootWalk {
          0%, 100% { transform: translateX(-7px) translateY(0) rotate(-7deg) scaleX(.98); }
          50% { transform: translateX(10px) translateY(-8px) rotate(12deg) scaleX(1.04); }
        }
        @keyframes rightFootWalk {
          0%, 100% { transform: translateX(9px) translateY(-8px) rotate(10deg) scaleX(1.04); }
          50% { transform: translateX(-7px) translateY(0) rotate(-7deg) scaleX(.98); }
        }
        @keyframes footSettleLeft {
          to { transform: translateX(-3px) translateY(0) rotate(-3deg) scaleX(1); }
        }
        @keyframes footSettleRight {
          to { transform: translateX(3px) translateY(0) rotate(3deg) scaleX(1); }
        }
        @keyframes dotPulse {
          0%, 100% { opacity: .35; transform: scale(.86); }
          50% { opacity: 1; transform: scale(1.15); }
        }
        @media (max-width: 380px) {
          .splash-logo-lockup img { height: 130px; width: 188px; }
          .splash-logo-lockup p { font-size: 62px; }
          .mascot-stage { height: 194px; margin-top: 24px; }
          .mascot-traveler { height: 178px; width: 144px; }
          .mascot-body { height: 158px; width: 140px; }
          .mascot-body img { height: 204px; }
        }
      `}</style>
    </div>
  )
}
