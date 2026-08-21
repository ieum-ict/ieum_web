import { lightTheme } from '@ict/design-tokens'

export type PullReqStatus = '진행중' | '대기중' | '응답대기' | '완료'

export type PullReqCardProps = {
  title: string
  status: PullReqStatus
  week?: number
  day: number
  symptoms: string[]
  isNewborn?: boolean
  location: string
  requestedMinutesAgo: number
  onClick?: () => void
}

const statusColors = {
  진행중: lightTheme.primary.normal,
  대기중: lightTheme.primary.normal,
  응답대기: lightTheme.status.cautionary,
  완료: lightTheme.status.positive,
} satisfies Record<PullReqStatus, string>

export const PullReqCard = ({
  title,
  status,
  week,
  day,
  symptoms,
  isNewborn = false,
  location,
  requestedMinutesAgo,
  onClick,
}: PullReqCardProps) => {
  const conditionText = isNewborn ? `생후 ${day}일` : `${week}주 ${day}일`
  const description = `${conditionText} · ${symptoms.join(', ')}`

  return (
    <button
      type="button"
      onClick={onClick}
      style={{
        width: '100%',
        padding: '18px',
        border: 0,
        borderRadius: '8px',
        textAlign: 'left',
        background: 'var(--background-elevated)',
        boxShadow: '0 8px 24px rgb(0 0 0 / 8%)',
        cursor: onClick ? 'pointer' : 'default',
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '12px',
          marginBottom: '10px',
        }}
      >
        <strong
          style={{
            color: 'var(--label-normal)',
            fontSize: '18px',
            fontWeight: 600,
            lineHeight: 1.3,
          }}
        >
          {title}
        </strong>
        <span
          style={{
            flex: '0 0 auto',
            padding: '5px 10px',
            borderRadius: '999px',
            color: lightTheme.background.normal.normal,
            fontSize: '13px',
            fontWeight: 600,
            lineHeight: 1.3,
            background: statusColors[status],
          }}
        >
          {status}
        </span>
      </div>

      <p
        style={{
          margin: 0,
          color: lightTheme.label.neutral,
          fontSize: '15px',
          fontWeight: 500,
          lineHeight: 1.45,
        }}
      >
        {description}
      </p>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '12px',
        }}
      >
        <p
          style={{
            margin: 0,
            color: lightTheme.label.alternative,
            fontSize: '15px',
            fontWeight: 500,
            lineHeight: 1.45,
          }}
        >
          {location}
        </p>
        <p
          style={{
            margin: 0,
            color: lightTheme.label.alternative,
            fontSize: '15px',
            fontWeight: 500,
            lineHeight: 1.45,
          }}
        >
          요청 {requestedMinutesAgo}분전
        </p>
      </div>
    </button>
  )
}
