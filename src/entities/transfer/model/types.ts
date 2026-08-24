export type TransferStatus = 'REQUESTED' | 'IN_PROGRESS' | 'ARRIVED' | 'HANDED_OVER' | 'CANCELLED'

export type Transfer = {
  id: number
  patientName: string
  patientAge: number
  symptom: string
  departureAddress: string
  status: TransferStatus
  createdAt: string
}

export type CreateTransferPayload = {
  patientName: string
  patientAge: number
  symptom: string
  departureAddress: string
}

export type TransferUpdateLog = {
  id: number
  type: string
  content: string
  createdAt: string
}
