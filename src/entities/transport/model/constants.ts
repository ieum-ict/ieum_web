import type {
  AppView,
  Coordinate,
  HandoverChecklistItem,
  HospitalAddForm,
  HospitalManagementItem,
  HospitalStep,
  NotificationSettingItem,
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

export const notificationSettings: NotificationSettingItem[] = [
  { id: 'transfer-request', title: '전원 요청 알림', description: '새로운 전원 요청 도착 시', enabled: true },
  { id: 'hospital-response', title: '병원 응답 도착', description: '병원의 응답이 도착했을 때', enabled: true },
  { id: 'hospital-change', title: '수용 가능 병원 변경', description: '수용 가능 병원 목록 변경 시', enabled: true },
  { id: 'transfer-status', title: '이송 상태 변경', description: '이송 상태가 변경될 때', enabled: true },
  { id: 'patient-update', title: '환자 상태 업데이트', description: '환자 상태 정보가 업데이트될 때', enabled: true },
  { id: 'system-notice', title: '시스템 공지', description: '시스템 점검 및 공지사항', enabled: false },
]

export const hospitalManagementItems: HospitalManagementItem[] = [
  {
    id: 'hospital-a',
    name: 'A대학교병원',
    distance: '18km',
    travelTime: '차량 16분',
    obstetricians: '산부인과 전문의 12명',
    nicuBeds: 'NICU병상 18개',
    operatingRooms: '수술실 5개',
    status: 'available',
    branch: '본원',
    neonatologists: '7명',
    anesthesiologists: '6명',
    deliveryRooms: '6개',
    incubators: '6개',
    transfusionAvailable: true,
  },
  {
    id: 'hospital-b',
    name: 'A대학교병원',
    distance: '18km',
    travelTime: '차량 16분',
    obstetricians: '산부인과 전문의 12명',
    nicuBeds: 'NICU병상 18개',
    operatingRooms: '수술실 5개',
    status: 'available',
    branch: '분원',
    neonatologists: '7명',
    anesthesiologists: '6명',
    deliveryRooms: '6개',
    incubators: '6개',
    transfusionAvailable: true,
  },
  {
    id: 'hospital-c',
    name: 'A대학교병원',
    distance: '18km',
    travelTime: '차량 16분',
    obstetricians: '산부인과 전문의 12명',
    nicuBeds: 'NICU병상 18개',
    operatingRooms: '수술실 5개',
    status: 'examine',
    branch: '본원',
    neonatologists: '7명',
    anesthesiologists: '6명',
    deliveryRooms: '6개',
    incubators: '6개',
    transfusionAvailable: false,
  },
  {
    id: 'hospital-d',
    name: 'A대학교병원',
    distance: '18km',
    travelTime: '차량 16분',
    obstetricians: '산부인과 전문의 12명',
    nicuBeds: 'NICU병상 18개',
    operatingRooms: '수술실 5개',
    status: 'conditional',
    branch: '본원',
    neonatologists: '7명',
    anesthesiologists: '6명',
    deliveryRooms: '6개',
    incubators: '6개',
    transfusionAvailable: true,
  },
]

export const hospitalTypeOptions = [
  '산부인과 의원',
  '산부인과 병원',
  '종합병원',
  '상급종합병원',
  '여성병원',
  '모자의료센터',
  '기타',
] as const

export const defaultHospitalAddForm: HospitalAddForm = {
  name: '',
  type: '',
  address: '',
  contact: '',
  note: '',
  obstetricians: '0',
  neonatologists: '0',
  anesthesiologists: '0',
  operatingRooms: '0',
  deliveryRooms: '0',
  nicuBeds: '0',
  incubators: '0',
  transfusionAvailable: true,
  emergencySurgeryAvailable: true,
  availability: 'available',
}

export function getViewFromHash(hash: string): AppView {
  if (hash === '#update') {
    return 'update'
  }

  if (hash === '#request') {
    return 'request'
  }

  if (hash === '#hospital') {
    return 'hospital'
  }

  if (hash === '#setting') {
    return 'setting'
  }

  if (hash === '#setting-alerts') {
    return 'setting-alerts'
  }

  if (hash === '#setting-hospitals') {
    return 'setting-hospitals'
  }

  if (hash === '#setting-hospital-add') {
    return 'setting-hospital-add'
  }

  if (hash === '#setting-hospital-detail') {
    return 'setting-hospital-detail'
  }

  if (hash === '#setting-profile-edit') {
    return 'setting-profile-edit'
  }

  return 'map'
}

export function createOsrmRouteUrl(start: Coordinate, destination: Coordinate) {
  const coordinates = `${start.lng},${start.lat};${destination.lng},${destination.lat}`

  return `https://router.project-osrm.org/route/v1/driving/${coordinates}?overview=full&geometries=geojson&steps=false`
}
