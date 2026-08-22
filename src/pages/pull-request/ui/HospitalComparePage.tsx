import { useState } from 'react'
import { lightTheme } from '@ict/design-tokens'
import { chevronIcon, compareAiIcon, compareDropdownIcon } from '../../../shared/config/assets'

type HospitalComparePageProps = {
  onBack: () => void
}

type CompareHospital = {
  id: number
  name: string
  shortName: string
  color: string
}

type CompareMetric = {
  id: string
  label: string
  unit: string
  maxValue: number
  scale: number[]
  values: Record<number, number>
  recommendation: string[]
  preferLower?: boolean
}

const compareMetrics: CompareMetric[] = [
  {
    id: 'preparation-time',
    label: '준비시간',
    unit: '분',
    maxValue: 50,
    scale: [50, 40, 30, 20, 10, 0],
    values: { 1: 12, 2: 18, 3: 21 },
    recommendation: ['A대학병원이 가장 빠른 준비가 가능하며,', '즉시 수용 절차를 시작할 수 있습니다.'],
    preferLower: true,
  },
  {
    id: 'travel-time',
    label: '이동시간',
    unit: '분',
    maxValue: 50,
    scale: [50, 40, 30, 20, 10, 0],
    values: { 1: 18, 2: 25, 3: 29 },
    recommendation: ['A대학병원이 가장 빠른 치료 시작이 가능하며,', '필수 의료자원이 모두 확인되었습니다.'],
    preferLower: true,
  },
  {
    id: 'treatment-start-time',
    label: '치료 시작 시간',
    unit: '분',
    maxValue: 80,
    scale: [80, 64, 48, 32, 16, 0],
    values: { 1: 34, 2: 47, 3: 52 },
    recommendation: ['A대학병원이 치료 시작 예상 시간이 가장 짧고,', '분만 대응팀 연결이 빠릅니다.'],
    preferLower: true,
  },
  {
    id: 'obstetrician',
    label: '산부인과 전문의',
    unit: '명',
    maxValue: 20,
    scale: [20, 16, 12, 8, 4, 0],
    values: { 1: 12, 2: 9, 3: 7 },
    recommendation: ['A대학병원이 산부인과 전문의 여력이 가장 높고,', '고위험 산모 대응이 가능합니다.'],
  },
  {
    id: 'neonatologist',
    label: '신생아 전문의',
    unit: '명',
    maxValue: 12,
    scale: [12, 10, 8, 6, 4, 0],
    values: { 1: 7, 2: 5, 3: 4 },
    recommendation: ['A대학병원이 신생아 전문의 배치가 가장 안정적이며,', '출생 직후 처치 대응이 가능합니다.'],
  },
  {
    id: 'operating-room',
    label: '수술실',
    unit: '개',
    maxValue: 8,
    scale: [8, 6, 4, 3, 2, 0],
    values: { 1: 5, 2: 3, 3: 2 },
    recommendation: ['A대학병원이 사용 가능한 수술실이 가장 많아,', '응급 수술 전환 여지가 큽니다.'],
  },
  {
    id: 'nicu',
    label: 'NICU',
    unit: '병상',
    maxValue: 30,
    scale: [30, 24, 18, 12, 6, 0],
    values: { 1: 20, 2: 14, 3: 11 },
    recommendation: ['A대학병원이 NICU 여유 병상이 가장 많으며,', '신생아 집중 치료 연계가 안정적입니다.'],
  },
]

const compareHospitals: CompareHospital[] = [
  {
    id: 1,
    name: 'A대학병원',
    shortName: 'A대학병원',
    color: lightTheme.status.positive,
  },
  {
    id: 2,
    name: 'B여성병원',
    shortName: 'B여성병원',
    color: lightTheme.status.cautionary,
  },
  {
    id: 3,
    name: 'C안산병원',
    shortName: 'C안산병원',
    color: lightTheme.primary.normal,
  },
]

const chartHeight = 220
const chartBarMaxHeight = 125

export function HospitalComparePage({ onBack }: HospitalComparePageProps) {
  const [selectedMetricId, setSelectedMetricId] = useState('travel-time')
  const [isMetricDropdownOpen, setIsMetricDropdownOpen] = useState(false)
  const selectedMetric = compareMetrics.find((metric) => metric.id === selectedMetricId) ?? compareMetrics[1]
  const recommendedHospitalId = compareHospitals.reduce((bestHospitalId, hospital) => {
    const currentValue = selectedMetric.values[hospital.id] ?? 0
    const bestValue = selectedMetric.values[bestHospitalId] ?? 0

    if (selectedMetric.preferLower) {
      return currentValue < bestValue ? hospital.id : bestHospitalId
    }

    return currentValue > bestValue ? hospital.id : bestHospitalId
  }, compareHospitals[0].id)
  const recommendedHospital = compareHospitals.find((hospital) => hospital.id === recommendedHospitalId) ?? compareHospitals[0]

  return (
    <main className="transport-page">
      <header className="update-header" style={{ background: lightTheme.background.elevated.normal }}>
        <button className="update-header__back" type="button" aria-label="병원 응답으로 돌아가기" onClick={onBack}>
          <img src={chevronIcon} alt="" draggable="false" />
        </button>
        <h1>병원 비교</h1>
      </header>

      <section
        aria-label="병원 비교"
        style={{
          minHeight: 0,
          flex: '1 1 auto',
          overflowY: 'auto',
          padding: '73px 14px 31px',
          background: lightTheme.background.elevated.normal,
        }}
      >
        <div
          style={{
            minHeight: '592px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            gap: '26px',
          }}
        >
          <div
            style={{
              display: 'grid',
              justifyItems: 'center',
              gap: '12px',
            }}
          >
            <section
              aria-labelledby="compare-chart-title"
              style={{
                position: 'relative',
                width: '350px',
                maxWidth: '100%',
                height: '330px',
                borderRadius: '20px',
                overflow: 'hidden',
                background: lightTheme.background.normal.alternative,
              }}
            >
              <div
                style={{
                  position: 'absolute',
                  left: '20px',
                  top: '9px',
                  zIndex: 3,
                }}
              >
                <button
                  id="compare-chart-title"
                  type="button"
                  aria-haspopup="listbox"
                  aria-expanded={isMetricDropdownOpen}
                  onClick={() => setIsMetricDropdownOpen((currentValue) => !currentValue)}
                  style={{
                    height: '24px',
                    padding: 0,
                    border: 0,
                    display: 'flex',
                    alignItems: 'center',
                    gap: '1px',
                    color: lightTheme.label.neutral,
                    fontSize: '16px',
                    fontWeight: 600,
                    lineHeight: 1.3,
                    background: 'transparent',
                    cursor: 'pointer',
                  }}
                >
                  <span>{selectedMetric.label}</span>
                  <span
                    aria-hidden="true"
                    style={{
                      width: '24px',
                      height: '24px',
                      display: 'grid',
                      placeItems: 'center',
                    }}
                  >
                    <img
                      src={compareDropdownIcon}
                      alt=""
                      draggable="false"
                      style={{
                        width: '10px',
                        height: '5px',
                        transition: 'transform 160ms ease',
                        transform: isMetricDropdownOpen ? 'rotate(180deg)' : 'none',
                      }}
                    />
                  </span>
                </button>
              </div>

              {isMetricDropdownOpen ? (
                <div
                  role="listbox"
                  aria-label="비교 기준"
                  style={{
                    position: 'absolute',
                    left: '20px',
                    top: '39px',
                    zIndex: 4,
                    width: '115px',
                    borderRadius: '10px',
                    overflow: 'hidden',
                    filter: 'drop-shadow(1px 2px 2px rgb(0 0 0 / 8%))',
                  }}
                >
                  {compareMetrics.map((metric, index) => {
                    const isSelected = metric.id === selectedMetricId

                    return (
                      <button
                        key={metric.id}
                        type="button"
                        role="option"
                        aria-selected={isSelected}
                        onClick={() => {
                          setSelectedMetricId(metric.id)
                          setIsMetricDropdownOpen(false)
                        }}
                        style={{
                          width: '100%',
                          height: '27px',
                          padding: 0,
                          border: 0,
                          borderRadius:
                            index === 0
                              ? '10px 10px 0 0'
                              : index === compareMetrics.length - 1
                                ? '0 0 10px 10px'
                                : 0,
                          color: isSelected ? lightTheme.label.alternative : lightTheme.label.assistive,
                          fontSize: '14px',
                          fontWeight: isSelected ? 600 : 500,
                          lineHeight: 1.3,
                          background: isSelected ? lightTheme.label.disable : lightTheme.background.normal.normal,
                          cursor: 'pointer',
                        }}
                      >
                        {metric.label}
                      </button>
                    )
                  })}
                </div>
              ) : null}

              <div
                aria-hidden="true"
                style={{
                  position: 'absolute',
                  left: '20px',
                  top: '48px',
                  width: '31px',
                  height: '240px',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'flex-end',
                  justifyContent: 'space-between',
                  color: lightTheme.label.assistive,
                  fontSize: '14px',
                  fontWeight: 500,
                  lineHeight: 1.3,
                }}
              >
                {selectedMetric.scale.map((value) => (
                  <span key={value}>
                    {value}
                    {selectedMetric.unit}
                  </span>
                ))}
              </div>

              <div
                style={{
                  position: 'absolute',
                  left: '63px',
                  top: '59px',
                  width: '263px',
                  height: `${chartHeight}px`,
                }}
              >
                {selectedMetric.scale.map((value) => {
                  const top = ((selectedMetric.maxValue - value) / selectedMetric.maxValue) * chartHeight

                  return (
                    <span
                      key={value}
                      aria-hidden="true"
                      style={{
                        position: 'absolute',
                        left: 0,
                        right: 0,
                        top: `${top}px`,
                        height: '1px',
                        background: lightTheme.line.normal,
                      }}
                    />
                  )
                })}

                <div
                  style={{
                    position: 'absolute',
                    left: '25px',
                    right: '12px',
                    bottom: 0,
                    height: '125px',
                    display: 'flex',
                    alignItems: 'flex-end',
                    gap: '24px',
                  }}
                >
                  {compareHospitals.map((hospital) => {
                    const value = selectedMetric.values[hospital.id] ?? 0
                    const height = Math.min(chartBarMaxHeight, Math.round((value / selectedMetric.maxValue) * chartHeight))
                    const isRecommended = hospital.id === recommendedHospitalId

                    return (
                      <div
                        key={`${selectedMetric.id}-${hospital.id}`}
                        style={{
                          position: 'relative',
                          width: '53px',
                          height: `${Math.max(8, height)}px`,
                          borderTopLeftRadius: '5px',
                          borderTopRightRadius: '5px',
                          background: hospital.color,
                          transition: 'height 220ms ease',
                        }}
                      >
                        <span
                          style={{
                            position: 'absolute',
                            left: 0,
                            top: '-36px',
                            width: '53px',
                            height: '27px',
                            borderRadius: '4px',
                            display: 'grid',
                            placeItems: 'center',
                            color: isRecommended ? lightTheme.label.neutral : lightTheme.interaction.inactive,
                            fontSize: '12px',
                            fontWeight: 500,
                            lineHeight: 1.3,
                            background: lightTheme.background.normal.normal,
                            boxShadow: '0 2px 6px rgb(0 0 0 / 8%)',
                          }}
                        >
                          {value}
                          {selectedMetric.unit}
                        </span>
                      </div>
                    )
                  })}
                </div>

                <div
                  style={{
                    position: 'absolute',
                    left: '25px',
                    right: '12px',
                    top: '235px',
                    display: 'flex',
                    gap: '24px',
                  }}
                >
                  {compareHospitals.map((hospital) => (
                    <span
                      key={hospital.id}
                      style={{
                        width: '53px',
                        color: hospital.id === recommendedHospitalId ? lightTheme.label.neutral : lightTheme.label.alternative,
                        fontSize: '12px',
                        fontWeight: hospital.id === recommendedHospitalId ? 600 : 500,
                        lineHeight: 1.3,
                        textAlign: 'center',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      {hospital.shortName}
                    </span>
                  ))}
                </div>
              </div>
            </section>

            <section
              aria-label="AI 추천"
              style={{
                position: 'relative',
                width: '350px',
                maxWidth: '100%',
                minHeight: '84px',
                padding: '18px 19px',
                border: `1px solid ${lightTheme.line.neutral}`,
                borderRadius: '10px',
                display: 'flex',
                alignItems: 'center',
                gap: '16px',
                background: lightTheme.background.normal.normal,
              }}
            >
              <span
                aria-hidden="true"
                style={{
                  position: 'absolute',
                  top: '-8px',
                  left: '50%',
                  width: '14px',
                  height: '14px',
                  borderTop: `1px solid ${lightTheme.line.neutral}`,
                  borderLeft: `1px solid ${lightTheme.line.neutral}`,
                  background: lightTheme.background.normal.normal,
                  transform: 'translateX(-50%) rotate(45deg)',
                }}
              />
              <img
                src={compareAiIcon}
                alt=""
                draggable="false"
                style={{
                  width: '37px',
                  height: '37px',
                  flex: '0 0 auto',
                }}
              />
              <div style={{ minWidth: 0, display: 'grid', gap: '4px' }}>
                <strong
                  style={{
                    color: lightTheme.primary.normal,
                    fontSize: '18px',
                    fontWeight: 600,
                    lineHeight: 1.3,
                  }}
                >
                  AI 추천
                </strong>
                <p
                  style={{
                    margin: 0,
                    color: lightTheme.label.alternative,
                    fontSize: '14px',
                    fontWeight: 500,
                    lineHeight: 1.3,
                  }}
                >
                  {selectedMetric.recommendation[0].replace('A대학병원', recommendedHospital.name)}
                  <br />
                  {selectedMetric.recommendation[1]}
                </p>
              </div>
            </section>

            <p
              style={{
                width: '100%',
                margin: 0,
                color: lightTheme.label.assistive,
                fontSize: '14px',
                fontWeight: 500,
                lineHeight: 1.3,
                textAlign: 'center',
              }}
            >
              최종 결정은 119 상황실 또는 의료진이 수행합니다.
            </p>
          </div>

          <div style={{ display: 'grid', gap: '6px' }}>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(3, minmax(0, 1fr))',
                gap: '8px',
              }}
            >
              {compareHospitals.map((hospital) => (
                <button
                  key={hospital.id}
                  type="button"
                  style={{
                    height: '42px',
                    minWidth: 0,
                    padding: '0 8px',
                    border: `1px solid ${lightTheme.primary.normal}`,
                    borderRadius: '10px',
                    overflow: 'hidden',
                    color: lightTheme.primary.normal,
                    fontSize: '18px',
                    fontWeight: 500,
                    lineHeight: 1.3,
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                    background: lightTheme.background.normal.normal,
                    cursor: 'pointer',
                  }}
                >
                  {hospital.name}
                </button>
              ))}
            </div>

            <button
              type="button"
              onClick={onBack}
              style={{
                height: '42px',
                border: 0,
                borderRadius: '10px',
                color: lightTheme.background.normal.normal,
                fontSize: '18px',
                fontWeight: 500,
                lineHeight: 1.3,
                background: lightTheme.primary.normal,
                cursor: 'pointer',
              }}
            >
              다른 병원 더 보기
            </button>
          </div>
        </div>
      </section>
    </main>
  )
}
