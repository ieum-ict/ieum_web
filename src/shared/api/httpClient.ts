import { apiBaseUrl, devLoginEmail, devLoginPassword } from '../config/env'

type ApiEnvelope<T> = {
  success: boolean
  data: T
  message?: string
}

type AuthTokens = {
  accessToken: string
  refreshToken: string
}

export type LoginRole = 'admin' | 'user'

export class ApiError extends Error {
  status: number

  constructor(message: string, status: number) {
    super(message)
    this.name = 'ApiError'
    this.status = status
  }
}

const ACCESS_TOKEN_STORAGE_KEY = 'ieum.accessToken'
const REFRESH_TOKEN_STORAGE_KEY = 'ieum.refreshToken'

let accessToken: string | null = localStorage.getItem(ACCESS_TOKEN_STORAGE_KEY)
let refreshToken: string | null = localStorage.getItem(REFRESH_TOKEN_STORAGE_KEY)
let sessionPromise: Promise<void> | null = null

function syncStoredTokens() {
  accessToken = localStorage.getItem(ACCESS_TOKEN_STORAGE_KEY)
  refreshToken = localStorage.getItem(REFRESH_TOKEN_STORAGE_KEY)
}

function storeTokens(tokens: AuthTokens) {
  accessToken = tokens.accessToken
  refreshToken = tokens.refreshToken
  localStorage.setItem(ACCESS_TOKEN_STORAGE_KEY, tokens.accessToken)
  localStorage.setItem(REFRESH_TOKEN_STORAGE_KEY, tokens.refreshToken)
}

function clearTokens() {
  accessToken = null
  refreshToken = null
  localStorage.removeItem(ACCESS_TOKEN_STORAGE_KEY)
  localStorage.removeItem(REFRESH_TOKEN_STORAGE_KEY)
}

export function getStoredRefreshToken() {
  return refreshToken
}

export function clearStoredAuthTokens() {
  clearTokens()
  sessionPromise = null
}

async function rawRequest<T>(path: string, init: RequestInit, useAuth: boolean): Promise<T> {
  const headers = new Headers(init.headers)
  headers.set('Content-Type', 'application/json')

  if (useAuth) {
    syncStoredTokens()

    if (accessToken) {
      headers.set('Authorization', `Bearer ${accessToken}`)
    }
  }

  const response = await fetch(`${apiBaseUrl}${path}`, { ...init, headers })
  const envelope = (await response.json().catch(() => null)) as ApiEnvelope<T> | null

  if (!response.ok || !envelope?.success) {
    throw new ApiError(envelope?.message ?? `요청에 실패했습니다. (${response.status})`, response.status)
  }

  return envelope.data
}

async function loginWithDevAccount(): Promise<void> {
  if (!devLoginEmail || !devLoginPassword) {
    throw new ApiError('개발용 로그인 계정이 설정되지 않았습니다. .env.local을 확인해주세요.', 401)
  }

  const tokens = await rawRequest<AuthTokens>(
    '/auth/login',
    { method: 'POST', body: JSON.stringify({ loginId: devLoginEmail, password: devLoginPassword }) },
    false,
  )

  storeTokens(tokens)
}

function getLoginPath(loginId: string) {
  return loginId.trim().toLowerCase() === 'admin@ieum.com' ? '/auth/admin/login' : '/auth/login'
}

export async function loginWithCredentials(loginId: string, password: string): Promise<LoginRole> {
  const normalizedLoginId = loginId.trim()
  const loginPath = getLoginPath(normalizedLoginId)
  const tokens = await rawRequest<AuthTokens>(
    loginPath,
    { method: 'POST', body: JSON.stringify({ loginId: normalizedLoginId, password }) },
    false,
  )

  storeTokens(tokens)

  return loginPath === '/auth/admin/login' ? 'admin' : 'user'
}

export async function signupWithCredentials({
  email,
  loginId,
  password,
  name,
}: {
  email: string
  loginId: string
  password: string
  name: string
}): Promise<void> {
  await rawRequest<void>(
    '/auth/signup',
    {
      method: 'POST',
      body: JSON.stringify({ email: email.trim(), loginId: loginId.trim(), password, name: name.trim() }),
    },
    false,
  )
}

async function refreshSession(): Promise<void> {
  if (!refreshToken) {
    throw new ApiError('세션이 만료되었습니다. 다시 로그인해주세요.', 401)
  }

  const tokens = await rawRequest<AuthTokens>(
    '/auth/refresh',
    { method: 'POST', body: JSON.stringify({ refreshToken }) },
    false,
  )

  storeTokens(tokens)
}

function hasDevAccount() {
  return Boolean(devLoginEmail && devLoginPassword)
}

function ensureSession(): Promise<boolean> {
  syncStoredTokens()

  if (accessToken) {
    return Promise.resolve(true)
  }

  if (!hasDevAccount()) {
    return Promise.resolve(false)
  }

  if (!sessionPromise) {
    sessionPromise = loginWithDevAccount().catch((error: unknown) => {
      sessionPromise = null
      throw error
    })
  }

  return sessionPromise.then(() => true)
}

export async function apiFetch<T>(path: string, init: RequestInit = {}): Promise<T> {
  const hasSession = await ensureSession()

  try {
    return await rawRequest<T>(path, init, hasSession)
  } catch (error) {
    if (!(error instanceof ApiError) || error.status !== 401) {
      throw error
    }

    try {
      await refreshSession()
    } catch {
      clearTokens()
      sessionPromise = null
      const hasNewSession = await ensureSession()
      return rawRequest<T>(path, init, hasNewSession)
    }

    return rawRequest<T>(path, init, true)
  }
}
