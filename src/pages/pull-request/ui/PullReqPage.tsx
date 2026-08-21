import { createThemeVars } from '../../../shared/lib/theme'
import '../../../App.css'
import {lightTheme} from "@ict/design-tokens";

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
                  위험 임산부
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
                    background: lightTheme.primary.normal,
                  }}
                >
                  진행중
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
                28주 1일 · 출혈, 진통
              </p>
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: '12px',
                }}>
                    <p
                    style={{
                        margin: 0,
                        color: lightTheme.label.alternative,
                        fontSize: '15px',
                        fontWeight: 500,
                        lineHeight: 1.45,
                    }}
                >
                    청주시 상당구
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
                        요청 10분전
                    </p>
                </div>

            </article>


          </div>
        </section>
      </main>
    </div>
  )
}
