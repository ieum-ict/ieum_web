import { lightTheme } from '@ict/design-tokens'
import { hospitalSearchMapImage, hospitalSearchPinIcon } from '../../../shared/config/assets'
import { createThemeVars } from '../../../shared/lib/theme'
import { HospitalRecommendCard } from './HospitalRecommendCard'
import type { HospitalRecommendCardProps } from './HospitalRecommendCard'

type MedicalResource = {
  id: string
  label: string
}

type HospitalRecommendation = HospitalRecommendCardProps & {
  id: number
}

const medicalResources: MedicalResource[] = [
  { id: 'obstetrician', label: '산부인과 전문의' },
  { id: 'neonatologist', label: '신생아 전문의' },
  { id: 'operation-room', label: '응급 수술실' },
  { id: 'nicu', label: 'NICU' },
  { id: 'transfusion', label: '수혈' },
]

const hospitalRecommendations: HospitalRecommendation[] = [
  {
    id: 1,
    name: 'A대학교병원',
    status: 'available',
    distanceKm: 18,
    travelMinutes: 16,
    nicuAvailable: 20,
    nicuTotal: 24,
    hasOperatingRoom: true,
    hasTransfusion: true,
  },
  {
    id: 2,
    name: '청주여성병원',
    status: 'conditional',
    distanceKm: 21,
    travelMinutes: 19,
    nicuAvailable: 12,
    nicuTotal: 18,
    hasOperatingRoom: true,
    hasTransfusion: false,
  },
  {
    id: 3,
    name: '충북권역의료센터',
    status: 'available',
    distanceKm: 24,
    travelMinutes: 23,
    nicuAvailable: 18,
    nicuTotal: 22,
    hasOperatingRoom: true,
    hasTransfusion: true,
  },
  {
    id: 4,
    name: '상당종합병원',
    status: 'unavailable',
    distanceKm: 27,
    travelMinutes: 28,
    nicuAvailable: 0,
    nicuTotal: 12,
    hasOperatingRoom: false,
    hasTransfusion: false,
  },
]

export function HospitalPage() {
  return (
    <div style={createThemeVars()}>
      <main className="transport-page">
        <header className="transport-header">
          <h1>병원 검색 결과</h1>
        </header>

        <section
          aria-label="병원 검색 결과"
          style={{
            minHeight: 0,
            flex: '1 1 auto',
            overflowY: 'auto',
            padding: '27px 20px 28px',
            background: 'var(--fill-alternative)',
          }}
        >
          <div
            style={{
              display: 'grid',
              gap: '28px',
            }}
          >
            <section
              aria-labelledby="hospital-location-title"
              style={{
                display: 'grid',
                gap: '10px',
              }}
            >
              <h2
                id="hospital-location-title"
                style={{
                  margin: '0 10px',
                  color: lightTheme.label.normal,
                  fontSize: '18px',
                  fontWeight: 600,
                  lineHeight: 1.3,
                }}
              >
                필요 의료자원
              </h2>

              <div
                style={{
                  position: 'relative',
                  height: '177px',
                  border: `1.5px solid ${lightTheme.label.disable}`,
                  borderRadius: '16px',
                  overflow: 'hidden',
                  background: lightTheme.background.elevated.normal,
                }}
              >
                <img
                  src={hospitalSearchMapImage}
                  alt=""
                  draggable="false"
                  style={{
                    position: 'absolute',
                    left: '-104px',
                    top: '-203px',
                    width: '515px',
                    height: '708px',
                    maxWidth: 'none',
                    objectFit: 'cover',
                    pointerEvents: 'none',
                  }}
                />

                <img
                  src={hospitalSearchPinIcon}
                  alt=""
                  draggable="false"
                  style={{
                    position: 'absolute',
                    left: '154px',
                    top: '44px',
                    width: '62px',
                    height: '62px',
                    pointerEvents: 'none',
                  }}
                />

                <span
                  style={{
                    position: 'absolute',
                    right: '8px',
                    bottom: '8px',
                    padding: '0 6px',
                    borderRadius: '99px',
                    color: lightTheme.background.elevated.normal,
                    fontSize: '16px',
                    fontWeight: 500,
                    lineHeight: '22px',
                    background: 'rgb(0 0 0 / 24%)',
                  }}
                >
                  드래그하여 위치 수정
                </span>
              </div>
            </section>

            <section
              aria-labelledby="hospital-resource-title"
              style={{
                display: 'grid',
                gap: '10px',
                minWidth: 0,
              }}
            >
              <h2
                id="hospital-resource-title"
                style={{
                  margin: '0 10px',
                  color: lightTheme.label.normal,
                  fontSize: '18px',
                  fontWeight: 600,
                  lineHeight: 1.3,
                }}
              >
                필요 의료자원
              </h2>

              <div
                aria-label="필요 의료자원 목록"
                style={{
                  display: 'flex',
                  gap: '10px',
                  minWidth: 0,
                  margin: '0 -20px',
                  padding: '0 20px',
                  overflowX: 'auto',
                  scrollbarWidth: 'none',
                }}
              >
                {medicalResources.map((resource) => (
                  <span
                    key={resource.id}
                    style={{
                      flex: '0 0 auto',
                      padding: '5px 10px',
                      borderRadius: '100px',
                      color: lightTheme.primary.normal,
                      fontSize: '14px',
                      fontWeight: 500,
                      lineHeight: 1.3,
                      background: lightTheme.label.disable,
                    }}
                  >
                    {resource.label}
                  </span>
                ))}
              </div>
            </section>

            <section
              aria-labelledby="hospital-recommend-title"
              style={{
                display: 'grid',
                gap: '10px',
              }}
            >
              <h2
                id="hospital-recommend-title"
                style={{
                  margin: '0 4px',
                  color: lightTheme.label.normal,
                  fontSize: '18px',
                  fontWeight: 600,
                  lineHeight: 1.3,
                }}
              >
                병원 추천
              </h2>

              <div
                style={{
                  display: 'grid',
                  gap: '12px',
                }}
              >
                {hospitalRecommendations.map(({ id, ...hospital }) => (
                  <HospitalRecommendCard key={id} {...hospital} />
                ))}
              </div>
            </section>
          </div>
        </section>
      </main>
    </div>
  )
}
