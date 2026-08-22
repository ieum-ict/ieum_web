import { useState } from 'react'
import { lightTheme } from '@ict/design-tokens'
import { chevronIcon, hospitalIcon } from '../../../shared/config/assets'
import { HospitalComparePage } from './HospitalComparePage'

type HospitalResponseStatus = 'available' | 'examine' | 'unavailable' | 'conditional'

type HospitalResponseItem = {
  id: number
  name: string
  status: HospitalResponseStatus
  distanceKm: number
  travelMinutes: number
  nicuAvailable: number
  nicuTotal: number
  hasOperatingRoom: boolean
  hasTransfusion: boolean
}

type HospitalResponsePageProps = {
  onBack: () => void
}

const responseStatusConfig = {
  available: {
    label: '수용 가능',
    color: lightTheme.status.positive,
    textColor: lightTheme.background.normal.normal,
  },
  examine: {
    label: '전문의 검토',
    color: lightTheme.line.normal,
    textColor: lightTheme.label.alternative,
  },
  unavailable: {
    label: '수용 불가',
    color: lightTheme.status.destructive,
    textColor: lightTheme.background.normal.normal,
  },
  conditional: {
    label: '조건부 수용',
    color: lightTheme.status.cautionary,
    textColor: lightTheme.background.normal.normal,
  },
} satisfies Record<HospitalResponseStatus, { label: string; color: string; textColor: string }>

const hospitalResponses: HospitalResponseItem[] = [
  {
    id: 1,
    name: 'A대학교병원',
    status: 'available',
    distanceKm: 18,
    travelMinutes: 16,
    nicuAvailable: 20,
    nicuTotal: 24,
    hasOperatingRoom: true,
    hasTransfusion: true,
  },
  {
    id: 2,
    name: 'A대학교병원',
    status: 'examine',
    distanceKm: 18,
    travelMinutes: 16,
    nicuAvailable: 20,
    nicuTotal: 24,
    hasOperatingRoom: true,
    hasTransfusion: true,
  },
  {
    id: 3,
    name: 'A대학교병원',
    status: 'unavailable',
    distanceKm: 18,
    travelMinutes: 16,
    nicuAvailable: 20,
    nicuTotal: 24,
    hasOperatingRoom: true,
    hasTransfusion: true,
  },
  {
    id: 4,
    name: 'A대학교병원',
    status: 'conditional',
    distanceKm: 18,
    travelMinutes: 16,
    nicuAvailable: 20,
    nicuTotal: 24,
    hasOperatingRoom: true,
    hasTransfusion: true,
  },
]

function HospitalResponseCard({
  name,
  status,
  distanceKm,
  travelMinutes,
  nicuAvailable,
  nicuTotal,
  hasOperatingRoom,
  hasTransfusion,
}: HospitalResponseItem) {
  const statusInfo = responseStatusConfig[status]
  const resourceTexts = [
    `NICU ${nicuAvailable}/${nicuTotal}`,
    hasOperatingRoom ? '수술실 여유' : '수술실 확인중',
    hasTransfusion ? '수혈 가능' : '수혈 확인중',
  ]

  return (
    <button
      type="button"
      style={{
        width: '100%',
        minHeight: '116px',
        padding: '18px',
        border: 0,
        borderRadius: '10px',
        display: 'flex',
        alignItems: 'center',
        textAlign: 'left',
        background: lightTheme.background.elevated.normal,
        boxShadow: '0 2px 4px rgb(0 0 0 / 6%)',
        cursor: 'pointer',
      }}
    >
      <div
        style={{
          minWidth: 0,
          flex: '1 1 auto',
          display: 'grid',
          gap: '7px',
        }}
      >
        <div
          style={{
            minWidth: 0,
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
          }}
        >
          <span
            style={{
              minWidth: 0,
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
            }}
          >
            <img
              src={hospitalIcon}
              alt=""
              draggable="false"
              style={{
                width: '24px',
                height: '24px',
                flex: '0 0 auto',
              }}
            />
            <strong
              style={{
                minWidth: 0,
                overflow: 'hidden',
                color: lightTheme.label.normal,
                fontSize: '18px',
                fontWeight: 600,
                lineHeight: 1.3,
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
              }}
            >
              {name}
            </strong>
          </span>

          <span
            style={{
              flex: '0 0 auto',
              padding: '2px 9px',
              borderRadius: '100px',
              color: statusInfo.textColor,
              fontSize: '14px',
              fontWeight: 500,
              lineHeight: 1.3,
              background: statusInfo.color,
            }}
          >
            {statusInfo.label}
          </span>
        </div>

        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
            color: lightTheme.label.neutral,
            fontSize: '16px',
            fontWeight: 500,
            lineHeight: 1.3,
          }}
        >
          <span>{distanceKm}km</span>
          <span>·</span>
          <span>차량 {travelMinutes}분</span>
        </div>

        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            overflow: 'hidden',
            color: lightTheme.label.alternative,
            fontSize: '14px',
            fontWeight: 400,
            lineHeight: 1.3,
            whiteSpace: 'nowrap',
          }}
        >
          {resourceTexts.map((text, index) => (
            <span key={text} style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
              {index > 0 ? (
                <span aria-hidden="true" style={{ fontSize: '16px', fontWeight: 500 }}>
                  ·
                </span>
              ) : null}
              <span>{text}</span>
            </span>
          ))}
        </div>
      </div>

      <img
        src={chevronIcon}
        alt=""
        draggable="false"
        style={{
          width: '24px',
          height: '24px',
          flex: '0 0 auto',
          marginLeft: '12px',
        }}
      />
    </button>
  )
}

export function HospitalResponsePage({ onBack }: HospitalResponsePageProps) {
  const [isCompareOpen, setIsCompareOpen] = useState(false)

  if (isCompareOpen) {
    return <HospitalComparePage onBack={() => setIsCompareOpen(false)} />
  }

  return (
    <main className="transport-page">
      <header className="update-header" style={{ background: lightTheme.fill.alternative }}>
        <button className="update-header__back" type="button" aria-label="수용 요청으로 돌아가기" onClick={onBack}>
          <img src={chevronIcon} alt="" draggable="false" />
        </button>
        <h1>병원 응답</h1>
      </header>

      <section
        aria-label="병원 응답"
        style={{
          position: 'relative',
          minHeight: 0,
          flex: '1 1 auto',
          overflow: 'hidden',
          background: lightTheme.fill.alternative,
        }}
      >
        <div
          style={{
            height: '100%',
            overflowY: 'auto',
            padding: '28px 20px 70px',
          }}
        >
          <section aria-labelledby="hospital-response-title" style={{ display: 'grid', gap: '24px' }}>
            <h2
              id="hospital-response-title"
              style={{
                margin: '0 10px',
                color: lightTheme.label.neutral,
                fontSize: '18px',
                fontWeight: 600,
                lineHeight: 1.3,
              }}
            >
              병원 응답 목록
              <span
                style={{
                  marginLeft: '1px',
                  color: lightTheme.label.alternative,
                  fontSize: '16px',
                  fontWeight: 500,
                  lineHeight: 1.3,
                }}
              >
                ({hospitalResponses.length}곳)
              </span>
            </h2>

            <div style={{ display: 'grid', gap: '12px' }}>
              {hospitalResponses.map((hospital) => (
                <HospitalResponseCard key={hospital.id} {...hospital} />
              ))}
            </div>
          </section>
        </div>

        <button
          type="button"
          onClick={() => setIsCompareOpen(true)}
          style={{
            position: 'absolute',
            left: '20px',
            right: '20px',
            bottom: '12px',
            height: '42px',
            border: 0,
            borderRadius: '10px',
            color: lightTheme.background.elevated.normal,
            fontSize: '18px',
            fontWeight: 500,
            lineHeight: 1.3,
            background: lightTheme.primary.normal,
            boxShadow: '0 -2px 7px rgb(0 0 0 / 5%)',
            cursor: 'pointer',
          }}
        >
          응답 병원 비교하기
        </button>
      </section>
    </main>
  )
}
