import { useEffect, useId, useState, type ChangeEvent, type ReactNode } from 'react'
import {
  chevronIcon,
  hospitalIcon,
  settingsCameraIcon,
  settingsDropdownIcon,
  settingsInformationIcon,
  settingsPlusIcon,
  settingsProfileIcon,
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
  onSave: (item: HospitalManagementItem) => void
}

function SettingsShell({
  title,
  onBack,
  onTabChange,
  children,
  headerClassName,
}: SharedProps & { title: string; children: ReactNode; headerClassName?: string }) {
  return (
    <main className="settings-subpage">
      <header className={`settings-subpage__header${headerClassName ? ` ${headerClassName}` : ''}`}>
        <button className="settings-subpage__back" type="button" onClick={onBack} aria-label={`${title} 뒤로가기`}>
          <img src={chevronIcon} alt="" draggable="false" />
        </button>
        <h1>{title}</h1>
      </header>
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

function DetailInputRow({
  label,
  value,
  unit,
  onChange,
  onKeyDown,
  onBlur,
}: {
  label: string
  value: string
  unit?: string
  onChange: (value: string) => void
  onKeyDown: (event: React.KeyboardEvent<HTMLInputElement>) => void
  onBlur: (event: React.FocusEvent<HTMLInputElement>) => void
}) {
  return (
    <label className="hospital-detail-row hospital-detail-row--input">
      <span>{label}</span>
      <div className="hospital-detail-input">
        <input
          type="text"
          value={value}
          onChange={(event) => onChange(event.target.value)}
          onKeyDown={onKeyDown}
          onBlur={onBlur}
          inputMode="numeric"
        />
        {unit ? <strong>{unit}</strong> : null}
      </div>
    </label>
  )
}

export function HospitalDetailPage({
  item,
  onBack,
  onClose,
  onSave,
  onTabChange,
}: HospitalDetailPageProps) {
  const [draftItem, setDraftItem] = useState(item)

  useEffect(() => {
    setDraftItem(item)
  }, [item])

  const hasChanges = JSON.stringify(draftItem) !== JSON.stringify(item)

  const handleFieldChange = (field: keyof HospitalManagementItem, value: string) => {
    setDraftItem((currentValue) => ({
      ...currentValue,
      [field]: value,
    }))
  }

  const handleDetailFieldKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key !== 'Enter') {
      return
    }

    event.preventDefault()
    event.currentTarget.blur()
  }

  const handleDetailFieldBlur =
    (field: keyof HospitalManagementItem, prefix = '', suffix = '') =>
    (event: React.FocusEvent<HTMLInputElement>) => {
      const nextValue = event.currentTarget.value.trim()
      if (nextValue !== '') {
        return
      }

      handleFieldChange(field, `${prefix}0${suffix}`)
    }

  return (
    <SettingsShell title="자원 상세" onBack={onBack} onTabChange={onTabChange} headerClassName="hospital-detail-page__header">
      <div className="hospital-detail-page">
        <div className="hospital-detail-page__content">
          <div className="hospital-detail-page__summary">
            <DetailRow label="병원명" value={`${draftItem.name}${draftItem.branch ? ` (${draftItem.branch})` : ''}`} />
            <DetailRow label="거리" value={draftItem.distance} />
          </div>

          <section className="hospital-detail-page__panel">
            <h2>자원 현황</h2>
            <div className="hospital-detail-page__list">
              <DetailInputRow
                label="산부인과 전문의"
                value={draftItem.obstetricians.replace('산부인과 전문의 ', '').replace('명', '')}
                unit="명"
                onChange={(value) => handleFieldChange('obstetricians', `산부인과 전문의 ${value}명`)}
                onKeyDown={handleDetailFieldKeyDown}
                onBlur={handleDetailFieldBlur('obstetricians', '산부인과 전문의 ', '명')}
              />
              <DetailInputRow
                label="신생아 전문의"
                value={(draftItem.neonatologists ?? '7명').replace('명', '')}
                unit="명"
                onChange={(value) => handleFieldChange('neonatologists', `${value}명`)}
                onKeyDown={handleDetailFieldKeyDown}
                onBlur={handleDetailFieldBlur('neonatologists', '', '명')}
              />
              <DetailInputRow
                label="마취과 전문의"
                value={(draftItem.anesthesiologists ?? '6명').replace('명', '')}
                unit="명"
                onChange={(value) => handleFieldChange('anesthesiologists', `${value}명`)}
                onKeyDown={handleDetailFieldKeyDown}
                onBlur={handleDetailFieldBlur('anesthesiologists', '', '명')}
              />
              <DetailInputRow
                label="수술실"
                value={draftItem.operatingRooms.replace('수술실 ', '').replace('개', '')}
                unit="개"
                onChange={(value) => handleFieldChange('operatingRooms', `수술실 ${value}개`)}
                onKeyDown={handleDetailFieldKeyDown}
                onBlur={handleDetailFieldBlur('operatingRooms', '수술실 ', '개')}
              />
              <DetailInputRow
                label="분만실"
                value={(draftItem.deliveryRooms ?? '6개').replace('개', '')}
                unit="개"
                onChange={(value) => handleFieldChange('deliveryRooms', `${value}개`)}
                onKeyDown={handleDetailFieldKeyDown}
                onBlur={handleDetailFieldBlur('deliveryRooms', '', '개')}
              />
              <DetailInputRow
                label="NICU 병상"
                value={draftItem.nicuBeds.replace('NICU병상 ', '').replace('개', '')}
                unit="개"
                onChange={(value) => handleFieldChange('nicuBeds', `NICU병상 ${value}개`)}
                onKeyDown={handleDetailFieldKeyDown}
                onBlur={handleDetailFieldBlur('nicuBeds', 'NICU병상 ', '개')}
              />
              <DetailInputRow
                label="인큐베이터"
                value={(draftItem.incubators ?? '6개').replace('개', '')}
                unit="개"
                onChange={(value) => handleFieldChange('incubators', `${value}개`)}
                onKeyDown={handleDetailFieldKeyDown}
                onBlur={handleDetailFieldBlur('incubators', '', '개')}
              />
              <div className="hospital-detail-row hospital-detail-row--toggle">
                <span>수혈 가능 여부</span>
                <button
                  className={`alert-settings-toggle ${draftItem.transfusionAvailable !== false ? 'is-on' : ''}`}
                  type="button"
                  aria-pressed={draftItem.transfusionAvailable !== false}
                  onClick={() =>
                    setDraftItem((currentValue) => ({
                      ...currentValue,
                      transfusionAvailable: currentValue.transfusionAvailable === false,
                    }))
                  }
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
          <button
            className="settings-action settings-action--primary"
            type="button"
            onClick={() => onSave(draftItem)}
            disabled={!hasChanges}
          >
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
  const inputId = useId()
  const initialProfileForm = {
    name: '김지현',
    role: '이송 코디네이터',
    organization: '서울대학교 병원',
    department: '응급의료센터/간호사',
    email: 'rlawlgus@gmail.com',
    phone: '010-1234-5678',
    emergencyPhone: '010-5678-1234',
    region: '서울특별시',
  }
  const [savedProfilePreview, setSavedProfilePreview] = useState(settingsProfileIcon)
  const [profilePreview, setProfilePreview] = useState(settingsProfileIcon)
  const isCustomProfileImage = profilePreview !== settingsProfileIcon
  const [savedProfileForm, setSavedProfileForm] = useState(initialProfileForm)
  const [profileForm, setProfileForm] = useState(initialProfileForm)
  const [isSaveModalOpen, setIsSaveModalOpen] = useState(false)
  const hasProfileChanges =
    profilePreview !== savedProfilePreview ||
    Object.entries(savedProfileForm).some(([key, value]) => profileForm[key as keyof typeof savedProfileForm] !== value)

  useEffect(() => {
    return () => {
      if (profilePreview !== settingsProfileIcon) {
        URL.revokeObjectURL(profilePreview)
      }
    }
  }, [profilePreview])

  useEffect(() => {
    if (!isSaveModalOpen) {
      document.body.style.overflow = ''
      return
    }

    document.body.style.overflow = 'hidden'

    return () => {
      document.body.style.overflow = ''
    }
  }, [isSaveModalOpen])

  const handleProfileImageChange = (event: ChangeEvent<HTMLInputElement>) => {
    const nextFile = event.target.files?.[0]
    if (!nextFile) {
      return
    }

    setProfilePreview((currentValue) => {
      if (currentValue !== settingsProfileIcon) {
        URL.revokeObjectURL(currentValue)
      }

      return URL.createObjectURL(nextFile)
    })

    event.target.value = ''
  }

  const handleProfileFieldChange = (field: keyof typeof initialProfileForm, value: string) => {
    setProfileForm((currentValue) => ({
      ...currentValue,
      [field]: value,
    }))
  }

  const handleProfileFieldKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key !== 'Enter') {
      return
    }

    event.preventDefault()
    event.currentTarget.blur()
  }

  const handleProfileSubmit = () => {
    if (!hasProfileChanges) {
      return
    }

    setSavedProfileForm(profileForm)
    setSavedProfilePreview(profilePreview)
    setIsSaveModalOpen(true)
  }

  return (
    <SettingsShell title="회원정보 수정" onBack={onBack} onTabChange={onTabChange}>
      <div className="profile-edit-page">
        <div className="profile-edit-page__avatar-wrap">
          <input
            id={inputId}
            className="profile-edit-page__file-input"
            type="file"
            accept="image/*"
            onChange={handleProfileImageChange}
          />
          <label className="settings-page__avatar profile-edit-page__avatar-button" htmlFor={inputId} aria-label="프로필 사진 등록">
            <img
              className={`settings-page__avatar-image ${isCustomProfileImage ? 'is-photo' : ''}`}
              src={profilePreview}
              alt=""
              draggable="false"
            />
          </label>
          <label className="profile-edit-page__camera" htmlFor={inputId} aria-label="프로필 사진 변경">
            <img src={settingsCameraIcon} alt="" draggable="false" />
          </label>
        </div>

        <form
          className="profile-edit-page__form"
          onSubmit={(event) => {
            event.preventDefault()
            const activeElement = document.activeElement
            if (activeElement instanceof HTMLElement) {
              activeElement.blur()
            }
            handleProfileSubmit()
          }}
        >
          <section className="profile-edit-section">
            <h2>기본 정보</h2>
            <div className="profile-edit-section__list">
              {[
                ['이름', 'name'],
                ['역할', 'role'],
                ['소속', 'organization'],
                ['부서/직책', 'department'],
              ].map(([label, field]) => (
                <div key={label} className="profile-edit-row">
                  <span>{label}</span>
                  <input
                    type="text"
                    value={profileForm[field as keyof typeof initialProfileForm]}
                    onChange={(event) =>
                      handleProfileFieldChange(field as keyof typeof initialProfileForm, event.target.value)
                    }
                    onKeyDown={handleProfileFieldKeyDown}
                  />
                </div>
              ))}
            </div>
          </section>

          <section className="profile-edit-section">
            <h2>연락 정보</h2>
            <div className="profile-edit-section__list">
              {[
                ['이메일', 'email'],
                ['연락처', 'phone'],
                ['비상 연락처', 'emergencyPhone'],
                ['근무 지역', 'region'],
              ].map(([label, field]) => (
                <div key={label} className="profile-edit-row">
                  <span>{label}</span>
                  <input
                    type="text"
                    value={profileForm[field as keyof typeof initialProfileForm]}
                    onChange={(event) =>
                      handleProfileFieldChange(field as keyof typeof initialProfileForm, event.target.value)
                    }
                    onKeyDown={handleProfileFieldKeyDown}
                  />
                </div>
              ))}
            </div>
          </section>

          <button
            className="settings-action settings-action--primary profile-edit-page__submit"
            type="submit"
            disabled={!hasProfileChanges}
          >
            저장
          </button>
        </form>

        {isSaveModalOpen ? (
          <div className="settings-modal" role="dialog" aria-modal="true" aria-labelledby="profile-save-modal-title">
            <button
              className="settings-modal__backdrop"
              type="button"
              aria-label="저장 완료 모달 닫기"
              onClick={() => setIsSaveModalOpen(false)}
            />
            <div className="settings-modal__panel">
              <h2 id="profile-save-modal-title">저장이 완료되었습니다.</h2>
              <button
                className="settings-action settings-action--primary settings-modal__confirm"
                type="button"
                onClick={() => setIsSaveModalOpen(false)}
              >
                확인
              </button>
            </div>
          </div>
        ) : null}
      </div>
    </SettingsShell>
  )
}
