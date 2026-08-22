import { useState } from 'react'
import { lightTheme } from '@ict/design-tokens'
import { checkBoxFillIcon, checkBoxIcon, chevronIcon, reportIcon } from '../../../shared/config/assets'
import { HospitalResponsePage } from './HospitalResponsePage'
import type { PullReqStatus } from './PullReqCard'

type ResourceDetailPageProps = {
  title: string
  status: PullReqStatus
  week?: number
  day: number
  symptoms: string[]
  isNewborn?: boolean
  onBack: () => void
}

type HospitalRequestStatus = 'available' | 'conditional'

type SelectedHospital = {
  id: number
  name: string
  status: HospitalRequestStatus
  distanceKm: number
}

const statusColors = {
  진행중: lightTheme.status.destructive,
  대기중: lightTheme.primary.normal,
  응답대기: lightTheme.status.cautionary,
  완료: lightTheme.status.positive,
} satisfies Record<PullReqStatus, string>

const hospitalStatusConfig = {
  available: {
    label: '수용 가능',
    color: lightTheme.status.positive,
  },
  conditional: {
    label: '조건부 수용',
    color: lightTheme.status.cautionary,
  },
} satisfies Record<HospitalRequestStatus, { label: string; color: string }>

const selectedHospitals: SelectedHospital[] = [
  { id: 1, name: 'A대학교병원', status: 'available', distanceKm: 18 },
  { id: 2, name: 'A대학교병원', status: 'available', distanceKm: 18 },
  { id: 3, name: 'A대학교병원', status: 'conditional', distanceKm: 18 },
]

const informationRows = [
  { label: '예상 도착 시간', value: '약 18분 (18km)' },
  { label: '이송 수단', value: '119 구급차' },
  { label: '담당자', value: '홍길동 (전원 담당 간호사)' },
  { label: '연락처', value: '010-1234-5678' },
]

function SectionTitle({ id, children }: { id: string; children: string }) {
  return (
    <h2
      id={id}
      style={{
        width: '100%',
        margin: 0,
        color: lightTheme.label.neutral,
        fontSize: '18px',
        fontWeight: 600,
        lineHeight: 1.3,
      }}
    >
      {children}
    </h2>
  )
}

export function ResourceDetailPage({
  title,
  status,
  week,
  day,
  symptoms,
  isNewborn = false,
  onBack,
}: ResourceDetailPageProps) {
  const [selectedHospitalIds, setSelectedHospitalIds] = useState(() => new Set([1, 3]))
  const [isHospitalResponseOpen, setIsHospitalResponseOpen] = useState(false)
  const conditionText = isNewborn ? `생후 ${day}일` : `${week}주 ${day}일`
  const description = `${conditionText} · ${symptoms.join(', ')}`

  const toggleHospital = (hospitalId: number) => {
    setSelectedHospitalIds((currentValue) => {
      const nextValue = new Set(currentValue)

      if (nextValue.has(hospitalId)) {
        nextValue.delete(hospitalId)
        return nextValue
      }

      nextValue.add(hospitalId)
      return nextValue
    })
  }

  if (isHospitalResponseOpen) {
    return <HospitalResponsePage onBack={() => setIsHospitalResponseOpen(false)} />
  }

  return (
    <main className="transport-page">
      <header className="update-header" style={{ background: lightTheme.fill.alternative }}>
        <button className="update-header__back" type="button" aria-label="요청 상세로 돌아가기" onClick={onBack}>
          <img src={chevronIcon} alt="" draggable="false" />
        </button>
        <h1>수용 요청</h1>
      </header>

      <section
        aria-label="수용 요청"
        style={{
          position: 'relative',
          minHeight: 0,
          flex: '1 1 auto',
          overflow: 'hidden',
          background: lightTheme.fill.alternative,
        }}
      >
        <div
          style={{
            height: '100%',
            overflowY: 'auto',
            padding: '62px 20px 72px',
          }}
        >
          <div
            style={{
              display: 'grid',
              gap: '39px',
            }}
          >
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
                    <img
                      src={reportIcon}
                      alt=""
                      draggable="false"
                      style={{ width: '24px', height: '24px', flex: '0 0 auto' }}
                    />
                    <h2
                      style={{
                        minWidth: 0,
                        margin: 0,
                        overflow: 'hidden',
                        color: lightTheme.label.normal,
                        fontSize: '18px',
                        fontWeight: 600,
                        lineHeight: 1.3,
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      {title}
                    </h2>
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
                  lineHeight: 1.3,
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '14px' }}>
                  <span style={{ flex: '0 0 auto', fontSize: '16px', fontWeight: 500 }}>산모 상태</span>
                  <span style={{ minWidth: 0, fontSize: '14px', fontWeight: 400, textAlign: 'right' }}>
                    혈압 128/84mmHg, 맥박 96bpm{' '}
                    <span style={{ color: lightTheme.primary.normal }}>(안정)</span>
                  </span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '14px' }}>
                  <span style={{ flex: '0 0 auto', fontSize: '16px', fontWeight: 500 }}>필요 의료자원</span>
                  <span
                    style={{
                      minWidth: 0,
                      overflow: 'hidden',
                      fontSize: '14px',
                      fontWeight: 400,
                      textAlign: 'right',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    NICU 20/24 · 수술실 여유 · 수혈 가능
                  </span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '14px' }}>
                  <span style={{ flex: '0 0 auto', fontSize: '16px', fontWeight: 500 }}>현재 위치</span>
                  <span style={{ minWidth: 0, fontSize: '14px', fontWeight: 400, textAlign: 'right' }}>
                    경기 성남시 분당구
                  </span>
                </div>
              </div>
            </section>

            <section aria-labelledby="selected-hospital-title" style={{ display: 'grid', gap: '16px' }}>
              <SectionTitle id="selected-hospital-title">선택 병원</SectionTitle>

              <div
                style={{
                  borderRadius: '10px',
                  overflow: 'hidden',
                  background: lightTheme.background.normal.normal,
                }}
              >
                {selectedHospitals.map((hospital, index) => {
                  const isSelected = selectedHospitalIds.has(hospital.id)
                  const statusInfo = hospitalStatusConfig[hospital.status]

                  return (
                    <button
                      key={hospital.id}
                      type="button"
                      onClick={() => toggleHospital(hospital.id)}
                      style={{
                        width: '100%',
                        minHeight: '55px',
                        padding: '0 19px',
                        border: 0,
                        borderBottom:
                          index === selectedHospitals.length - 1
                            ? 0
                            : `1.5px solid ${lightTheme.background.elevated.alternative}`,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        gap: '16px',
                        textAlign: 'left',
                        background: lightTheme.background.normal.normal,
                        cursor: 'pointer',
                      }}
                    >
                      <span
                        style={{
                          minWidth: 0,
                          display: 'flex',
                          alignItems: 'center',
                          gap: '11px',
                        }}
                      >
                        <img
                          src={isSelected ? checkBoxFillIcon : checkBoxIcon}
                          alt=""
                          draggable="false"
                          style={{ width: '19px', height: '19px', flex: '0 0 auto' }}
                        />
                        <strong
                          style={{
                            minWidth: 0,
                            overflow: 'hidden',
                            color: lightTheme.label.normal,
                            fontSize: '14px',
                            fontWeight: 600,
                            lineHeight: 1.3,
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap',
                          }}
                        >
                          {hospital.name}
                        </strong>
                        <span
                          style={{
                            flex: '0 0 auto',
                            padding: '1.6px 7.2px',
                            borderRadius: '100px',
                            color: lightTheme.background.normal.normal,
                            fontSize: '11.2px',
                            fontWeight: 500,
                            lineHeight: 1.3,
                            background: statusInfo.color,
                          }}
                        >
                          {statusInfo.label}
                        </span>
                      </span>

                      <span
                        style={{
                          flex: '0 0 auto',
                          color: lightTheme.label.neutral,
                          fontSize: '14px',
                          fontWeight: 500,
                          lineHeight: 1.3,
                        }}
                      >
                        {hospital.distanceKm}km
                      </span>
                    </button>
                  )
                })}
              </div>
            </section>

            <section aria-labelledby="transfer-info-title" style={{ display: 'grid', gap: '16px' }}>
              <SectionTitle id="transfer-info-title">정보</SectionTitle>

              <div
                style={{
                  borderRadius: '10px',
                  overflow: 'hidden',
                  background: lightTheme.background.normal.normal,
                }}
              >
                {informationRows.map((row, index) => (
                  <div
                    key={row.label}
                    style={{
                      minHeight: '55px',
                      padding: '0 19px',
                      borderBottom:
                        index === informationRows.length - 1
                          ? 0
                          : `1.5px solid ${lightTheme.background.elevated.alternative}`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      gap: '16px',
                      color: lightTheme.label.normal,
                      fontSize: '14px',
                      lineHeight: 1.3,
                    }}
                  >
                    <strong style={{ flex: '0 0 auto', fontWeight: 600 }}>{row.label}</strong>
                    <span
                      style={{
                        minWidth: 0,
                        overflow: 'hidden',
                        color: lightTheme.label.neutral,
                        fontWeight: 500,
                        textAlign: 'right',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      {row.value}
                    </span>
                  </div>
                ))}
              </div>
            </section>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setIsHospitalResponseOpen(true)}
          style={{
            position: 'absolute',
            left: '20px',
            right: '20px',
            bottom: '12px',
            height: '42px',
            border: 0,
            borderRadius: '10px',
            color: lightTheme.background.elevated.normal,
            fontSize: '18px',
            fontWeight: 500,
            lineHeight: 1.3,
            background: lightTheme.primary.normal,
            boxShadow: '0 -2px 7px rgb(0 0 0 / 5%)',
            cursor: 'pointer',
          }}
        >
          수용 요청 보내기
        </button>
      </section>
    </main>
  )
}
