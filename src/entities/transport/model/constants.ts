import type {
  Coordinate,
  HandoverChecklistItem,
  HospitalStep,
  Severity,
  UpdateFormData,
} from './types'

export const MIN_ZOOM = 15
export const MAX_ZOOM = 19

export const initialCenter: Coordinate = {
  lat: 35.66202,
  lng: 128.41348,
}

export const transferStart: Coordinate = { lat: 35.66062, lng: 128.41304 }
export const transferDestination: Coordinate = { lat: 35.66154, lng: 128.4142 }

export const fallbackRouteCoordinates: Coordinate[] = [
  { lat: 35.66062, lng: 128.41304 },
  { lat: 35.66142, lng: 128.41279 },
  { lat: 35.66236, lng: 128.41234 },
  { lat: 35.66277, lng: 128.41268 },
  { lat: 35.6628, lng: 128.41402 },
  { lat: 35.66224, lng: 128.41428 },
  { lat: 35.66154, lng: 128.4142 },
]

export const ambulanceLocation = transferStart

export const severityLabels: Record<Severity, string> = {
  none: '없음',
  light: '조금',
  heavy: '많이',
}

export const defaultUpdateForm: UpdateFormData = {
  bloodPressureSystolic: '150',
  bloodPressureDiastolic: '90',
  pulse: '110',
  pain: 'none',
  oxygenSaturation: '95',
  bleeding: 'none',
  amnioticFluidLeak: 'none',
  fetalHeartRate: '120',
}

export const hospitalSteps: HospitalStep[] = [
  { label: '요청 접수', time: '09:20', status: 'done' },
  { label: '분석 발표', time: '09:22', status: 'done' },
  { label: '병원 검색 완료', time: '09:23', status: 'done' },
  { label: '수용 요청 전송', time: '09:24', status: 'done' },
  { label: '병원 응답 대기', time: '-', status: 'current' },
  { label: '병원 확정', time: '-', status: 'upcoming' },
  { label: '이송 시작', time: '-', status: 'upcoming' },
  { label: '인계 완료', time: '-', status: 'upcoming' },
]

export const completedChecklist: HandoverChecklistItem[] = [
  { label: '환자 정보 확인', checked: true },
  { label: '활력징후 및 상태 공유', checked: true },
  { label: '치료 및 처치 내용 전달', checked: false },
  { label: '환자 기록지 전달', checked: false },
  { label: '의료 장비 인계', checked: true },
]

export function createOsrmRouteUrl(start: Coordinate, destination: Coordinate) {
  const coordinates = `${start.lng},${start.lat};${destination.lng},${destination.lat}`

  return `https://router.project-osrm.org/route/v1/driving/${coordinates}?overview=full&geometries=geojson&steps=false`
}
