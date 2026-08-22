import type { Coordinate, ScreenPoint } from '../../../shared/lib/map'

export type { Coordinate, ScreenPoint }

export type DragState = {
  pointerId: number
  startX: number
  startY: number
  centerWorld: ScreenPoint
}

export type SheetDragState = {
  pointerId: number
  startY: number
}

export type OsrmRouteResponse = {
  routes?: Array<{
    geometry?: {
      coordinates?: Array<[number, number]>
    }
  }>
}

export type NavigationView = 'request' | 'hospital' | 'setting'

export type AppView =
  | 'map'
  | 'update'
  | 'empty'
  | NavigationView
  | 'setting-alerts'
  | 'setting-hospitals'
  | 'setting-hospital-add'
  | 'setting-hospital-detail'
  | 'setting-profile-edit'
export type Severity = 'none' | 'light' | 'heavy'
export type SeverityField = 'pain' | 'bleeding' | 'amnioticFluidLeak'

export type UpdateFormData = {
  bloodPressureSystolic: string
  bloodPressureDiastolic: string
  pulse: string
  pain: Severity
  oxygenSaturation: string
  bleeding: Severity
  amnioticFluidLeak: Severity
  fetalHeartRate: string
}

export type HospitalStep = {
  label: string
  time: string
  status: 'done' | 'current' | 'upcoming'
}

export type HandoverChecklistItem = {
  label: string
  checked: boolean
}

export type NotificationSettingItem = {
  id: string
  title: string
  description: string
  enabled: boolean
}

export type HospitalAcceptance = 'available' | 'conditional' | 'examine'

export type HospitalManagementItem = {
  id: string
  name: string
  distance: string
  travelTime: string
  obstetricians: string
  nicuBeds: string
  operatingRooms: string
  status: HospitalAcceptance
  branch?: string
  neonatologists?: string
  anesthesiologists?: string
  deliveryRooms?: string
  incubators?: string
  transfusionAvailable?: boolean
}

export type HospitalType =
  | '산부인과 의원'
  | '산부인과 병원'
  | '종합병원'
  | '상급종합병원'
  | '여성병원'
  | '모자의료센터'
  | '기타'

export type HospitalAddForm = {
  name: string
  type: HospitalType | ''
  address: string
  contact: string
  note: string
  obstetricians: string
  neonatologists: string
  anesthesiologists: string
  operatingRooms: string
  deliveryRooms: string
  nicuBeds: string
  incubators: string
  transfusionAvailable: boolean
  emergencySurgeryAvailable: boolean
  availability: 'available' | 'conditional' | 'unavailable'
}
