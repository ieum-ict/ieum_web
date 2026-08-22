import { lightTheme } from '@ict/design-tokens'
import { chevronIcon, hospitalIcon } from '../../../shared/config/assets'

export type HospitalRecommendationStatus = 'available' | 'conditional' | 'unavailable'

export type HospitalRecommendCardProps = {
  name: string
  status: HospitalRecommendationStatus
  distanceKm: number
  travelMinutes: number
  nicuAvailable: number
  nicuTotal: number
  hasOperatingRoom: boolean
  hasTransfusion: boolean
  onClick?: () => void
}

const statusConfig = {
  available: {
    label: '수용 가능',
    color: lightTheme.status.positive,
  },
  conditional: {
    label: '조건부 수용',
    color: lightTheme.status.cautionary,
  },
  unavailable: {
    label: '수용 불가',
    color: lightTheme.status.destructive,
  },
} satisfies Record<HospitalRecommendationStatus, { label: string; color: string }>

export function HospitalRecommendCard({
  name,
  status,
  distanceKm,
  travelMinutes,
  nicuAvailable,
  nicuTotal,
  hasOperatingRoom,
  hasTransfusion,
  onClick,
}: HospitalRecommendCardProps) {
  const statusInfo = statusConfig[status]
  const resourceTexts = [
    `NICU ${nicuAvailable}/${nicuTotal}`,
    hasOperatingRoom ? '수술실 여유' : '수술실 확인중',
    hasTransfusion ? '수혈 가능' : '수혈 확인중',
  ]

  return (
    <button
      type="button"
      onClick={onClick}
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
        cursor: onClick ? 'pointer' : 'default',
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
                fontSize: '16px',
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
              color: lightTheme.background.normal.normal,
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
            <span
              key={text}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
              }}
            >
              {index > 0 ? (
                <span
                  aria-hidden="true"
                  style={{
                    color: lightTheme.label.alternative,
                    fontSize: '16px',
                    fontWeight: 500,
                  }}
                >
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
