import { useState } from 'react'
import { lightTheme } from '@ict/design-tokens'
import { chevronIcon } from '../../../shared/config/assets'

type ResourceDetailPageProps = {
  onBack: () => void
}

const hospitalInfo = {
  name: 'A대학교병원 (본원)',
  distance: '18km',
}

const resourceRows = [
  { label: '산부인과 전문의', value: '12명' },
  { label: '신생아 전문의', value: '7명' },
  { label: '마취과 전문의', value: '6명' },
  { label: '수술실', value: '6개' },
  { label: '분만실', value: '6개' },
  { label: 'NICU 병상', value: '6개' },
  { label: '인큐베이터', value: '6개' },
]

export function ResourceDetailPage({ onBack }: ResourceDetailPageProps) {
  const [isTransfusionAvailable, setIsTransfusionAvailable] = useState(true)

  return (
    <main className="transport-page">
      <header className="update-header" style={{ background: lightTheme.fill.alternative }}>
        <button className="update-header__back" type="button" aria-label="요청 상세로 돌아가기" onClick={onBack}>
          <img src={chevronIcon} alt="" draggable="false" />
        </button>
        <h1>자원 상세</h1>
      </header>

      <section
        aria-label="자원 상세"
        style={{
          minHeight: 0,
          flex: '1 1 auto',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          gap: '20px',
          padding: '0 20px 23px',
          background: lightTheme.fill.alternative,
        }}
      >
        <div style={{ display: 'grid', gap: '20px' }}>
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
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '16px' }}>
              <span>병원명</span>
              <span>{hospitalInfo.name}</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '16px' }}>
              <span>거리</span>
              <span>{hospitalInfo.distance}</span>
            </div>
          </div>

          <section
            aria-label="자원 현황"
            style={{
              borderRadius: '10px',
              overflow: 'hidden',
              background: lightTheme.background.elevated.normal,
            }}
          >
            <h2
              style={{
                margin: 0,
                padding: '14px 18px 0',
                color: lightTheme.label.normal,
                fontSize: '18px',
                fontWeight: 600,
                lineHeight: 1.3,
              }}
            >
              자원 현황
            </h2>

            <div style={{ marginTop: '8px' }}>
              {resourceRows.map((row) => (
                <div
                  key={row.label}
                  style={{
                    minHeight: '53px',
                    padding: '0 17px',
                    borderBottom: `1px solid ${lightTheme.label.disable}`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: '16px',
                    color: lightTheme.label.alternative,
                    fontSize: '16px',
                    fontWeight: 500,
                    lineHeight: 1.3,
                  }}
                >
                  <span>{row.label}</span>
                  <strong
                    style={{
                      color: lightTheme.label.neutral,
                      fontSize: '16px',
                      fontWeight: 500,
                      lineHeight: 1.3,
                    }}
                  >
                    {row.value}
                  </strong>
                </div>
              ))}

              <div
                style={{
                  minHeight: '53px',
                  padding: '0 17px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: '16px',
                  color: lightTheme.label.alternative,
                  fontSize: '16px',
                  fontWeight: 500,
                  lineHeight: 1.3,
                }}
              >
                <span>수혈 가능 여부</span>
                <button
                  type="button"
                  aria-pressed={isTransfusionAvailable}
                  aria-label="수혈 가능 여부"
                  onClick={() => setIsTransfusionAvailable((currentValue) => !currentValue)}
                  style={{
                    position: 'relative',
                    width: '40.5px',
                    height: '24px',
                    padding: 0,
                    border: 0,
                    borderRadius: '21px',
                    background: isTransfusionAvailable ? lightTheme.primary.normal : lightTheme.label.disable,
                    cursor: 'pointer',
                  }}
                >
                  <span
                    aria-hidden="true"
                    style={{
                      position: 'absolute',
                      top: '50%',
                      left: isTransfusionAvailable ? '18.75px' : '2.5px',
                      width: '19.18px',
                      height: '19.18px',
                      borderRadius: '50%',
                      background: lightTheme.background.elevated.alternative,
                      transform: 'translateY(-50%)',
                      transition: 'left 160ms ease',
                    }}
                  />
                </button>
              </div>
            </div>
          </section>
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
            gap: '7px',
          }}
        >
          <button
            type="button"
            onClick={onBack}
            style={{
              height: '42px',
              border: `1px solid ${lightTheme.line.neutral}`,
              borderRadius: '10px',
              color: lightTheme.label.alternative,
              fontSize: '18px',
              fontWeight: 600,
              lineHeight: 1.3,
              background: lightTheme.background.normal.normal,
              cursor: 'pointer',
            }}
          >
            닫기
          </button>
          <button
            type="button"
            onClick={onBack}
            style={{
              height: '42px',
              border: 0,
              borderRadius: '10px',
              color: lightTheme.background.normal.normal,
              fontSize: '18px',
              fontWeight: 600,
              lineHeight: 1.3,
              background: lightTheme.primary.normal,
              cursor: 'pointer',
            }}
          >
            저장
          </button>
        </div>
      </section>
    </main>
  )
}
