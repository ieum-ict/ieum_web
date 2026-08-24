import type { TransferStatus } from '../model/types'

export type PullReqStatusLabel = '진행중' | '대기중' | '완료' | '취소'

const hasTimezoneDesignator = /Z$|[+-]\d{2}:?\d{2}$/

/**
 * 서버가 내려주는 createdAt 등은 타임존 표기가 없는 UTC 문자열이라, 그대로 new Date()에
 * 넘기면 로컬 시간으로 잘못 해석된다(예: KST에서 9시간 오차). 타임존이 없으면 UTC로 간주한다.
 */
export function parseServerDateTime(value: string): Date {
  return new Date(hasTimezoneDesignator.test(value) ? value : `${value}Z`)
}

export function toPullReqStatusLabel(status: TransferStatus): PullReqStatusLabel {
  switch (status) {
    case 'IN_PROGRESS':
      return '진행중'
    case 'REQUESTED':
      return '대기중'
    case 'ARRIVED':
    case 'HANDED_OVER':
      return '완료'
    case 'CANCELLED':
      return '취소'
  }
}

export function formatElapsedMinutes(createdAt: string): number {
  const createdAtMs = parseServerDateTime(createdAt).getTime()

  if (Number.isNaN(createdAtMs)) {
    return 0
  }

  return Math.max(0, Math.round((Date.now() - createdAtMs) / 60000))
}
