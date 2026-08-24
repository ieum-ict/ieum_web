import { apiFetch } from '../../../shared/api/httpClient'
import type { CreateTransferPayload, Transfer, TransferStatus, TransferUpdateLog } from '../model/types'

export function fetchTransfers(): Promise<Transfer[]> {
  return apiFetch<Transfer[]>('/transfer')
}

export function fetchTransfer(transferId: number): Promise<Transfer> {
  return apiFetch<Transfer>(`/transfer/${transferId}`)
}

export function createTransfer(payload: CreateTransferPayload): Promise<Transfer> {
  return apiFetch<Transfer>('/transfer', { method: 'POST', body: JSON.stringify(payload) })
}

export function startTransfer(transferId: number): Promise<Transfer> {
  return apiFetch<Transfer>(`/transfer/${transferId}/start`, { method: 'POST' })
}

export function updateTransferStatus(transferId: number, status: TransferStatus): Promise<Transfer> {
  return apiFetch<Transfer>(`/transfer/${transferId}/status`, {
    method: 'PATCH',
    body: JSON.stringify({ status }),
  })
}

export function postTransferUpdate(transferId: number, content: string): Promise<TransferUpdateLog> {
  return apiFetch<TransferUpdateLog>(`/transfer/${transferId}/updates`, {
    method: 'POST',
    body: JSON.stringify({ content }),
  })
}
