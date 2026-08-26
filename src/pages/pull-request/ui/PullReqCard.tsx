import { lightTheme } from '@ict/design-tokens'
import { reportIcon } from '../../../shared/config/assets'

export type PullReqStatus = '진행중' | '응답대기' | '완료' | '취소'

export type PullReqCardProps = {
  title: string
  status: PullReqStatus
  description: string
  location: string
  requestedMinutesAgo: number
  onClick?: () => void
}

const statusColors = {
  진행중: lightTheme.status.destructive,
  응답대기: lightTheme.status.cautionary,
  완료: lightTheme.status.positive,
  취소: lightTheme.label.disable,
} satisfies Record<PullReqStatus, string>

export const PullReqCard = ({
  title,
  status,
  description,
  location,
  requestedMinutesAgo,
  onClick,
}: PullReqCardProps) => {
  return (
    <button
      type="button"
      onClick={onClick}
      style={{
        width: '100%',
        minHeight: '116px',
        padding: '18px 27px',
        border: 0,
        borderRadius: '10px',
        textAlign: 'left',
        background: 'var(--background-elevated)',
        boxShadow: '0 2px 4px rgb(0 0 0 / 6%)',
        cursor: onClick ? 'pointer' : 'default',
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '12px',
          marginBottom: '4px',
        }}
      >
        <span style={{ minWidth: 0, display: 'flex', alignItems: 'center', gap: '6px' }}>
          <img src={reportIcon} alt="" draggable="false" style={{ width: '18px', height: '18px' }} />
          <strong
            style={{
              minWidth: 0,
              color: 'var(--label-normal)',
              fontSize: '18px',
              fontWeight: 600,
              lineHeight: 1.3,
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
            }}
          >
            {title}
          </strong>
        </span>
        <span
          style={{
            flex: '0 0 auto',
            padding: '2px 9px',
            borderRadius: '999px',
            color: lightTheme.background.normal.normal,
            fontSize: '14px',
            fontWeight: 500,
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
          fontSize: '16px',
          fontWeight: 500,
          lineHeight: 1.3,
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap',
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
