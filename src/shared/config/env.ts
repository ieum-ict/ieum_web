// 개발 서버에서는 CORS를 피하기 위해 vite.config.ts의 프록시(same-origin 상대경로)를 사용한다.
export const apiBaseUrl = import.meta.env.DEV ? '' : import.meta.env.VITE_API_BASE_URL

export const devLoginEmail = import.meta.env.VITE_DEV_LOGIN_EMAIL
export const devLoginPassword = import.meta.env.VITE_DEV_LOGIN_PASSWORD
