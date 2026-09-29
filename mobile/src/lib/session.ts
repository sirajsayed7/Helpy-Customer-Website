import * as SecureStore from 'expo-secure-store'

const ACCESS_TOKEN_KEY = 'helpy_access_token'
const SESSION_KIND_KEY = 'helpy_session_kind'
const DEVICE_ID_KEY = 'helpy_device_id'

export type SessionKind = 'guest' | 'user'

export async function readAccessToken() {
  return SecureStore.getItemAsync(ACCESS_TOKEN_KEY)
}

export async function hasUserSession() {
  const [token, kind] = await Promise.all([
    readAccessToken(),
    SecureStore.getItemAsync(SESSION_KIND_KEY),
  ])
  return Boolean(token && kind === 'user')
}

export async function writeSession(token: string, kind: SessionKind) {
  await Promise.all([
    SecureStore.setItemAsync(ACCESS_TOKEN_KEY, token),
    SecureStore.setItemAsync(SESSION_KIND_KEY, kind),
  ])
}

export async function getOrCreateDeviceId() {
  const existing = await SecureStore.getItemAsync(DEVICE_ID_KEY)
  if (existing) return existing

  const id = `native-${Date.now()}-${Math.random().toString(36).slice(2)}`
  await SecureStore.setItemAsync(DEVICE_ID_KEY, id)
  return id
}

export async function clearSession() {
  await Promise.all([
    SecureStore.deleteItemAsync(ACCESS_TOKEN_KEY),
    SecureStore.deleteItemAsync(SESSION_KIND_KEY),
  ])
}
