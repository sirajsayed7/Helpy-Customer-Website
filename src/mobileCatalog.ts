import type { LiveBusiness, LiveService } from './context/HelpyDataContext'

export type MobileServiceParams = {
  provider: string
  name: string
  price: string
  providerImage: string
  heroImg: string
  liveService: LiveService
}

export function mobileServiceParams(service: LiveService): MobileServiceParams {
  return {
    provider: service.provider,
    name: service.name,
    price: String(service.price),
    providerImage: service.image,
    heroImg: service.image,
    liveService: service,
  }
}

export function primaryBusinessService(business: LiveBusiness) {
  return [...business.services].sort((a, b) => b.rating - a.rating || a.price - b.price)[0]
}

export function initials(value: string) {
  return value.split(/\s+/).filter(Boolean).map(word => word[0]).join('').slice(0, 2).toUpperCase() || 'H'
}
