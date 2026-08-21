import { createThemeVars } from '../../../shared/lib/theme'
import '../../../App.css'
import { PullReqCard } from './PullReqCard'
import type { PullReqCardProps } from './PullReqCard'

type PullReqItem = PullReqCardProps & {
  id: number
}

const pullReqItems: PullReqItem[] = [
  {
    id: 1,
    title: '위험 임산부',
    status: '진행중',
    week: 28,
    day: 1,
    symptoms: ['출혈', '진통'],
    location: '청주시 상당구',
    requestedMinutesAgo: 10,
  },
  {
    id: 2,
    title: '고위험 산모',
    status: '대기중',
    week: 34,
    day: 4,
    symptoms: ['고혈압', '두통'],
    location: '청주시 흥덕구',
    requestedMinutesAgo: 18,
  },
  {
    id: 3,
    title: '응급 분만 요청',
    status: '진행중',
    week: 39,
    day: 2,
    symptoms: ['양수 파수'],
    location: '청주시 서원구',
    requestedMinutesAgo: 25,
  },
  {
    id: 4,
    title: '신생아 이송',
    status: '응답대기',
    day: 2,
    symptoms: ['호흡 곤란'],
    isNewborn: true,
    location: '청주시 청원구',
    requestedMinutesAgo: 32,
  },
  {
    id: 5,
    title: '위험 임산부',
    status: '대기중',
    week: 31,
    day: 6,
    symptoms: ['복통', '발열'],
    location: '증평군 증평읍',
    requestedMinutesAgo: 41,
  },
  {
    id: 6,
    title: '산모 응급 요청',
    status: '완료',
    week: 36,
    day: 0,
    symptoms: ['태동 감소'],
    location: '괴산군 괴산읍',
    requestedMinutesAgo: 48,
  },
]

export const PullReqPage = () => {
  return (
    <div style={createThemeVars()}>
      <main className="transport-page">
        <header className="transport-header">
          <h1>이송 요청 확인</h1>
        </header>

        <section
          aria-label="이송 요청 목록"
          style={{
            minHeight: 0,
            flex: '1 1 auto',
            overflowY: 'auto',
            padding: '20px',
            background: 'var(--fill-alternative)',
          }}
        >
          <div
            style={{
              display: 'grid',
              gap: '12px',
            }}
          >
            {pullReqItems.map((item) => (
              <PullReqCard
                key={item.id}
                title={item.title}
                status={item.status}
                week={item.week}
                day={item.day}
                symptoms={item.symptoms}
                isNewborn={item.isNewborn}
                location={item.location}
                requestedMinutesAgo={item.requestedMinutesAgo}
              />
            ))}
          </div>
        </section>
      </main>
    </div>
  )
}
