import type { ReactNode } from 'react'
import {
  chevronIcon,
  hospitalIcon,
  settingsCameraIcon,
  settingsDropdownIcon,
  settingsInformationIcon,
  settingsPlusIcon,
  settingsProfileBodyIcon,
  settingsProfileHeadIcon,
} from '../../../shared/config/assets'
import { hospitalTypeOptions } from '../../../entities/transport/model/constants'
import type {
  HospitalAcceptance,
  HospitalAddForm,
  HospitalManagementItem,
  HospitalType,
  NotificationSettingItem,
} from '../../../entities/transport/model/types'
import { BottomNavigation, type NavigationTab } from '../../bottom-navigation/ui/BottomNavigation'

type SharedProps = {
  onTabChange: (tab: NavigationTab) => void
  onBack: () => void
}

type AlertSettingsPageProps = SharedProps & {
  items: NotificationSettingItem[]
  onToggle: (id: string) => void
  onCancel: () => void
  onSave: () => void
}

type HospitalManagementPageProps = SharedProps & {
  items: HospitalManagementItem[]
  onAddHospital: () => void
  onOpenHospitalDetail: (hospitalId: string) => void
}

type HospitalAddPageProps = SharedProps & {
  step: number
  form: HospitalAddForm
  isTypeOpen: boolean
  onFieldChange: (field: keyof HospitalAddForm, value: string) => void
  onToggleTypeOpen: () => void
  onSelectType: (value: HospitalType) => void
  onNext: () => void
  onSubmit: () => void
  onBooleanChange: (field: 'transfusionAvailable' | 'emergencySurgeryAvailable', value: boolean) => void
  onAvailabilityChange: (value: HospitalAddForm['availability']) => void
}

type ProfileEditPageProps = SharedProps

type HospitalDetailPageProps = SharedProps & {
  item: HospitalManagementItem
  onClose: () => void
  onSave: () => void
}

function SettingsSubHeader({ title, onBack }: { title: string; onBack: () => void }) {
  return (
    <header className="settings-subpage__header">
      <button className="settings-subpage__back" type="button" onClick={onBack} aria-label={`${title} 뒤로가기`}>
        <img src={chevronIcon} alt="" draggable="false" />
      </button>
      <h1>{title}</h1>
    </header>
  )
}

function SettingsShell({
  title,
  onBack,
  onTabChange,
  children,
}: SharedProps & { title: string; children: ReactNode }) {
  return (
    <main className="settings-subpage">
      <SettingsSubHeader title={title} onBack={onBack} />
      <section className="settings-subpage__content">{children}</section>
      <BottomNavigation activeTab="setting" onTabChange={onTabChange} />
    </main>
  )
}

function StatusBadge({ status }: { status: HospitalAcceptance }) {
  const config = {
    available: { label: '수용 가능', className: 'is-available' },
    conditional: { label: '조건부 수용', className: 'is-conditional' },
    examine: { label: '전문의 검토', className: 'is-examine' },
  }[status]

  return <span className={`hospital-management-card__status ${config.className}`}>{config.label}</span>
}

function StepProgress({ step }: { step: number }) {
  return (
    <div className="hospital-add-progress">
      <div className="hospital-add-progress__bars" aria-hidden="true">
        {[1, 2, 3].map((item) => (
          <span key={item} className={item <= step ? 'is-active' : ''} />
        ))}
      </div>
      <div className="hospital-add-progress__count">
        <strong>{step}</strong>
        <span>/ 3</span>
      </div>
    </div>
  )
}

function StepField({
  label,
  children,
}: {
  label: string
  children: React.ReactNode
}) {
  return (
    <label className="hospital-add-field">
      <span>{label}</span>
      {children}
    </label>
  )
}

function InlineUnitInput({
  value,
  unit,
  onChange,
}: {
  value: string
  unit: string
  onChange: (value: string) => void
}) {
  return (
    <div className="hospital-add-input hospital-add-input--with-unit">
      <input type="text" value={value} onChange={(event) => onChange(event.target.value)} inputMode="numeric" />
      <strong>{unit}</strong>
    </div>
  )
}

function SegmentedBoolean({
  selected,
  onChange,
}: {
  selected: boolean
  onChange: (value: boolean) => void
}) {
  return (
    <div className="hospital-add-segmented hospital-add-segmented--two">
      <button className={selected ? 'is-selected' : ''} type="button" onClick={() => onChange(true)}>
        가능
      </button>
      <button className={!selected ? 'is-selected' : ''} type="button" onClick={() => onChange(false)}>
        불가능
      </button>
    </div>
  )
}

function SegmentedAvailability({
  selected,
  onChange,
}: {
  selected: HospitalAddForm['availability']
  onChange: (value: HospitalAddForm['availability']) => void
}) {
  return (
    <div className="hospital-add-segmented hospital-add-segmented--three">
      <button className={selected === 'available' ? 'is-selected' : ''} type="button" onClick={() => onChange('available')}>
        수용 가능
      </button>
      <button className={selected === 'conditional' ? 'is-selected' : ''} type="button" onClick={() => onChange('conditional')}>
        조건부 수용
      </button>
      <button className={selected === 'unavailable' ? 'is-selected' : ''} type="button" onClick={() => onChange('unavailable')}>
        수용 불가
      </button>
    </div>
  )
}

export function AlertSettingsPage({
  items,
  onToggle,
  onCancel,
  onSave,
  onBack,
  onTabChange,
}: AlertSettingsPageProps) {
  return (
    <SettingsShell title="알림 설정" onBack={onBack} onTabChange={onTabChange}>
      <div className="alert-settings-page">
        <div className="alert-settings-page__list">
          {items.map((item) => (
            <div key={item.id} className="alert-settings-item">
              <div className="alert-settings-item__copy">
                <strong>{item.title}</strong>
                <span>{item.description}</span>
              </div>
              <button
                className={`alert-settings-toggle ${item.enabled ? 'is-on' : ''}`}
                type="button"
                aria-pressed={item.enabled}
                onClick={() => onToggle(item.id)}
              >
                <span />
              </button>
            </div>
          ))}
        </div>

        <div className="alert-settings-page__notice">
          <img src={settingsInformationIcon} alt="" draggable="false" />
          <p>
            푸시 알림은 기기 설정에서 허용하셔야
            <br />
            정상적으로 수신됩니다.
          </p>
        </div>

        <div className="alert-settings-page__actions">
          <button className="settings-action settings-action--secondary" type="button" onClick={onCancel}>
            닫기
          </button>
          <button className="settings-action settings-action--primary" type="button" onClick={onSave}>
            저장
          </button>
        </div>
      </div>
    </SettingsShell>
  )
}

export function HospitalManagementPage({
  items,
  onAddHospital,
  onOpenHospitalDetail,
  onBack,
  onTabChange,
}: HospitalManagementPageProps) {
  return (
    <SettingsShell title="병원 정보 관리" onBack={onBack} onTabChange={onTabChange}>
      <div className="hospital-management-page">
        <div className="hospital-management-page__title">
          <strong>등록 병원</strong>
          <span>({items.length}곳)</span>
        </div>

        <div className="hospital-management-page__list">
          {items.map((item) => (
            <button
              key={item.id}
              className="hospital-management-card"
              type="button"
              onClick={() => onOpenHospitalDetail(item.id)}
            >
              <div className="hospital-management-card__title-row">
                <div className="hospital-management-card__title">
                  <img src={hospitalIcon} alt="" draggable="false" />
                  <strong>{item.name}</strong>
                </div>
                <StatusBadge status={item.status} />
              </div>

              <div className="hospital-management-card__meta">
                <span>{item.distance}</span>
                <span>·</span>
                <span>{item.travelTime}</span>
                <img src={chevronIcon} alt="" draggable="false" />
              </div>

              <div className="hospital-management-card__detail">
                <span>{item.obstetricians}</span>
                <span>·</span>
                <span>{item.nicuBeds}</span>
                <span>·</span>
                <span>{item.operatingRooms}</span>
              </div>
            </button>
          ))}
        </div>

        <button className="hospital-management-page__add" type="button" onClick={onAddHospital} aria-label="병원 추가">
          <img src={settingsPlusIcon} alt="" draggable="false" />
        </button>
      </div>
    </SettingsShell>
  )
}

function DetailRow({ label, value }: { label: string; value: string | ReactNode }) {
  return (
    <div className="hospital-detail-row">
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  )
}

export function HospitalDetailPage({
  item,
  onBack,
  onClose,
  onSave,
  onTabChange,
}: HospitalDetailPageProps) {
  return (
    <SettingsShell title="자원 상세" onBack={onBack} onTabChange={onTabChange}>
      <div className="hospital-detail-page">
        <div className="hospital-detail-page__content">
          <div className="hospital-detail-page__summary">
            <DetailRow label="병원명" value={`${item.name}${item.branch ? ` (${item.branch})` : ''}`} />
            <DetailRow label="거리" value={item.distance} />
          </div>

          <section className="hospital-detail-page__panel">
            <h2>자원 현황</h2>
            <div className="hospital-detail-page__list">
              <DetailRow label="산부인과 전문의" value={item.obstetricians.replace('산부인과 전문의 ', '')} />
              <DetailRow label="신생아 전문의" value={item.neonatologists ?? '7명'} />
              <DetailRow label="마취과 전문의" value={item.anesthesiologists ?? '6명'} />
              <DetailRow label="수술실" value={item.operatingRooms.replace('수술실 ', '')} />
              <DetailRow label="분만실" value={item.deliveryRooms ?? '6개'} />
              <DetailRow label="NICU 병상" value={item.nicuBeds.replace('NICU병상 ', '')} />
              <DetailRow label="인큐베이터" value={item.incubators ?? '6개'} />
              <div className="hospital-detail-row hospital-detail-row--toggle">
                <span>수혈 가능 여부</span>
                <button
                  className={`alert-settings-toggle ${item.transfusionAvailable !== false ? 'is-on' : ''}`}
                  type="button"
                  aria-pressed={item.transfusionAvailable !== false}
                >
                  <span />
                </button>
              </div>
            </div>
          </section>
        </div>

        <div className="hospital-detail-page__actions">
          <button className="settings-action settings-action--secondary" type="button" onClick={onClose}>
            닫기
          </button>
          <button className="settings-action settings-action--primary" type="button" onClick={onSave}>
            저장
          </button>
        </div>
      </div>
    </SettingsShell>
  )
}

export function HospitalAddPage({
  step,
  form,
  isTypeOpen,
  onFieldChange,
  onToggleTypeOpen,
  onSelectType,
  onNext,
  onSubmit,
  onBooleanChange,
  onAvailabilityChange,
  onBack,
  onTabChange,
}: HospitalAddPageProps) {
  const isStepOneValid = form.name.trim() !== '' && form.address.trim() !== '' && form.contact.trim() !== ''

  return (
    <SettingsShell title="병원 추가" onBack={onBack} onTabChange={onTabChange}>
      <div className="hospital-add-page">
        <StepProgress step={step} />

        {step === 1 && (
          <div className="hospital-add-page__form">
            <div className="hospital-add-page__fields">
              <StepField label="병원명">
                <div className="hospital-add-input">
                  <input
                    type="text"
                    value={form.name}
                    placeholder="병원명을 입력하세요."
                    onChange={(event) => onFieldChange('name', event.target.value)}
                  />
                </div>
              </StepField>

              <StepField label="병원 유형">
                <div className={`hospital-add-select ${isTypeOpen ? 'is-open' : ''}`}>
                  <button className="hospital-add-select__trigger" type="button" onClick={onToggleTypeOpen}>
                    <span className={!form.type ? 'is-placeholder' : undefined}>{form.type || '선택하세요'}</span>
                    <img src={settingsDropdownIcon} alt="" draggable="false" />
                  </button>

                  {isTypeOpen && (
                    <div className="hospital-add-select__menu">
                      {hospitalTypeOptions.map((option) => (
                        <button key={option} type="button" onClick={() => onSelectType(option)}>
                          {option}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </StepField>

              <StepField label="주소">
                <div className="hospital-add-input">
                  <input
                    type="text"
                    value={form.address}
                    placeholder="주소를 입력하세요"
                    onChange={(event) => onFieldChange('address', event.target.value)}
                  />
                </div>
              </StepField>

              <StepField label="대표 연락처">
                <div className="hospital-add-input">
                  <input
                    type="text"
                    value={form.contact}
                    placeholder="예) 02-1234-5678"
                    onChange={(event) => onFieldChange('contact', event.target.value)}
                  />
                </div>
              </StepField>

              <StepField label="메모 / 추가 정보">
                <div className="hospital-add-textarea">
                  <textarea
                    value={form.note}
                    placeholder="추가로 입력할 내용이 있다면 작성해주세요."
                    maxLength={200}
                    onChange={(event) => onFieldChange('note', event.target.value)}
                  />
                  <span>{form.note.length}/200</span>
                </div>
              </StepField>
            </div>

            <div className="hospital-add-page__footer">
              <button
                className="settings-action settings-action--primary hospital-add-page__submit"
                type="button"
                onClick={onNext}
                disabled={!isStepOneValid}
              >
                다음
              </button>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="hospital-add-page__form">
            <div className="hospital-add-page__fields">
              <StepField label="산부인과 전문의 수">
                <InlineUnitInput value={form.obstetricians} unit="명" onChange={(value) => onFieldChange('obstetricians', value)} />
              </StepField>
              <StepField label="신생아 전문의 수">
                <InlineUnitInput value={form.neonatologists} unit="명" onChange={(value) => onFieldChange('neonatologists', value)} />
              </StepField>
              <StepField label="마취과 전문의 수">
                <InlineUnitInput value={form.anesthesiologists} unit="명" onChange={(value) => onFieldChange('anesthesiologists', value)} />
              </StepField>
              <StepField label="수술실 수">
                <InlineUnitInput value={form.operatingRooms} unit="개" onChange={(value) => onFieldChange('operatingRooms', value)} />
              </StepField>
              <StepField label="분만실 수">
                <InlineUnitInput value={form.deliveryRooms} unit="개" onChange={(value) => onFieldChange('deliveryRooms', value)} />
              </StepField>
            </div>

            <div className="hospital-add-page__footer">
              <button className="settings-action settings-action--primary hospital-add-page__submit" type="button" onClick={onNext}>
                다음
              </button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="hospital-add-page__form">
            <div className="hospital-add-page__fields">
              <StepField label="NICU 병상 수">
                <InlineUnitInput value={form.nicuBeds} unit="개" onChange={(value) => onFieldChange('nicuBeds', value)} />
              </StepField>
              <StepField label="인큐베이터 수">
                <InlineUnitInput value={form.incubators} unit="개" onChange={(value) => onFieldChange('incubators', value)} />
              </StepField>
              <StepField label="수혈 가능 여부">
                <SegmentedBoolean
                  selected={form.transfusionAvailable}
                  onChange={(value) => onBooleanChange('transfusionAvailable', value)}
                />
              </StepField>
              <StepField label="응급 수술 가능 여부">
                <SegmentedBoolean
                  selected={form.emergencySurgeryAvailable}
                  onChange={(value) => onBooleanChange('emergencySurgeryAvailable', value)}
                />
              </StepField>
              <StepField label="수용 가능 상태">
                <SegmentedAvailability selected={form.availability} onChange={onAvailabilityChange} />
              </StepField>
            </div>

            <div className="hospital-add-page__footer">
              <button className="settings-action settings-action--primary hospital-add-page__submit" type="button" onClick={onSubmit}>
                등록 하기
              </button>
            </div>
          </div>
        )}
      </div>
    </SettingsShell>
  )
}

export function ProfileEditPage({ onBack, onTabChange }: ProfileEditPageProps) {
  return (
    <SettingsShell title="회원정보 수정" onBack={onBack} onTabChange={onTabChange}>
      <div className="profile-edit-page">
        <div className="profile-edit-page__avatar-wrap">
          <div className="settings-page__avatar" aria-hidden="true">
            <img className="settings-page__avatar-body" src={settingsProfileBodyIcon} alt="" draggable="false" />
            <img className="settings-page__avatar-head" src={settingsProfileHeadIcon} alt="" draggable="false" />
          </div>
          <button className="profile-edit-page__camera" type="button" aria-label="프로필 사진 변경">
            <img src={settingsCameraIcon} alt="" draggable="false" />
          </button>
        </div>

        <section className="profile-edit-section">
          <h2>기본 정보</h2>
          <div className="profile-edit-section__list">
            {[
              ['이름', '김지현'],
              ['역할', '이송 코디네이터'],
              ['소속', '서울대학교 병원'],
              ['부서/직책', '응급의료센터/간호사'],
            ].map(([label, value]) => (
              <div key={label} className="profile-edit-row">
                <span>{label}</span>
                <div>{value}</div>
              </div>
            ))}
          </div>
        </section>

        <section className="profile-edit-section">
          <h2>연락 정보</h2>
          <div className="profile-edit-section__list">
            {[
              ['이메일', 'rlawlgus@gmail.com'],
              ['연락처', '010-1234-5678'],
              ['비상 연락처', '010-5678-1234'],
              ['근무 지역', '서울특별시'],
            ].map(([label, value]) => (
              <div key={label} className="profile-edit-row">
                <span>{label}</span>
                <div>{value}</div>
              </div>
            ))}
          </div>
        </section>

        <button className="settings-action settings-action--primary profile-edit-page__submit" type="button">
          저장
        </button>
      </div>
    </SettingsShell>
  )
}
