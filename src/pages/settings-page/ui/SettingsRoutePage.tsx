import { useState } from 'react'
import {
  defaultHospitalAddForm,
  hospitalManagementItems,
  notificationSettings,
} from '../../../entities/transport/model/constants'
import type {
  HospitalAcceptance,
  HospitalAddForm,
  HospitalManagementItem,
  HospitalType,
  NotificationSettingItem,
} from '../../../entities/transport/model/types'
import { SettingsPage } from '../../../widgets/settings-page/ui/SettingsPage'
import {
  AlertSettingsPage,
  HospitalAddPage,
  HospitalDetailPage,
  HospitalManagementPage,
  ProfileEditPage,
} from '../../../widgets/settings-page/ui/SettingsSubPages'

type SettingsRouteView =
  | 'home'
  | 'alerts'
  | 'hospitals'
  | 'hospital-add'
  | 'hospital-detail'
  | 'profile-edit'

function normalizeHospitalAddForm(form: HospitalAddForm): HospitalAddForm {
  return {
    ...form,
    obstetricians: form.obstetricians || '0',
    neonatologists: form.neonatologists || '0',
    anesthesiologists: form.anesthesiologists || '0',
    operatingRooms: form.operatingRooms || '0',
    deliveryRooms: form.deliveryRooms || '0',
    nicuBeds: form.nicuBeds || '0',
    incubators: form.incubators || '0',
  }
}

export function SettingsRoutePage() {
  const [currentView, setCurrentView] = useState<SettingsRouteView>('home')
  const [savedNotificationSettings, setSavedNotificationSettings] =
    useState<NotificationSettingItem[]>(notificationSettings)
  const [draftNotificationSettings, setDraftNotificationSettings] =
    useState<NotificationSettingItem[]>(notificationSettings)
  const [hospitalItems, setHospitalItems] = useState<HospitalManagementItem[]>(hospitalManagementItems)
  const [selectedHospitalItem, setSelectedHospitalItem] = useState<HospitalManagementItem | null>(
    hospitalManagementItems[0] ?? null,
  )
  const [hospitalAddStep, setHospitalAddStep] = useState(1)
  const [isHospitalTypeOpen, setIsHospitalTypeOpen] = useState(false)
  const [draftHospitalAddForm, setDraftHospitalAddForm] = useState<HospitalAddForm>(() =>
    normalizeHospitalAddForm(defaultHospitalAddForm),
  )

  const returnToSettingsHome = () => {
    setCurrentView('home')
  }

  const openSettingsAlerts = () => {
    setDraftNotificationSettings(savedNotificationSettings)
    setCurrentView('alerts')
  }

  const toggleNotificationSetting = (id: string) => {
    setDraftNotificationSettings((currentValue) =>
      currentValue.map((item) => (item.id === id ? { ...item, enabled: !item.enabled } : item)),
    )
  }

  const saveNotificationSettings = () => {
    setSavedNotificationSettings(draftNotificationSettings)
    returnToSettingsHome()
  }

  const cancelNotificationSettings = () => {
    setDraftNotificationSettings(savedNotificationSettings)
    returnToSettingsHome()
  }

  const openHospitalManagement = () => {
    setCurrentView('hospitals')
  }

  const openHospitalAdd = () => {
    setDraftHospitalAddForm(normalizeHospitalAddForm(defaultHospitalAddForm))
    setHospitalAddStep(1)
    setIsHospitalTypeOpen(false)
    setCurrentView('hospital-add')
  }

  const closeHospitalAdd = () => {
    setHospitalAddStep(1)
    setIsHospitalTypeOpen(false)
    openHospitalManagement()
  }

  const openHospitalDetail = (hospitalId: string) => {
    const nextHospital = hospitalItems.find((item) => item.id === hospitalId)
    if (!nextHospital) {
      return
    }

    setSelectedHospitalItem(nextHospital)
    setCurrentView('hospital-detail')
  }

  const closeHospitalDetail = () => {
    openHospitalManagement()
  }

  const handleHospitalAddFieldChange = (field: keyof HospitalAddForm, value: string) => {
    setDraftHospitalAddForm((currentValue) => ({
      ...currentValue,
      [field]: value,
    }))
  }

  const selectHospitalType = (value: HospitalType) => {
    setDraftHospitalAddForm((currentValue) => ({
      ...currentValue,
      type: value,
    }))
    setIsHospitalTypeOpen(false)
  }

  const toggleHospitalTypeDropdown = () => {
    setIsHospitalTypeOpen((currentValue) => !currentValue)
  }

  const setHospitalAddBoolean = (
    field: 'transfusionAvailable' | 'emergencySurgeryAvailable',
    value: boolean,
  ) => {
    setDraftHospitalAddForm((currentValue) => ({
      ...currentValue,
      [field]: value,
    }))
  }

  const setHospitalAvailability = (value: HospitalAddForm['availability']) => {
    setDraftHospitalAddForm((currentValue) => ({
      ...currentValue,
      availability: value,
    }))
  }

  const goToNextHospitalAddStep = () => {
    setHospitalAddStep((currentValue) => Math.min(3, currentValue + 1))
    setIsHospitalTypeOpen(false)
  }

  const submitHospitalAdd = () => {
    const statusMap: Record<HospitalAddForm['availability'], HospitalAcceptance> = {
      available: 'available',
      conditional: 'conditional',
      unavailable: 'examine',
    }

    setHospitalItems((currentValue) => [
      {
        id: `hospital-${Date.now()}`,
        name: draftHospitalAddForm.name || '새 병원',
        distance: '18km',
        travelTime: '차량 16분',
        obstetricians: `산부인과 전문의 ${draftHospitalAddForm.obstetricians || '0'}명`,
        nicuBeds: `NICU병상 ${draftHospitalAddForm.nicuBeds || '0'}개`,
        operatingRooms: `수술실 ${draftHospitalAddForm.operatingRooms || '0'}개`,
        status: statusMap[draftHospitalAddForm.availability],
        branch: '본원',
        neonatologists: `${draftHospitalAddForm.neonatologists || '0'}명`,
        anesthesiologists: `${draftHospitalAddForm.anesthesiologists || '0'}명`,
        deliveryRooms: `${draftHospitalAddForm.deliveryRooms || '0'}개`,
        incubators: `${draftHospitalAddForm.incubators || '0'}개`,
        transfusionAvailable: draftHospitalAddForm.transfusionAvailable,
      },
      ...currentValue,
    ])

    closeHospitalAdd()
  }

  const openProfileEdit = () => {
    setCurrentView('profile-edit')
  }

  const saveHospitalDetail = (nextItem: HospitalManagementItem) => {
    setHospitalItems((currentValue) =>
      currentValue.map((item) => (item.id === nextItem.id ? nextItem : item)),
    )
    setSelectedHospitalItem(nextItem)
    closeHospitalDetail()
  }

  if (currentView === 'alerts') {
    return (
      <AlertSettingsPage
        items={draftNotificationSettings}
        onToggle={toggleNotificationSetting}
        onCancel={cancelNotificationSettings}
        onSave={saveNotificationSettings}
        onBack={returnToSettingsHome}
      />
    )
  }

  if (currentView === 'hospitals') {
    return (
      <HospitalManagementPage
        items={hospitalItems}
        onAddHospital={openHospitalAdd}
        onOpenHospitalDetail={openHospitalDetail}
        onBack={returnToSettingsHome}
      />
    )
  }

  if (currentView === 'hospital-detail' && selectedHospitalItem) {
    return (
      <HospitalDetailPage
        item={selectedHospitalItem}
        onBack={closeHospitalDetail}
        onClose={closeHospitalDetail}
        onSave={saveHospitalDetail}
      />
    )
  }

  if (currentView === 'hospital-add') {
    return (
      <HospitalAddPage
        step={hospitalAddStep}
        form={draftHospitalAddForm}
        isTypeOpen={isHospitalTypeOpen}
        onFieldChange={handleHospitalAddFieldChange}
        onToggleTypeOpen={toggleHospitalTypeDropdown}
        onSelectType={selectHospitalType}
        onNext={goToNextHospitalAddStep}
        onSubmit={submitHospitalAdd}
        onBooleanChange={setHospitalAddBoolean}
        onAvailabilityChange={setHospitalAvailability}
        onBack={closeHospitalAdd}
      />
    )
  }

  if (currentView === 'profile-edit') {
    return <ProfileEditPage onBack={returnToSettingsHome} />
  }

  return (
    <SettingsPage
      onOpenAlerts={openSettingsAlerts}
      onOpenHospitalManagement={openHospitalManagement}
      onOpenProfileEdit={openProfileEdit}
    />
  )
}
