import { useCallback, useEffect, useState } from 'react'
import { fetchTransfers } from '../../../entities/transfer/api/useTransferApi'
import type { Transfer } from '../../../entities/transfer/model/types'
import { formatElapsedMinutes, parseServerDateTime, toPullReqStatusLabel } from '../../../entities/transfer/lib/status'
import type { PullReqStatus } from '../ui/PullReqCard'

export type PullReqListItem = {
  id: number
  title: string
  status: PullReqStatus
  description: string
  location: string
  requestedMinutesAgo: number
  requestedAt: string
}

const pregnancyPattern = /임신\s*(\d+)\s*주(?:\s*(\d+)\s*일)?/
const hiddenSymptomPrefixes = ['임신', '혈압', '맥박', '산소포화도', '태아 심박수']

function formatPregnancySummary(symptom: string): string {
  const pregnancyMatch = symptom.match(pregnancyPattern)

  if (!pregnancyMatch) {
    return '임신 주수 미입력'
  }

  const [, weeks, days] = pregnancyMatch

  if (!days || Number(days) === 0) {
    return `${weeks}주`
  }

  return `${weeks}주 ${days}일`
}

function formatSymptomSummary(symptom: string): string {
  const symptoms = symptom
    .split(',')
    .map((part) => part.trim())
    .filter((part) => part && !hiddenSymptomPrefixes.some((prefix) => part.startsWith(prefix)))
    .map((part) => {
      if (part.startsWith('출혈')) return '출혈'
      if (part.startsWith('진통')) return '진통'
      if (part.startsWith('양수 파수')) return '양수 파수'
      return part
    })

  const uniqueSymptoms = [...new Set(symptoms)]

  return uniqueSymptoms.length > 0 ? uniqueSymptoms.join(', ') : '특이 증상 없음'
}

function formatTransferSummary(symptom: string): string {
  return `${formatPregnancySummary(symptom)} · ${formatSymptomSummary(symptom)}`
}

export function toPullReqListItem(transfer: Transfer): PullReqListItem {
  return {
    id: transfer.id,
    title: transfer.patientName,
    status: toPullReqStatusLabel(transfer.status),
    description: formatTransferSummary(transfer.symptom),
    location: transfer.departureAddress,
    requestedMinutesAgo: formatElapsedMinutes(transfer.createdAt),
    requestedAt: new Intl.DateTimeFormat('ko-KR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    }).format(parseServerDateTime(transfer.createdAt)),
  }
}

async function loadPullRequestItems(): Promise<PullReqListItem[]> {
  const transfers = await fetchTransfers()
  const sorted = [...transfers].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
  )
  return sorted.map(toPullReqListItem)
}

export function usePullRequests() {
  const [items, setItems] = useState<PullReqListItem[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const refetch = useCallback(async () => {
    setIsLoading(true)
    setError(null)

    try {
      setItems(await loadPullRequestItems())
    } catch {
      setError('전원 요청 목록을 불러오지 못했습니다.')
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    let isCancelled = false

    loadPullRequestItems()
      .then((nextItems) => {
        if (!isCancelled) {
          setItems(nextItems)
        }
      })
      .catch(() => {
        if (!isCancelled) {
          setError('전원 요청 목록을 불러오지 못했습니다.')
        }
      })
      .finally(() => {
        if (!isCancelled) {
          setIsLoading(false)
        }
      })

    return () => {
      isCancelled = true
    }
  }, [])

  return { items, isLoading, error, refetch }
}
