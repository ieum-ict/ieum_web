import { apiFetch, clearStoredAuthTokens, getStoredRefreshToken } from '../../../shared/api/httpClient'
import type { HospitalAcceptance, HospitalManagementItem } from '../../transport/model/types'

export type UserProfileResponse = {
  id: number
  email: string
  name: string
}

type HospitalResponse = {
  id: number
  name: string
  address?: string
  phone?: string
  resourcesContent?: string
  resourcesUpdatedAt?: string
}

const resourceDefaults: Pick<
  HospitalManagementItem,
  | 'obstetricians'
  | 'nicuBeds'
  | 'operatingRooms'
  | 'neonatologists'
  | 'anesthesiologists'
  | 'deliveryRooms'
  | 'incubators'
  | 'transfusionAvailable'
  | 'status'
> = {
  obstetricians: '산부인과 전문의 0명',
  nicuBeds: 'NICU병상 0개',
  operatingRooms: '수술실 0개',
  neonatologists: '0명',
  anesthesiologists: '0명',
  deliveryRooms: '0개',
  incubators: '0개',
  transfusionAvailable: true,
  status: 'examine' satisfies HospitalAcceptance,
}

function pickNumber(content: string | undefined, patterns: RegExp[], fallback = '0') {
  if (!content) {
    return fallback
  }

  for (const pattern of patterns) {
    const matchedValue = content.match(pattern)?.[1]
    if (matchedValue) {
      return matchedValue
    }
  }

  return fallback
}

function inferStatus(content: string | undefined): HospitalAcceptance {
  if (!content) {
    return resourceDefaults.status
  }

  if (content.includes('조건부')) {
    return 'conditional'
  }

  if (content.includes('수용 가능') || content.includes('가능')) {
    return 'available'
  }

  return 'examine'
}

function parseResourceContent(content: string | undefined) {
  const obstetricians = pickNumber(content, [/산부인과[^0-9]*(\d+)/, /obstetricians[^0-9]*(\d+)/i])
  const neonatologists = pickNumber(content, [/신생아[^0-9]*(\d+)/, /neonatologists[^0-9]*(\d+)/i])
  const anesthesiologists = pickNumber(content, [/마취[^0-9]*(\d+)/, /anesthesiologists[^0-9]*(\d+)/i])
  const operatingRooms = pickNumber(content, [/수술실[^0-9]*(\d+)/, /operatingRooms[^0-9]*(\d+)/i])
  const deliveryRooms = pickNumber(content, [/분만실[^0-9]*(\d+)/, /deliveryRooms[^0-9]*(\d+)/i])
  const nicuBeds = pickNumber(content, [/NICU[^0-9]*(\d+)/i, /nicuBeds[^0-9]*(\d+)/i])
  const incubators = pickNumber(content, [/인큐베이터[^0-9]*(\d+)/, /incubators[^0-9]*(\d+)/i])
  const transfusionAvailable = content ? !/수혈[^가]*(불가|불가능|false)/i.test(content) : resourceDefaults.transfusionAvailable

  return {
    obstetricians: `산부인과 전문의 ${obstetricians}명`,
    neonatologists: `${neonatologists}명`,
    anesthesiologists: `${anesthesiologists}명`,
    operatingRooms: `수술실 ${operatingRooms}개`,
    deliveryRooms: `${deliveryRooms}개`,
    nicuBeds: `NICU병상 ${nicuBeds}개`,
    incubators: `${incubators}개`,
    transfusionAvailable,
    status: inferStatus(content),
  }
}

function toHospitalManagementItem(hospital: HospitalResponse): HospitalManagementItem {
  const parsedResources = parseResourceContent(hospital.resourcesContent)

  return {
    id: String(hospital.id),
    name: hospital.name,
    distance: hospital.address || '거리 정보 없음',
    travelTime: hospital.phone || '연락처 없음',
    ...resourceDefaults,
    ...parsedResources,
    branch: hospital.resourcesUpdatedAt ? new Date(hospital.resourcesUpdatedAt).toLocaleDateString('ko-KR') : undefined,
  }
}

function serializeResourceContent(item: HospitalManagementItem) {
  return [
    item.obstetricians,
    `신생아 전문의 ${item.neonatologists ?? resourceDefaults.neonatologists}`,
    `마취과 전문의 ${item.anesthesiologists ?? resourceDefaults.anesthesiologists}`,
    item.operatingRooms,
    `분만실 ${item.deliveryRooms ?? resourceDefaults.deliveryRooms}`,
    item.nicuBeds,
    `인큐베이터 ${item.incubators ?? resourceDefaults.incubators}`,
    `수혈 ${item.transfusionAvailable === false ? '불가능' : '가능'}`,
    `수용 상태 ${
      {
        available: '수용 가능',
        conditional: '조건부 수용',
        examine: '전문의 검토',
      }[item.status]
    }`,
  ].join('\n')
}

export function fetchMyProfile() {
  return apiFetch<UserProfileResponse>('/users/me')
}

export async function fetchManagedHospitals() {
  const hospitals = await apiFetch<HospitalResponse[]>('/hospitals')
  return hospitals.map(toHospitalManagementItem)
}

export async function updateHospitalResources(item: HospitalManagementItem) {
  const hospitalId = Number(item.id)
  if (!Number.isFinite(hospitalId)) {
    return item
  }

  const hospital = await apiFetch<HospitalResponse>(`/hospitals/${hospitalId}/resources`, {
    method: 'PATCH',
    body: JSON.stringify({ content: serializeResourceContent(item) }),
  })

  return toHospitalManagementItem(hospital)
}

export async function logout() {
  const refreshToken = getStoredRefreshToken()

  try {
    if (refreshToken) {
      await apiFetch<void>('/auth/logout', {
        method: 'POST',
        body: JSON.stringify({ refreshToken }),
      })
    }
  } finally {
    clearStoredAuthTokens()
  }
}
