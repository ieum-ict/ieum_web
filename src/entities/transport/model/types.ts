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

export type AppView = 'map' | 'update' | 'empty' | 'request' | 'hospital' | 'setting'
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
