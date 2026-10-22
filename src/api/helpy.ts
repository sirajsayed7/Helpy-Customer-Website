const DEFAULT_API_BASE = 'https://admin.helpyapp.tech/api/v1'
const TOKEN_KEY = 'helpy_session_token'
const SESSION_KIND_KEY = 'helpy_session_kind'
const FIREBASE_CUSTOM_TOKEN_KEY = 'helpy_firebase_custom_token'

type RequestMethod = 'GET' | 'POST'
type QueryValue = string | number | boolean | null | undefined
type FormValue = QueryValue | FormValue[] | { [key: string]: FormValue }

export type HelpyEnvelope<T> = {
  status: boolean
  message: string
  data: T
  code: number
  token?: string
}

export type HelpyCategory = {
  category_id: number
  name: string
  name_ar: string
  description: string | null
  description_ar: string | null
  category_image: string | null
  category_image_url: string | null
}

export type HelpyBanner = {
  banner_id: number
  name: string
  service_id: number | null
  target_type: string | null
  target_id: number | null
  banner_images: unknown
}

export type HelpyRegion = {
  id: number
  name: string
  name_ar: string
}

export type HelpyCity = HelpyRegion & {
  state_id: number
  state_code: string | null
  country_id: number | null
  country_code: string | null
  latitude: string | null
  longitude: string | null
}

export type HelpyService = Record<string, unknown> & {
  service_vendor_mapp_id: number
  category_id: number
  service_id: number
  name: string
  name_ar: string
  price: number | string
  rating: number | string | null
  service_image: string | null
  service_image_small: string | null
}

export type HelpyProvider = Record<string, unknown> & {
  id: number
  name: string
  name_ar: string
  profile_photo: string | null
  user_profile_image_url: string | null
  vendor_profile_image_url: string | null
  rateing: number | string | null
  weekly_bookings_count: number | null
  service_setup: unknown
}

export type Paginated<T> = {
  total_records: number
  page: number
  limit: number
  data: T[]
}

export type HelpyAvailabilitySlot = {
  day: string
  slot: string
  date: string
  isAvailable: boolean | number
}

export type HelpyAddressInput = {
  addressType?: 1 | 2 | 3
  title: string
  address: string
  countryId?: number
  stateId: number
  cityId: number
  buildingNumber?: string
  zone?: string
  street?: string
  floor?: string
  apartment?: string
  landmark?: string
  latitude?: number
  longitude?: number
  notes?: string
}

export type HelpyBookingPreflight = {
  wallet_balance: string
  final_price: string
  wallet_cover_amount: string
  shortage_amount: string
  can_wallet_fully_cover: number
  can_proceed: number
  payment_type: string
  next_step: string
}

export type HelpyBookingInput = {
  service_vendor_mapp_id: number
  user_id: number
  provider_id: number
  booking_type: number
  booking_date_time: string
  booking_end_datetime: string
  total_price: string
  payment_type: 'online' | 'tap'
  promo_code_id?: number
  promo_code_discount_percentage?: string
  discount_amount?: string
  wallet_balance?: string
  wallet_amount?: string
  payment_gateway_amount: string
  final_price: string
  location: string
  requirements?: string
  booking_address: string
  booking_address_id: string | number
  payment_status?: string
  services: Array<{
    user_id: number
    service_id: number
    provider_id: number
    service_type_id: number
    category_id: number
    service_vendor_mapp_id: number
    category_name: string
    name: string
    user_name: string
    service_name: string
    service_type_name: string
    provider_name: string
    total_price: string
    discount_price: string
    final_price: string
  }>
}

export type HelpyTapCheckout = {
  returnCode: string
  hasError: boolean
  gateway: string
  mode?: 'test' | 'live'
  paymentReference: string
  resultObj?: {
    id?: string
    status?: string
    payUrl?: string
    amount?: string
    currency?: string
  }
}

export class HelpyApiError extends Error {
  constructor(
    message: string,
    readonly status: number,
    readonly response?: unknown,
  ) {
    super(message)
    this.name = 'HelpyApiError'
  }
}

const runtimeEnv = import.meta.env as Record<string, string | boolean | undefined>

function readToken() {
  if (typeof window === 'undefined') return null
  return window.sessionStorage.getItem(TOKEN_KEY)
}

export function getHelpyAccessToken() {
  return readToken()
}

export function getHelpyFirebaseCustomToken() {
  if (typeof window === 'undefined') return null
  return window.sessionStorage.getItem(FIREBASE_CUSTOM_TOKEN_KEY)
}

export function clearHelpyFirebaseCustomToken() {
  if (typeof window !== 'undefined') window.sessionStorage.removeItem(FIREBASE_CUSTOM_TOKEN_KEY)
}

export function hasHelpySession() {
  return Boolean(readToken())
}

export function hasHelpyUserSession() {
  return Boolean(readToken()) && window.sessionStorage.getItem(SESSION_KIND_KEY) === 'user'
}

function writeToken(token: string, kind: 'guest' | 'user') {
  if (typeof window !== 'undefined') {
    window.sessionStorage.setItem(TOKEN_KEY, token)
    window.sessionStorage.setItem(SESSION_KIND_KEY, kind)
  }
}

function writeFirebaseCustomToken(value: unknown) {
  if (typeof window !== 'undefined' && typeof value === 'string' && value.trim()) {
    window.sessionStorage.setItem(FIREBASE_CUSTOM_TOKEN_KEY, value)
  }
}

function toSearchParams(values: Record<string, QueryValue>) {
  const params = new URLSearchParams()
  Object.entries(values).forEach(([key, value]) => {
    if (value !== null && value !== undefined) params.set(key, String(value))
  })
  return params
}

function appendFormValue(params: URLSearchParams, key: string, value: FormValue) {
  if (value === null || value === undefined) return
  if (Array.isArray(value)) {
    value.forEach((item, index) => appendFormValue(params, `${key}[${index}]`, item))
    return
  }
  if (typeof value === 'object') {
    Object.entries(value).forEach(([childKey, item]) => appendFormValue(params, `${key}[${childKey}]`, item))
    return
  }
  params.append(key, String(value))
}

function toFormParams(values: Record<string, FormValue>) {
  const params = new URLSearchParams()
  Object.entries(values).forEach(([key, value]) => appendFormValue(params, key, value))
  return params
}

class HelpyApiClient {
  // Keep every local request same-origin so Vite can proxy it to the API without
  // the browser applying the production site's CORS policy to localhost.
  private readonly baseUrl = String(runtimeEnv.DEV ? '/api/v1' : (runtimeEnv.VITE_HELPY_API_BASE || DEFAULT_API_BASE)).replace(/\/$/, '')
  private guestPromise: Promise<string> | null = null

  private async request<T>(
    path: string,
    options: {
      method?: RequestMethod
      query?: Record<string, QueryValue>
      form?: Record<string, FormValue>
      multipart?: Record<string, QueryValue>
      authenticated?: boolean
      coordinates?: { latitude: number; longitude: number }
    } = {},
  ): Promise<HelpyEnvelope<T>> {
    const { method = 'GET', query, form, multipart, authenticated = true, coordinates } = options
    const queryString = query ? `?${toSearchParams(query).toString()}` : ''
    const headers = new Headers({
      Accept: 'application/json',
      language: 'en',
      lan: String(coordinates?.latitude ?? 25.2854),
      long: String(coordinates?.longitude ?? 51.5310),
    })

    if (authenticated) {
      const token = readToken() || await this.ensureGuestSession()
      headers.set('Authorization', `Bearer ${token}`)
    } else {
      // This matches the APK's guest bootstrap request.
      headers.set('Authorization', 'Bearer')
    }

    let body: BodyInit | undefined
    if (form) {
      body = toFormParams(form)
      headers.set('Content-Type', 'application/x-www-form-urlencoded')
    }
    if (multipart) {
      const multipartBody = new FormData()
      Object.entries(multipart).forEach(([key, value]) => {
        if (value !== null && value !== undefined) multipartBody.set(key, String(value))
      })
      body = multipartBody
    }

    const response = await fetch(`${this.baseUrl}/${path.replace(/^\//, '')}${queryString}`, {
      method,
      headers,
      body,
    })

    const payload = await response.json().catch(() => null) as HelpyEnvelope<T> | null
    if (!response.ok || !payload?.status) {
      throw new HelpyApiError(payload?.message || `Helpy API request failed (${response.status})`, response.status, payload)
    }
    return payload
  }

  async ensureGuestSession() {
    const existing = readToken()
    if (existing) return existing
    if (this.guestPromise) return this.guestPromise

    this.guestPromise = this.request<Record<string, unknown>>('guest-user', { authenticated: false })
      .then(response => {
        if (!response.token) throw new HelpyApiError('Guest session response did not include a token', 200, response)
        writeToken(response.token, 'guest')
        return response.token
      })
      .finally(() => { this.guestPromise = null })

    return this.guestPromise
  }

  clearSession() {
    if (typeof window !== 'undefined') {
      window.sessionStorage.removeItem(TOKEN_KEY)
      window.sessionStorage.removeItem(SESSION_KIND_KEY)
      window.sessionStorage.removeItem(FIREBASE_CUSTOM_TOKEN_KEY)
      window.sessionStorage.removeItem('helpy_firebase_session')
    }
  }

  async getOtpType() {
    return (await this.request<unknown>('get-otp-type')).data
  }

  async sendLoginOtp(email: string) {
    return (await this.request<unknown>('otp-send', {
      method: 'POST',
      multipart: {
        phone_number: '',
        email,
        user_type: 'user',
        otp_type: 'email',
        type: 'login',
      },
    })).data
  }

  async loginWithOtp(input: {
    email: string
    code: string
    deviceId: string
    deviceType: 'web' | 'android' | 'ios'
    deviceToken?: string
  }) {
    const response = await this.request<Record<string, unknown>>('login', {
      method: 'POST',
      form: {
        phone_number: '',
        email: input.email,
        user_type: 'user',
        otp_type: 'email',
        otp_code: input.code,
        device_id: input.deviceId,
        device_type: input.deviceType,
        device_token: input.deviceToken || '',
      },
    })
    if (!response.token) throw new HelpyApiError('Login response did not include a token', 200, response)
    writeToken(response.token, 'user')
    writeFirebaseCustomToken(response.data.firebaseToken)
    return response.data
  }

  async setLanguage(language = 'en') {
    return (await this.request<unknown[]>('user-language', { method: 'POST', form: { language } })).data
  }

  async getBanners() {
    return (await this.request<HelpyBanner[]>('get-banner-list')).data
  }

  async getCategories(categoryImageSize = '64_64') {
    return (await this.request<HelpyCategory[]>('get-category-list', { query: { categoryImageSize } })).data
  }

  async getFeaturedServices(categoryId = 0) {
    return (await this.request<HelpyService[]>('get-featured-services-List', { query: { category_id: categoryId } })).data
  }

  async getTopProviders() {
    return (await this.request<HelpyProvider[]>('get-top-service-provider-list', {
      query: { userImageSize: '100_100', serviceSetupImageSize: '164_164' },
    })).data
  }

  async getServices(categoryId: number, page = 1, limit = 100) {
    const values = { page, category_id: categoryId, service_id: 0, sort_by: 'recently_added', limit }
    return (await this.request<Paginated<HelpyService>>('featured-services-List', {
      method: 'POST', query: values, form: values,
    })).data
  }

  async getVendorDetails(serviceVendorMapId: number) {
    const values = { service_vendor_mapp_id: serviceVendorMapId, serviceSetupImageSize: '100_100', userImageSize: '100_100' }
    return (await this.request<HelpyService>('vendor-details', { method: 'POST', query: values, form: values })).data
  }

  async getReviews(serviceVendorMapId: number, rating = 0) {
    return (await this.request<unknown[]>('get-reviews-list', {
      method: 'POST',
      form: { service_vendor_mapp_id: serviceVendorMapId, rating, revieImageSize: '100_100', userImageSize: '100_100' },
    })).data
  }

  async getVendorServices(vendorId: number, categoryId: number) {
    const values = { vendor_id: vendorId, category_id: categoryId }
    return (await this.request<HelpyService[]>('vendor-service-offered', {
      method: 'POST', query: values, form: values,
    })).data
  }

  async getVendorAvailability(vendorId: number, date: string) {
    return (await this.request<HelpyAvailabilitySlot[]>('vendor-availability', {
      method: 'POST', form: { vendor_id: vendorId, date },
    })).data
  }

  async getStates() {
    return (await this.request<HelpyRegion[]>('get-state')).data
  }

  async getCities(stateId: number) {
    return (await this.request<HelpyCity[]>('get-city', { method: 'POST', form: { state_id: stateId } })).data
  }

  async getPolicy() {
    return (await this.request<Record<string, string>>('policy')).data
  }

  async getUserProfile() {
    return (await this.request<Record<string, unknown>>('get-user-profile')).data
  }

  async getNotifications() {
    return (await this.request<unknown[]>('get-notification-history-list')).data
  }

  async markNotificationRead(notificationId: string | number) {
    return (await this.request<unknown>('notification-mark-as-read', { method: 'POST', form: { notification_history_id: notificationId } })).data
  }

  async markAllNotificationsRead() {
    return (await this.request<unknown>('notification-mark-all-as-read', { method: 'POST' })).data
  }

  async getUnseenOrderCount() {
    return (await this.request<{ count: number }>('unseen-order-count')).data
  }

  async getBookings(status: 0 | 1 | 2) {
    return (await this.request<unknown[]>('booking-list', {
      query: { status, serviceSetupImageSize: '375_240', userImageSize: '100_100' },
    })).data
  }

  async getBookingDetails(bookingId: string | number) {
    return (await this.request<Record<string, unknown>[]>('get-booking-details', {
      query: { booking_id: bookingId, serviceSetupImageSize: '375_240', userImageSize: '100_100' },
    })).data
  }

  async bookingPreflight(serviceVendorMapId: number, paymentType: 'online' | 'tap' = 'online') {
    return (await this.request<HelpyBookingPreflight>('booking-preflight', {
      method: 'POST',
      form: { service_vendor_mapp_id: serviceVendorMapId, payment_type: paymentType },
    })).data
  }

  async createBooking(input: HelpyBookingInput) {
    return (await this.request<Record<string, unknown>>('add-booking', {
      method: 'POST',
      form: input,
    })).data
  }

  async createTapPayment(input: { bookingId: string | number; firstName?: string; lastName?: string; email?: string; phone?: string }) {
    return (await this.request<HelpyTapCheckout>('tap/create', {
      method: 'POST',
      form: {
        booking_id: input.bookingId,
        firstName: input.firstName,
        lastName: input.lastName,
        email: input.email,
        phone: input.phone,
        use_sdk_payment: 0,
      },
    })).data
  }

  async getWalletHistory() {
    return (await this.request<unknown[]>('wallet-history')).data
  }

  async getAddresses() {
    return (await this.request<unknown[]>('get-addresses')).data
  }

  async getFavorites() {
    return (await this.request<unknown[]>('my-favorites', {
      query: { serviceSetupImageSize: '50_50' },
    })).data
  }

  async updateUserProfile(input: { name: string; email: string; phoneNumber: string; aboutMe?: string }) {
    return (await this.request<Record<string, unknown>>('update-user-profile', {
      method: 'POST',
      multipart: {
        name: input.name,
        name_ar: '',
        email: input.email,
        phone_number: input.phoneNumber,
        about_me: input.aboutMe || '',
      },
    })).data
  }

  async storeAddress(input: HelpyAddressInput) {
    const addressType = input.addressType ?? (/^home$/i.test(input.title.trim()) ? 1 : /^(work|office)$/i.test(input.title.trim()) ? 2 : 3)
    return (await this.request<Record<string, unknown>>('store-address', {
      method: 'POST',
      multipart: {
        address_type: addressType,
        address: input.address,
        address_ar: '',
        country_id: input.countryId ?? 179,
        state_id: input.stateId,
        city_id: input.cityId,
        flat_or_building: input.buildingNumber,
        flat_or_building_ar: '',
        postal_code: input.zone,
        locality_or_street: input.street,
        locality_or_street_ar: '',
        landmark: input.landmark || '',
        landmark_ar: '',
        latitude: input.latitude ?? 25.2854,
        latitute: input.latitude ?? 25.2854,
        longitude: input.longitude ?? 51.5310,
        is_default: 0,
      },
    })).data
  }
}

export const helpyApi = new HelpyApiClient()
