import { lightTheme } from '@ict/design-tokens'

export type PullReqCardProps = {
  title: string
  status: '진행중' | '대기중' | '응답대기' | '완료'
  week?: number
  day: number
  symptoms: string[]
  isNewborn?: boolean
  location: string
  requestedMinutesAgo: number
}

const statusColors: Record<PullReqCardProps['status'], string> = {
  진행중: lightTheme.primary.normal,
  대기중: lightTheme.primary.normal,
  응답대기: lightTheme.status.cautionary,
  완료: lightTheme.status.positive,
}

export const PullReqCard = ({
  title,
  status,
  week,
  day,
  symptoms,
  isNewborn = false,
  location,
  requestedMinutesAgo,
}: PullReqCardProps) => {
  const conditionText = isNewborn ? `생후 ${day}일` : `${week}주 ${day}일`
  const description = `${conditionText} · ${symptoms.join(', ')}`

  return (
    <article
      style={{
        padding: '18px',
        borderRadius: '8px',
        background: 'var(--background-elevated)',
        boxShadow: '0 8px 24px rgb(0 0 0 / 8%)',
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
    </article>
  )
}
