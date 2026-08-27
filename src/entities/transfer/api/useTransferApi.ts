import { apiFetch } from '../../../shared/api/httpClient'
import type { CreateTransferPayload, Transfer, TransferStatus, TransferUpdateLog } from '../model/types'

export function fetchTransfers(): Promise<Transfer[]> {
  return apiFetch<Transfer[]>('/transfers')
}

export function fetchTransfer(transferId: number): Promise<Transfer> {
  return apiFetch<Transfer>(`/transfers/${transferId}`)
}

export function fetchTransferStatus(transferId: number): Promise<TransferStatus> {
  return apiFetch<TransferStatus>(`/transfers/${transferId}/status`)
}

export function createTransfer(payload: CreateTransferPayload): Promise<Transfer> {
  return apiFetch<Transfer>('/transfers', { method: 'POST', body: JSON.stringify(payload) })
}

export function startTransfer(transferId: number): Promise<Transfer> {
  return apiFetch<Transfer>(`/transfers/${transferId}/start`, { method: 'POST' })
}

export function updateTransferStatus(transferId: number, status: TransferStatus): Promise<Transfer> {
  return apiFetch<Transfer>(`/transfers/${transferId}/status`, {
    method: 'PATCH',
    body: JSON.stringify({ status }),
  })
}

export function postTransferUpdate(transferId: number, content: string): Promise<TransferUpdateLog> {
  return apiFetch<TransferUpdateLog>(`/transfers/${transferId}/updates`, {
    method: 'POST',
    body: JSON.stringify({ content }),
  })
}
