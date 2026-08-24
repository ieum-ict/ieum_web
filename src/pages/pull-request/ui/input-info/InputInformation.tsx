import { useState } from 'react'
import { lightTheme } from '@ict/design-tokens'
import { chevronIcon } from '../../../../shared/config/assets'
import { defaultRequestDraftForm, validateBasicRequestDraftForm } from '../../model/requestDraftForm'
import type { FetusType, RequestDraftForm } from '../../model/requestDraftForm'
import { InputMedicalInformation } from './InputMedicalInformation'

type InputInformationProps = {
  onBack: () => void
  onSave: (form: RequestDraftForm) => void
  isSaving?: boolean
  saveError?: string | null
}

function InputField({
  label,
  value,
  onChange,
  unit,
  placeholder,
  width = '100%',
}: {
  label?: string
  value: string
  onChange: (value: string) => void
  unit?: string
  placeholder?: string
  width?: string
}) {
  const hasValue = value.length > 0

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
          className="input-information__input"
          type="text"
          value={value}
          placeholder={placeholder}
          onChange={(event) => onChange(event.target.value)}
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
        {unit && (
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
        )}
      </div>
    </label>
  )
}

export function InputInformation({ onBack, onSave, isSaving = false, saveError = null }: InputInformationProps) {
  const [form, setForm] = useState<RequestDraftForm>(defaultRequestDraftForm)
  const [currentStep, setCurrentStep] = useState<1 | 2>(1)
  const [stepError, setStepError] = useState<string | null>(null)

  const updateForm = (patch: Partial<RequestDraftForm>) => {
    setStepError(null)
    setForm((currentValue) => ({ ...currentValue, ...patch }))
  }

  const openMedicalStep = () => {
    const validationError = validateBasicRequestDraftForm(form)

    if (validationError) {
      setStepError(validationError)
      return
    }

    setStepError(null)
    setCurrentStep(2)
  }

  const setFetusType = (type: FetusType) => updateForm({ fetusType: type })

  const getFetusTypeButtonStyle = (type: FetusType) => {
    const isSelected = form.fetusType === type

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

  if (currentStep === 2) {
    return (
      <InputMedicalInformation
        onBack={() => setCurrentStep(1)}
        onSave={onSave}
        form={form}
        updateForm={updateForm}
        isSaving={isSaving}
        saveError={saveError}
      />
    )
  }

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
          overflowY: 'auto',
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
            <InputField
              label="환자 이름"
              placeholder="환자 이름을 입력해주세요"
              value={form.patientName}
              onChange={(value) => updateForm({ patientName: value })}
            />

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
                <InputField
                  placeholder="임신 주수"
                  unit="주"
                  value={form.pregnancyWeeks}
                  onChange={(value) => updateForm({ pregnancyWeeks: value })}
                />
                <InputField
                  placeholder="임신 일수"
                  unit="일"
                  value={form.pregnancyDays}
                  onChange={(value) => updateForm({ pregnancyDays: value })}
                />
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
                  aria-pressed={form.fetusType === 'single'}
                  onClick={() => setFetusType('single')}
                  style={getFetusTypeButtonStyle('single')}
                >
                  단태아
                </button>
                <button
                  type="button"
                  aria-pressed={form.fetusType === 'multiple'}
                  onClick={() => setFetusType('multiple')}
                  style={getFetusTypeButtonStyle('multiple')}
                >
                  다태아
                </button>
              </div>
            </div>

            <InputField
              label="연령대"
              placeholder="나이를 입력해주세요"
              unit="세"
              value={form.age}
              onChange={(value) => updateForm({ age: value })}
            />
            <InputField
              label="현재 위치"
              placeholder="현재 위치를 입력해주세요"
              value={form.currentLocation}
              onChange={(value) => updateForm({ currentLocation: value })}
            />
          </div>
        </div>

        <div style={{ display: 'grid', gap: '10px' }}>
          {stepError && (
            <p
              style={{
                margin: 0,
                padding: '0 4px',
                color: lightTheme.status.destructive,
                fontSize: '14px',
                fontWeight: 500,
                lineHeight: 1.3,
              }}
            >
              {stepError}
            </p>
          )}

          <button
            type="button"
            onClick={openMedicalStep}
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
        </div>
      </section>
    </main>
  )
}
