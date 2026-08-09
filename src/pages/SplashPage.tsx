import { useEffect, useRef } from 'react'
import { useNav } from '../context/NavContext'

const SPLASH_DURATION = 3500
const SEQUENCE_DURATION = 2800

export default function SplashPage() {
  const { navigate } = useNav()
  const leftHandRef = useRef<HTMLImageElement>(null)
  const rightHandRef = useRef<HTMLImageElement>(null)
  const brandMarkRef = useRef<HTMLDivElement>(null)
  const logoCoverRef = useRef<HTMLDivElement>(null)
  const endFrameRef = useRef<HTMLImageElement>(null)

  useEffect(() => {
    const animations: Animation[] = []
    const animate = (
      element: HTMLElement | null,
      keyframes: Keyframe[],
      options: KeyframeAnimationOptions,
    ) => {
      if (!element) return
      animations.push(element.animate(keyframes, options))
    }

    const handTiming: KeyframeAnimationOptions = {
      duration: 1450,
      delay: 180,
      easing: 'cubic-bezier(.22,.78,.24,1)',
      fill: 'both',
    }

    animate(leftHandRef.current, [
      { offset: 0, transform: 'translate(0, 0) rotate(0deg)' },
      { offset: .18, transform: 'translate(0, 0) rotate(0deg)' },
      { offset: .35, transform: 'translate(16px, 0) rotate(5deg)' },
      { offset: .46, transform: 'translate(16px, -6px) rotate(3deg)' },
      { offset: .57, transform: 'translate(16px, 5px) rotate(5deg)' },
      { offset: .68, transform: 'translate(16px, -6px) rotate(3deg)' },
      { offset: .79, transform: 'translate(16px, 5px) rotate(5deg)' },
      { offset: .88, transform: 'translate(16px, 0) rotate(4deg)' },
      { offset: 1, transform: 'translate(0, 0) rotate(0deg)' },
    ], handTiming)

    animate(rightHandRef.current, [
      { offset: 0, transform: 'translate(0, 0) rotate(0deg)' },
      { offset: .18, transform: 'translate(0, 0) rotate(0deg)' },
      { offset: .35, transform: 'translate(-16px, 0) rotate(-5deg)' },
      { offset: .46, transform: 'translate(-16px, -6px) rotate(-3deg)' },
      { offset: .57, transform: 'translate(-16px, 5px) rotate(-5deg)' },
      { offset: .68, transform: 'translate(-16px, -6px) rotate(-3deg)' },
      { offset: .79, transform: 'translate(-16px, 5px) rotate(-5deg)' },
      { offset: .88, transform: 'translate(-16px, 0) rotate(-4deg)' },
      { offset: 1, transform: 'translate(0, 0) rotate(0deg)' },
    ], handTiming)

    const transitionTiming: KeyframeAnimationOptions = {
      duration: SEQUENCE_DURATION,
      easing: 'cubic-bezier(.42,0,.12,1)',
      fill: 'both',
    }

    animate(brandMarkRef.current, [
      { offset: 0, transform: 'translate(-50%, -50%) rotate(0deg) scale(1)' },
      { offset: .53, transform: 'translate(-50%, -50%) rotate(0deg) scale(1)' },
      { offset: .66, transform: 'translate(-50%, -50%) rotate(-45deg) scale(1.12)' },
      { offset: 1, transform: 'translate(-50%, -50%) rotate(-45deg) scale(8.5)' },
    ], transitionTiming)

    animate(logoCoverRef.current, [
      { offset: 0, opacity: 1 },
      { offset: .63, opacity: 1 },
      { offset: .82, opacity: 0 },
      { offset: 1, opacity: 0 },
    ], transitionTiming)

    animate(endFrameRef.current, [
      { offset: 0, opacity: 0, transform: 'scale(1.035)' },
      { offset: .61, opacity: 0, transform: 'scale(1.035)' },
      { offset: .76, opacity: .7, transform: 'scale(1.012)' },
      { offset: .9, opacity: 1, transform: 'scale(1)' },
      { offset: 1, opacity: 1, transform: 'scale(1)' },
    ], transitionTiming)

    const timer = window.setTimeout(() => navigate('login'), SPLASH_DURATION)

    return () => {
      animations.forEach((animation) => animation.cancel())
      window.clearTimeout(timer)
    }
  }, [navigate])

  return (
    <div className="relative flex flex-1 overflow-hidden bg-white" aria-label="Helpy loading">
      <img
        src="/assets/helpy-splash-start.png"
        alt=""
        className="absolute inset-0 h-full w-full object-fill"
      />

      <div ref={logoCoverRef} className="splash-logo-cover" aria-hidden="true">
        <div ref={brandMarkRef} className="splash-brand-mark">
          <img
            ref={leftHandRef}
            src="/assets/helpy-hand-left.png"
            alt=""
            className="splash-hand splash-hand-left"
          />
          <img
            ref={rightHandRef}
            src="/assets/helpy-hand-right.png"
            alt=""
            className="splash-hand splash-hand-right"
          />
        </div>
      </div>

      <img
        ref={endFrameRef}
        src="/assets/helpy-splash-end.png"
        alt=""
        className="pointer-events-none absolute inset-0 z-20 h-full w-full object-fill opacity-0"
      />

      <span className="sr-only">Helpy, Qatar's Service Provider Platform</span>

      <style>{`
        .splash-logo-cover {
          position: absolute;
          left: 50%;
          top: 41.3%;
          z-index: 10;
          width: 72%;
          height: 27%;
          transform: translate(-50%, -50%);
          background: radial-gradient(
            ellipse at center,
            rgba(255,255,255,1) 0%,
            rgba(255,255,255,.995) 55%,
            rgba(255,255,255,.93) 70%,
            rgba(255,255,255,0) 88%
          );
        }
        .splash-brand-mark {
          position: absolute;
          left: 50%;
          top: 50%;
          width: 87%;
          aspect-ratio: 447 / 318;
          transform: translate(-50%, -50%);
          transform-origin: 50% 50%;
          filter: saturate(1.18) brightness(1.12) drop-shadow(0 16px 18px rgba(21,129,231,.18));
          will-change: transform;
        }
        .splash-hand {
          position: absolute;
          inset: 0;
          height: 100%;
          width: 100%;
          object-fit: contain;
          will-change: transform;
        }
        .splash-hand-left { transform-origin: 64% 58%; }
        .splash-hand-right { transform-origin: 36% 58%; }
      `}</style>
    </div>
  )
}
