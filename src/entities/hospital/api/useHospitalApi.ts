import { apiFetch } from '../../../shared/api/httpClient'
import type { HospitalSearchPayload, HospitalSearchResult } from '../model/types'

export function searchHospitals(payload: HospitalSearchPayload): Promise<HospitalSearchResult[]> {
  return apiFetch<HospitalSearchResult[]>('/hospitals/search', {
    method: 'POST',
    body: JSON.stringify(payload),
  })
}
