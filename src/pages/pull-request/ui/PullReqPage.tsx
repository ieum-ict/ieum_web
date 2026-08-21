import { useState } from 'react'
import { lightTheme } from '@ict/design-tokens'
import { createThemeVars } from '../../../shared/lib/theme'
import '../../../App.css'
import { InputInformation } from './InputInformation'
import { PullReqCard } from './PullReqCard'
import type { PullReqStatus } from './PullReqCard'

type PullReqFilter = '전체' | PullReqStatus

type PullReqItem = {
  id: number
  title: string
  status: PullReqStatus
  week?: number
  day: number
  symptoms: string[]
  isNewborn?: boolean
  location: string
  requestedMinutesAgo: number
}

const pullReqFilters: PullReqFilter[] = ['전체', '진행중', '응답대기', '완료']

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
  const [selectedFilter, setSelectedFilter] = useState<PullReqFilter>('전체')
  const [isInputOpen, setIsInputOpen] = useState(false)
  const filteredPullReqItems =
    selectedFilter === '전체' ? pullReqItems : pullReqItems.filter((item) => item.status === selectedFilter)

  const closeInputForm = () => {
    if (window.location.pathname !== '/pull-request') {
      window.history.replaceState(null, '', '/pull-request')
    }

    setIsInputOpen(false)
  }

  if (isInputOpen) {
    return (
      <div style={createThemeVars()}>
        <InputInformation onBack={() => setIsInputOpen(false)} onSave={closeInputForm} />
      </div>
    )
  }

  return (
    <div style={createThemeVars()}>
      <main className="transport-page" style={{ position: 'relative' }}>
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '12px',
            padding: '16px 20px 12px',
            background: 'var(--fill-alternative)',
          }}
        >
          <p
            style={{
              width: '100%',
              margin: 0,
              color: lightTheme.label.neutral,
              fontSize: '20px',
              fontWeight: 600,
              lineHeight: 1.3,
            }}
          >
            전원 요청
          </p>

          <div
            role="tablist"
            aria-label="이송 요청 상태 필터"
            style={{
              width: '100%',
              height: '43px',
              padding: '5px',
              borderRadius: '10px',
              display: 'grid',
              gridTemplateColumns: 'repeat(4, minmax(0, 1fr))',
              gap: '6px',
              background: lightTheme.line.neutral,
            }}
          >
            {pullReqFilters.map((filter) => {
              const isSelected = selectedFilter === filter

              return (
                <button
                  key={filter}
                  type="button"
                  role="tab"
                  aria-selected={isSelected}
                  onClick={() => setSelectedFilter(filter)}
                  style={{
                    minWidth: 0,
                    height: '33px',
                    padding: 0,
                    border: 0,
                    borderRadius: '10px',
                    color: isSelected ? lightTheme.label.neutral : lightTheme.interaction.inactive,
                    fontSize: '16px',
                    fontWeight: 500,
                    lineHeight: 1.3,
                    background: isSelected ? lightTheme.background.normal.normal : 'transparent',
                    cursor: 'pointer',
                  }}
                >
                  {filter}
                </button>
              )
            })}
          </div>
        </div>

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
            {filteredPullReqItems.map((item) => (
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

        <button
          type="button"
          aria-label="전원 요청 정보 입력"
          onClick={() => setIsInputOpen(true)}
          style={{
            position: 'absolute',
            right: '20px',
            bottom: '20px',
            zIndex: 2,
            width: '58px',
            height: '58px',
            padding: 0,
            border: 0,
            borderRadius: '100px',
            display: 'grid',
            placeItems: 'center',
            color: lightTheme.background.normal.normal,
            fontSize: '44px',
            fontWeight: 400,
            lineHeight: 1,
            background: lightTheme.primary.normal,
            boxShadow: '0 2px 4px rgb(0 0 0 / 25%)',
            cursor: 'pointer',
          }}
        >
          +
        </button>
      </main>
    </div>
  )
}
