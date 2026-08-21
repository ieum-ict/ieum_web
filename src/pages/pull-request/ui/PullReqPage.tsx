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
    description: '28주 1일 · 출혈, 진통',
    location: '청주시 상당구',
    requestedAgo: '요청 10분전',
  },
  {
    id: 2,
    title: '고위험 산모',
    status: '대기중',
    description: '34주 4일 · 고혈압, 두통',
    location: '청주시 흥덕구',
    requestedAgo: '요청 18분전',
  },
  {
    id: 3,
    title: '응급 분만 요청',
    status: '진행중',
    description: '39주 2일 · 양수 파수',
    location: '청주시 서원구',
    requestedAgo: '요청 25분전',
  },
  {
    id: 4,
    title: '신생아 이송',
    status: '응답대기',
    description: '생후 2일 · 호흡 곤란',
    location: '청주시 청원구',
    requestedAgo: '요청 32분전',
  },
  {
    id: 5,
    title: '위험 임산부',
    status: '대기중',
    description: '31주 6일 · 복통, 발열',
    location: '증평군 증평읍',
    requestedAgo: '요청 41분전',
  },
  {
    id: 6,
    title: '산모 응급 요청',
    status: '완료',
    description: '36주 0일 · 태동 감소',
    location: '괴산군 괴산읍',
    requestedAgo: '요청 48분전',
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
                description={item.description}
                location={item.location}
                requestedAgo={item.requestedAgo}
              />
            ))}
          </div>
        </section>
      </main>
    </div>
  )
}
