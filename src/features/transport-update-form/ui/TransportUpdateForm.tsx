import type { ChangeEvent } from 'react'
import { severityLabels } from '../../../entities/transport/model/constants'
import type { Severity, SeverityField, UpdateFormData } from '../../../entities/transport/model/types'
import { chevronIcon } from '../../../shared/config/assets'
import { BottomNavigation, type NavigationTab } from '../../../widgets/bottom-navigation/ui/BottomNavigation'

type TransportUpdateFormProps = {
  draftUpdateForm: UpdateFormData
  onBack: () => void
  onSubmit: () => void
  onFieldChange: (field: keyof UpdateFormData, value: string) => void
  onSeverityChange: (field: SeverityField, value: Severity) => void
  onTabChange: (tab: NavigationTab) => void
}

function renderTextInput(
  field: keyof UpdateFormData,
  value: string,
  label: string,
  unit: string,
  onFieldChange: TransportUpdateFormProps['onFieldChange'],
) {
  return (
    <label className="update-field">
      <span>{label}</span>
      <div className="update-field__input">
        <input
          type="text"
          inputMode="numeric"
          value={value}
          onChange={(event: ChangeEvent<HTMLInputElement>) => onFieldChange(field, event.target.value)}
          aria-label={label}
        />
        <strong>{unit}</strong>
      </div>
    </label>
  )
}

export function TransportUpdateForm({
  draftUpdateForm,
  onBack,
  onSubmit,
  onFieldChange,
  onSeverityChange,
  onTabChange,
}: TransportUpdateFormProps) {
  return (
    <main className="transport-page transport-page--update">
      <header className="update-header">
        <button
          className="update-header__back"
          type="button"
          aria-label="이송 경로 확인으로 돌아가기"
          onClick={onBack}
        >
          <img src={chevronIcon} alt="" draggable="false" />
        </button>
        <h1>업데이트</h1>
      </header>

      <section className="update-form" aria-label="업데이트 입력">
        <div className="update-form__scroll">
          <label className="update-field">
            <span>혈압</span>
            <div className="update-field__input">
              <div className="update-field__duo">
                <input
                  type="text"
                  inputMode="numeric"
                  value={draftUpdateForm.bloodPressureSystolic}
                  onChange={(event) => onFieldChange('bloodPressureSystolic', event.target.value)}
                  aria-label="수축기 혈압"
                />
                <span>/</span>
                <input
                  type="text"
                  inputMode="numeric"
                  value={draftUpdateForm.bloodPressureDiastolic}
                  onChange={(event) => onFieldChange('bloodPressureDiastolic', event.target.value)}
                  aria-label="이완기 혈압"
                />
              </div>
              <strong>mmHg</strong>
            </div>
          </label>

          {renderTextInput('pulse', draftUpdateForm.pulse, '맥박', 'bpm', onFieldChange)}

          <div className="update-choice-group">
            <span>진통</span>
            <div className="update-choice-group__options">
              {Object.entries(severityLabels).map(([value, label]) => (
                <button
                  key={value}
                  className={draftUpdateForm.pain === value ? 'is-selected' : ''}
                  type="button"
                  onClick={() => onSeverityChange('pain', value as Severity)}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          {renderTextInput('oxygenSaturation', draftUpdateForm.oxygenSaturation, '산소포화도', '%', onFieldChange)}

          <div className="update-choice-group">
            <span>출혈</span>
            <div className="update-choice-group__options">
              {Object.entries(severityLabels).map(([value, label]) => (
                <button
                  key={value}
                  className={draftUpdateForm.bleeding === value ? 'is-selected' : ''}
                  type="button"
                  onClick={() => onSeverityChange('bleeding', value as Severity)}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          <div className="update-choice-group">
            <span>양수 파수</span>
            <div className="update-choice-group__options">
              {Object.entries(severityLabels).map(([value, label]) => (
                <button
                  key={value}
                  className={draftUpdateForm.amnioticFluidLeak === value ? 'is-selected' : ''}
                  type="button"
                  onClick={() => onSeverityChange('amnioticFluidLeak', value as Severity)}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          {renderTextInput('fetalHeartRate', draftUpdateForm.fetalHeartRate, '태아 심박수', 'bpm', onFieldChange)}
        </div>

        <div className="update-form__footer">
          <button className="update-form__submit" type="button" onClick={onSubmit}>
            업데이트
          </button>
        </div>
      </section>

      <BottomNavigation activeTab="transfer" onTabChange={onTabChange} />
    </main>
  )
}
