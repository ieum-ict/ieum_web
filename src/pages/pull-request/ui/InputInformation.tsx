import { lightTheme } from '@ict/design-tokens'
import { chevronIcon } from '../../../shared/config/assets'

type InputInformationProps = {
  onBack: () => void
}

function InputField({
  label,
  value,
  unit,
  placeholder,
  width = '100%',
}: {
  label?: string
  value?: string
  unit?: string
  placeholder?: string
  width?: string
}) {
  return (
    <label
      style={{
        width,
        display: 'grid',
        gap: '6px',
      }}
    >
      {label && (
        <span
          style={{
            paddingLeft: '13px',
            color: lightTheme.label.alternative,
            fontSize: '16px',
            fontWeight: 500,
            lineHeight: 1.3,
          }}
        >
          {label}
        </span>
      )}
      <div
        style={{
          height: '42px',
          padding: '0 26px',
          borderRadius: '10px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          background: lightTheme.background.normal.alternative,
        }}
      >
        <input
          type="text"
          defaultValue={value}
          placeholder={placeholder}
          style={{
            width: '100%',
            minWidth: 0,
            padding: 0,
            border: 0,
            color: lightTheme.label.assistive,
            fontSize: '16px',
            fontWeight: 400,
            lineHeight: 1.3,
            background: 'transparent',
            outline: 'none',
          }}
        />
        {unit && (
          <strong
            style={{
              flex: '0 0 auto',
              color: lightTheme.label.assistive,
              fontSize: '18px',
              fontWeight: 600,
              lineHeight: 1.3,
            }}
          >
            {unit}
          </strong>
        )}
      </div>
    </label>
  )
}

export function InputInformation({ onBack }: InputInformationProps) {
  return (
    <main className="transport-page">
      <header className="update-header">
        <button className="update-header__back" type="button" aria-label="전원 요청 목록으로 돌아가기" onClick={onBack}>
          <img src={chevronIcon} alt="" draggable="false" />
        </button>
        <h1>정보 입력</h1>
      </header>

      <section
        aria-label="전원 요청 정보 입력"
        style={{
          minHeight: 0,
          flex: '1 1 auto',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: '0px 26px 16px',
          background: lightTheme.background.normal.normal,
        }}
      >
        <div
          style={{
            display: 'grid',
            gap: '36px',
          }}
        >
          <div
            aria-label="입력 단계 1 / 3"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '19px',
            }}
          >
            <div
              style={{
                flex: '1 1 auto',
                height: '24px',
                display: 'grid',
                gridTemplateColumns: 'repeat(3, 1fr)',
                alignItems: 'center',
                gap: '8px',
              }}
            >
              <span style={{ height: '6px', borderRadius: '100px', background: lightTheme.primary.normal }} />
              <span style={{ height: '6px', borderRadius: '100px', background: lightTheme.label.disable }} />
              <span style={{ height: '6px', borderRadius: '100px', background: lightTheme.label.disable }} />
            </div>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                fontSize: '20px',
                fontWeight: 500,
                lineHeight: 1.3,
              }}
            >
              <span style={{ color: lightTheme.primary.strong }}>1</span>
              <span style={{ color: lightTheme.interaction.inactive }}>/</span>
              <span style={{ color: lightTheme.interaction.inactive }}>3</span>
            </div>
          </div>

          <div
            style={{
              display: 'grid',
              gap: '26px',
            }}
          >
            <div style={{ display: 'grid', gap: '6px' }}>
              <span
                style={{
                  paddingLeft: '13px',
                  color: lightTheme.label.alternative,
                  fontSize: '16px',
                  fontWeight: 500,
                  lineHeight: 1.3,
                }}
              >
                임신 주수
              </span>
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
                  gap: '15px',
                }}
              >
                <InputField value="28" unit="주" />
                <InputField value="3" unit="일" />
              </div>
            </div>

            <div style={{ display: 'grid', gap: '12px' }}>
              <span
                style={{
                  paddingLeft: '13px',
                  color: lightTheme.label.alternative,
                  fontSize: '16px',
                  fontWeight: 500,
                  lineHeight: 1.3,
                }}
              >
                다태아 여부
              </span>
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
                  gap: '10px',
                }}
              >
                <button
                  type="button"
                  style={{
                    height: '42px',
                    border: `1px solid ${lightTheme.primary.normal}`,
                    borderRadius: '100px',
                    color: lightTheme.primary.normal,
                    fontSize: '16px',
                    fontWeight: 500,
                    lineHeight: 1.3,
                    background: lightTheme.background.elevated.normal,
                    cursor: 'pointer',
                  }}
                >
                  단태아
                </button>
                <button
                  type="button"
                  style={{
                    height: '42px',
                    border: `1px solid ${lightTheme.label.disable}`,
                    borderRadius: '100px',
                    color: lightTheme.label.assistive,
                    fontSize: '16px',
                    fontWeight: 400,
                    lineHeight: 1.3,
                    background: lightTheme.background.elevated.normal,
                    cursor: 'pointer',
                  }}
                >
                  다태아
                </button>
              </div>
            </div>

            <InputField label="연령대" value="32" unit="세" />
            <InputField label="현재 위치" placeholder="현재 위치를 입력해주세요" />
          </div>
        </div>

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
          다음
        </button>
      </section>
    </main>
  )
}
