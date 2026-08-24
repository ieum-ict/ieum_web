export type HospitalSearchPayload = {
  keyword: string
}

export type HospitalSearchResult = {
  id: number
  name: string
  address: string
  phone: string
  resourcesContent: string
  resourcesUpdatedAt: string
}
