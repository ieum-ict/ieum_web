import { useEffect, useState } from 'react'
import {
  fetchManagedHospitals,
  fetchMyProfile,
  loadUserProfileDetails,
  logout,
  saveUserProfileDetails,
  type UserProfile,
  updateHospitalResources,
} from '../../../entities/settings/api/settingsApi'
import {
  defaultHospitalAddForm,
  notificationSettings,
} from '../../../entities/transport/model/constants'
import type {
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
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [isProfileLoading, setIsProfileLoading] = useState(true)
  const [profileError, setProfileError] = useState<string | null>(null)
  const [savedNotificationSettings, setSavedNotificationSettings] =
    useState<NotificationSettingItem[]>(notificationSettings)
  const [draftNotificationSettings, setDraftNotificationSettings] =
    useState<NotificationSettingItem[]>(notificationSettings)
  const [hospitalItems, setHospitalItems] = useState<HospitalManagementItem[]>([])
  const [isHospitalLoading, setIsHospitalLoading] = useState(true)
  const [hospitalError, setHospitalError] = useState<string | null>(null)
  const [selectedHospitalItem, setSelectedHospitalItem] = useState<HospitalManagementItem | null>(null)
  const [hospitalAddStep, setHospitalAddStep] = useState(1)
  const [isHospitalTypeOpen, setIsHospitalTypeOpen] = useState(false)
  const [draftHospitalAddForm, setDraftHospitalAddForm] = useState<HospitalAddForm>(() =>
    normalizeHospitalAddForm(defaultHospitalAddForm),
  )

  useEffect(() => {
    let isAlive = true

    async function loadSettingsData() {
      setIsProfileLoading(true)
      setIsHospitalLoading(true)
      setProfileError(null)
      setHospitalError(null)

      const [profileResult, hospitalsResult] = await Promise.allSettled([
        fetchMyProfile(),
        fetchManagedHospitals(),
      ])

      if (!isAlive) {
        return
      }

      if (profileResult.status === 'fulfilled') {
        const nextProfile = profileResult.value
        const username = nextProfile.username ?? nextProfile.loginId ?? ''
        const profileDetails = loadUserProfileDetails(username)
        setProfile({
          id: nextProfile.id,
          name: nextProfile.name,
          username,
          email: nextProfile.email,
          ...profileDetails,
        })
      } else {
        setProfile(null)
        setProfileError('회원 정보를 불러오지 못했습니다.')
      }

      if (hospitalsResult.status === 'fulfilled') {
        setHospitalItems(hospitalsResult.value)
        setSelectedHospitalItem(hospitalsResult.value[0] ?? null)
      } else {
        setHospitalError('병원 정보를 불러오지 못했습니다.')
      }

      setIsProfileLoading(false)
      setIsHospitalLoading(false)
    }

    void loadSettingsData()

    return () => {
      isAlive = false
    }
  }, [])

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
    setHospitalError('병원 등록 API가 아직 제공되지 않았습니다.')
    closeHospitalAdd()
  }

  const openProfileEdit = () => {
    setCurrentView('profile-edit')
  }

  const saveHospitalDetail = async (nextItem: HospitalManagementItem) => {
    const savedItem = await updateHospitalResources(nextItem).catch(() => nextItem)

    setHospitalItems((currentValue) =>
      currentValue.map((item) => (item.id === savedItem.id ? savedItem : item)),
    )
    setSelectedHospitalItem(savedItem)
    closeHospitalDetail()
  }

  const handleLogout = () => {
    void logout().finally(() => {
      window.history.pushState(null, '', '/login')
      window.dispatchEvent(new PopStateEvent('popstate'))
    })
  }

  const saveProfileDetails = (details: Omit<UserProfile, 'id' | 'username' | 'name' | 'email'>) => {
    if (!profile) {
      return
    }

    saveUserProfileDetails(profile.username, details)
    setProfile((currentProfile) => (currentProfile ? { ...currentProfile, ...details } : currentProfile))
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
        isLoading={isHospitalLoading}
        error={hospitalError}
        onAddHospital={openHospitalAdd}
        onOpenHospitalDetail={openHospitalDetail}
        onBack={returnToSettingsHome}
      />
    )
  }

  if (currentView === 'hospital-detail' && selectedHospitalItem) {
    return (
      <HospitalDetailPage
        key={selectedHospitalItem.id}
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
    return <ProfileEditPage profile={profile} onProfileDetailsSave={saveProfileDetails} onBack={returnToSettingsHome} />
  }

  return (
    <SettingsPage
      profile={profile}
      isLoading={isProfileLoading}
      error={profileError}
      onOpenAlerts={openSettingsAlerts}
      onOpenHospitalManagement={openHospitalManagement}
      onOpenProfileEdit={openProfileEdit}
      onLogout={handleLogout}
    />
  )
}
