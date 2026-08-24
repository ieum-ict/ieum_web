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

async function rawRequest<T>(path: string, init: RequestInit, useAuth: boolean): Promise<T> {
  const headers = new Headers(init.headers)
  headers.set('Content-Type', 'application/json')

  if (useAuth && accessToken) {
    headers.set('Authorization', `Bearer ${accessToken}`)
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
    { method: 'POST', body: JSON.stringify({ email: devLoginEmail, password: devLoginPassword }) },
    false,
  )

  storeTokens(tokens)
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

function ensureSession(): Promise<void> {
  if (accessToken) {
    return Promise.resolve()
  }

  if (!sessionPromise) {
    sessionPromise = loginWithDevAccount().catch((error: unknown) => {
      sessionPromise = null
      throw error
    })
  }

  return sessionPromise
}

export async function apiFetch<T>(path: string, init: RequestInit = {}): Promise<T> {
  await ensureSession()

  try {
    return await rawRequest<T>(path, init, true)
  } catch (error) {
    if (!(error instanceof ApiError) || error.status !== 401) {
      throw error
    }

    try {
      await refreshSession()
    } catch {
      clearTokens()
      sessionPromise = null
      await ensureSession()
    }

    return rawRequest<T>(path, init, true)
  }
}
