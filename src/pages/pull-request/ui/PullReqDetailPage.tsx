import { lightTheme } from '@ict/design-tokens'
import type { PullReqStatus } from './PullReqCard'

type PullReqDetailPageProps = {
  title: string
  status: PullReqStatus
  week?: number
  day: number
  symptoms: string[]
  isNewborn?: boolean
}

const statusColors = {
  진행중: lightTheme.status.destructive,
  대기중: lightTheme.primary.normal,
  응답대기: lightTheme.status.cautionary,
  완료: lightTheme.status.positive,
} satisfies Record<PullReqStatus, string>

const detailInfo = {
  requestedAt: '2024.01.31 - 10:00',
  currentStage: '14팀 대기',
}

const detailSteps = [
  { label: '요청 접수', time: '09:20', status: 'done' },
  { label: '분석 발표', time: '09:22', status: 'done' },
  { label: '병원 검색 완료', time: '09:23', status: 'done' },
  { label: '수용 요청 전송', time: '09:24', status: 'done' },
  { label: '병원 응답 대기', time: '-', status: 'current' },
  { label: '병원 확정', time: '-', status: 'upcoming' },
  { label: '이송팀 배정', time: '-', status: 'upcoming' },
  { label: '출발지 도착', time: '-', status: 'upcoming' },
  { label: '환자 인계 준비', time: '-', status: 'upcoming' },
  { label: '이송 시작', time: '-', status: 'upcoming' },
  { label: '도착 예정 공유', time: '-', status: 'upcoming' },
  { label: '병원 도착', time: '-', status: 'upcoming' },
  { label: '인계 완료', time: '-', status: 'upcoming' },
] as const

export function PullReqDetailPage({
  title,
  status,
  week,
  day,
  symptoms,
  isNewborn = false,
}: PullReqDetailPageProps) {
  const conditionText = isNewborn ? `생후 ${day}일` : `${week}주 ${day}일`
  const description = `${conditionText} · ${symptoms.join(', ')}`

  return (
    <main className="transport-page">
      <section
        aria-label="전원 요청 상세"
        style={{
          minHeight: 0,
          flex: '1 1 auto',
          overflow: 'hidden',
          padding: '64px 20px 26px',
          background: lightTheme.fill.alternative,
        }}
      >
        <div style={{ height: '100%', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <section aria-label="요청 요약" style={{ display: 'grid', gap: '20px' }}>
            <div style={{ display: 'grid', gap: '7px' }}>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: '12px',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', minWidth: 0 }}>

                  <h1
                    style={{
                      margin: 0,
                      color: lightTheme.label.normal,
                      fontSize: '18px',
                      fontWeight: 600,
                      lineHeight: 1.3,
                    }}
                  >
                    {title}
                  </h1>
                </div>
                <span
                  style={{
                    flex: '0 0 auto',
                    padding: '2px 9px',
                    borderRadius: '100px',
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
                }}
              >
                {description}
              </p>
            </div>

            <div
              style={{
                height: '1.5px',
                borderRadius: '100px',
                background: lightTheme.label.disable,
              }}
            />

            <div
              style={{
                display: 'grid',
                gap: '7px',
                color: lightTheme.label.alternative,
                fontSize: '16px',
                fontWeight: 500,
                lineHeight: 1.3,
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', gap: '16px' }}>
                <span>요청 시간</span>
                <span>{detailInfo.requestedAt}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', gap: '16px' }}>
                <span>현재 단계</span>
                <span>{detailInfo.currentStage}</span>
              </div>
            </div>
          </section>

          <section
            aria-label="진행 단계"
            style={{
              minHeight: 0,
                maxHeight: '57.5%',
              flex: '1 1 auto',
              padding: '14px 19px 22px',
              borderRadius: '10px',
              display: 'flex',
              flexDirection: 'column',
              background: lightTheme.background.elevated.normal,
            }}
          >
            <h2
              style={{
                margin: 0,
                color: lightTheme.label.normal,
                fontSize: '18px',
                fontWeight: 600,
                lineHeight: 1.3,
              }}
            >
              진행 단계
            </h2>

            <div
              style={{
                minHeight: 0,
                flex: '1 1 auto',
                overflowY: 'auto',
                marginTop: '25px',
                paddingRight: '4px',
              }}
            >
            <ol
              style={{
                position: 'relative',
                display: 'grid',
                gap: '22px',
                margin: 0,
                padding: 0,
                listStyle: 'none',
              }}
            >
              <span
                aria-hidden="true"
                style={{
                  position: 'absolute',
                  left: '7px',
                  top: '8px',
                  bottom: '8px',
                  width: '2px',
                  background: lightTheme.label.disable,
                }}
              />
              {detailSteps.map((step) => {
                const isCurrent = step.status === 'current'
                const isUpcoming = step.status === 'upcoming'

                return (
                  <li
                    key={step.label}
                    style={{
                      position: 'relative',
                      display: 'grid',
                      gridTemplateColumns: '1fr auto',
                      alignItems: 'center',
                      gap: '16px',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '18px', minWidth: 0 }}>
                      <span
                        aria-hidden="true"
                        style={{
                          position: 'relative',
                          zIndex: 1,
                          width: '16px',
                          height: '16px',
                          border: `2px solid ${isUpcoming ? lightTheme.label.assistive : lightTheme.primary.normal}`,
                          borderRadius: '50%',
                          background: lightTheme.background.elevated.normal,
                        }}
                      />
                      <span
                        style={{
                          color: isCurrent
                            ? lightTheme.primary.heavy
                            : isUpcoming
                              ? lightTheme.label.alternative
                              : lightTheme.label.neutral,
                          fontSize: '16px',
                          fontWeight: isCurrent ? 600 : 500,
                          lineHeight: 1.3,
                        }}
                      >
                        {step.label}
                      </span>
                    </div>
                    <span
                      style={{
                        color: lightTheme.label.alternative,
                        fontSize: '16px',
                        fontWeight: 500,
                        lineHeight: 1.3,
                      }}
                    >
                      {step.time}
                    </span>
                  </li>
                )
              })}
            </ol>
            </div>
          </section>

          <button
            type="button"
            style={{
                width: '100%',
                height: '42px',
                border: 0,
                borderRadius: '10px',
                color: lightTheme.background.elevated.normal,
                fontSize: '18px',
                fontWeight: 500,
                lineHeight: 1.3,
                background: lightTheme.primary.normal,
                cursor: 'pointer',
            }}
          >
            상세 보기
          </button>
        </div>
      </section>
    </main>
  )
}
