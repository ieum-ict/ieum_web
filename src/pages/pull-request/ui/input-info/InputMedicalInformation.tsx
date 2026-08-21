import { useState } from 'react'
import { lightTheme } from '@ict/design-tokens'
import { chevronIcon } from '../../../../shared/config/assets'
import { InputFinalInformation } from './InputFinalInformation'

type InputMedicalInformationProps = {
  onBack: () => void
  onSave: () => void
}

type BleedingLevel = 'none' | 'little' | 'many'

function MedicalInputField({
  label,
  unit,
  placeholder,
}: {
  label: string
  unit: string
  placeholder: string
}) {
  const [inputValue, setInputValue] = useState('')
  const hasValue = inputValue.length > 0

  return (
    <label style={{ display: 'grid', gap: '6px' }}>
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
          className="input-information__input"
          type="text"
          value={inputValue}
          placeholder={placeholder}
          onChange={(event) => setInputValue(event.target.value)}
          style={{
            width: '100%',
            minWidth: 0,
            padding: 0,
            border: 0,
            color: hasValue ? lightTheme.label.strong : lightTheme.label.assistive,
            fontSize: '16px',
            fontWeight: 400,
            lineHeight: 1.3,
            background: 'transparent',
            outline: 'none',
          }}
        />
        <strong
          style={{
            flex: '0 0 auto',
            color: hasValue ? lightTheme.label.strong : lightTheme.label.assistive,
            fontSize: '18px',
            fontWeight: 600,
            lineHeight: 1.3,
          }}
        >
          {unit}
        </strong>
      </div>
    </label>
  )
}

export function InputMedicalInformation({ onBack, onSave }: InputMedicalInformationProps) {
  const [selectedBleedingLevel, setSelectedBleedingLevel] = useState<BleedingLevel>('none')
  const [isFinalStepOpen, setIsFinalStepOpen] = useState(false)

  const getBleedingButtonStyle = (level: BleedingLevel) => {
    const isSelected = selectedBleedingLevel === level

    return {
      height: '42px',
      border: `1px solid ${isSelected ? lightTheme.primary.normal : lightTheme.label.disable}`,
      borderRadius: '100px',
      color: isSelected ? lightTheme.primary.normal : lightTheme.label.assistive,
      fontSize: '16px',
      fontWeight: isSelected ? 500 : 400,
      lineHeight: 1.3,
      background: lightTheme.background.elevated.normal,
      cursor: 'pointer',
    }
  }

  if (isFinalStepOpen) {
    return <InputFinalInformation onBack={() => setIsFinalStepOpen(false)} onSave={onSave} />
  }

  return (
    <main className="transport-page">
      <header className="update-header">
        <button className="update-header__back" type="button" aria-label="이전 정보 입력으로 돌아가기" onClick={onBack}>
          <img src={chevronIcon} alt="" draggable="false" />
        </button>
        <h1>정보 입력</h1>
      </header>

      <section
        aria-label="전원 요청 의료 정보 입력"
        style={{
          minHeight: 0,
          flex: '1 1 auto',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: '0 26px 16px',
          background: lightTheme.background.normal.normal,
        }}
      >
        <div style={{ display: 'grid', gap: '36px' }}>
          <div
            aria-label="입력 단계 2 / 3"
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
              <span style={{ height: '6px', borderRadius: '100px', background: lightTheme.primary.normal }} />
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
              <span style={{ color: lightTheme.primary.strong }}>2</span>
              <span style={{ color: lightTheme.interaction.inactive }}>/</span>
              <span style={{ color: lightTheme.interaction.inactive }}>3</span>
            </div>
          </div>

          <div style={{ display: 'grid', gap: '26px' }}>
            <MedicalInputField label="혈압" placeholder="혈압을 입력해주세요" unit="mmHg" />
            <MedicalInputField label="맥박" placeholder="맥박을 입력해주세요" unit="bpm" />
            <MedicalInputField label="산소포화도" placeholder="산소포화도를 입력해주세요" unit="%" />

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
                출혈
              </span>
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(3, minmax(0, 1fr))',
                  gap: '10px',
                }}
              >
                <button
                  type="button"
                  aria-pressed={selectedBleedingLevel === 'none'}
                  onClick={() => setSelectedBleedingLevel('none')}
                  style={getBleedingButtonStyle('none')}
                >
                  없음
                </button>
                <button
                  type="button"
                  aria-pressed={selectedBleedingLevel === 'little'}
                  onClick={() => setSelectedBleedingLevel('little')}
                  style={getBleedingButtonStyle('little')}
                >
                  조금
                </button>
                <button
                  type="button"
                  aria-pressed={selectedBleedingLevel === 'many'}
                  onClick={() => setSelectedBleedingLevel('many')}
                  style={getBleedingButtonStyle('many')}
                >
                  많이
                </button>
              </div>
            </div>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setIsFinalStepOpen(true)}
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
