import { useEffect, useMemo, useRef, useState } from 'react'
import type {
  Dispatch,
  MouseEvent,
  MutableRefObject,
  PointerEvent,
  SetStateAction,
  WheelEvent,
} from 'react'
import {
  ambulanceLocation,
  createOsrmRouteUrl,
  defaultHospitalAddForm,
  defaultUpdateForm,
  fallbackRouteCoordinates,
  getViewFromHash,
  hospitalManagementItems,
  initialCenter,
  MAX_ZOOM,
  MIN_ZOOM,
  notificationSettings,
  transferDestination,
  transferStart,
} from '../../../entities/transport/model/constants'
import type {
  AppView,
  Coordinate,
  DragState,
  HospitalAcceptance,
  HospitalAddForm,
  HospitalManagementItem,
  HospitalType,
  NotificationSettingItem,
  OsrmRouteResponse,
  ScreenPoint,
  Severity,
  SeverityField,
  SheetDragState,
  UpdateFormData,
} from '../../../entities/transport/model/types'
import { clamp, pointsToPath, project, TILE_SIZE, unproject } from '../../../shared/lib/map'
import type { NavigationTab } from '../../../widgets/bottom-navigation/ui/BottomNavigation'

function normalizeHospitalAddForm(form: HospitalAddForm): HospitalAddForm {
  const normalizeCount = (value: string) => (value === '32' ? '0' : value)

  return {
    ...form,
    obstetricians: normalizeCount(form.obstetricians),
    neonatologists: normalizeCount(form.neonatologists),
    anesthesiologists: normalizeCount(form.anesthesiologists),
    operatingRooms: normalizeCount(form.operatingRooms),
    deliveryRooms: normalizeCount(form.deliveryRooms),
    nicuBeds: normalizeCount(form.nicuBeds),
    incubators: normalizeCount(form.incubators),
  }
}

function createSheetHandlers(
  sheetRef: MutableRefObject<SheetDragState | null>,
  setOffset: Dispatch<SetStateAction<number>>,
  closeSheet: () => void,
  dismissThreshold: number,
) {
  const onPointerDown = (event: PointerEvent<HTMLElement>) => {
    const target = event.target
    if (target instanceof Element && target.closest('button')) {
      return
    }

    event.stopPropagation()
    sheetRef.current = {
      pointerId: event.pointerId,
      startY: event.clientY,
    }
    event.currentTarget.setPointerCapture(event.pointerId)
  }

  const onPointerMove = (event: PointerEvent<HTMLElement>) => {
    const dragState = sheetRef.current
    if (!dragState || dragState.pointerId !== event.pointerId) {
      return
    }

    event.stopPropagation()
    setOffset(Math.max(0, event.clientY - dragState.startY))
  }

  const onPointerUp = (event: PointerEvent<HTMLElement>) => {
    const dragState = sheetRef.current
    if (!dragState || dragState.pointerId !== event.pointerId) {
      return
    }

    event.stopPropagation()
    sheetRef.current = null

    if (event.clientY - dragState.startY > dismissThreshold) {
      closeSheet()
      return
    }

    setOffset(0)
  }

  return { onPointerDown, onPointerMove, onPointerUp }
}

export function useTransportPage() {
  const mapRef = useRef<HTMLDivElement | null>(null)
  const dragRef = useRef<DragState | null>(null)
  const sheetDragRef = useRef<SheetDragState | null>(null)
  const hospitalSheetDragRef = useRef<SheetDragState | null>(null)
  const contactSheetDragRef = useRef<SheetDragState | null>(null)
  const zoomWheelDeltaRef = useRef(0)
  const [center, setCenter] = useState<Coordinate>(initialCenter)
  const [zoom, setZoom] = useState(17)
  const [mapSize, setMapSize] = useState({ width: 402, height: 720 })
  const [isRouteActive, setIsRouteActive] = useState(false)
  const [isTransportSheetOpen, setIsTransportSheetOpen] = useState(false)
  const [isHospitalSheetOpen, setIsHospitalSheetOpen] = useState(false)
  const [isContactSheetOpen, setIsContactSheetOpen] = useState(false)
  const [isTransferCompleted, setIsTransferCompleted] = useState(false)
  const [hasActiveTransfer, setHasActiveTransfer] = useState(true)
  const [sheetDragOffset, setSheetDragOffset] = useState(0)
  const [hospitalSheetDragOffset, setHospitalSheetDragOffset] = useState(0)
  const [contactSheetDragOffset, setContactSheetDragOffset] = useState(0)
  const [routeCoordinates, setRouteCoordinates] = useState<Coordinate[]>(fallbackRouteCoordinates)
  const [currentView, setCurrentView] = useState<AppView>(() => getViewFromHash(window.location.hash))
  const [savedUpdateForm, setSavedUpdateForm] = useState<UpdateFormData>(defaultUpdateForm)
  const [draftUpdateForm, setDraftUpdateForm] = useState<UpdateFormData>(defaultUpdateForm)
  const [lastUpdatedAt, setLastUpdatedAt] = useState('12:24')
  const [currentSettingsView, setCurrentSettingsView] = useState<AppView>('setting')
  const [draftNotificationSettings, setDraftNotificationSettings] =
    useState<NotificationSettingItem[]>(notificationSettings)
  const [savedNotificationSettings, setSavedNotificationSettings] =
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

  useEffect(() => {
    const mapElement = mapRef.current
    if (!mapElement) {
      return
    }

    const resizeObserver = new ResizeObserver(([entry]) => {
      setMapSize({
        width: entry.contentRect.width,
        height: entry.contentRect.height,
      })
    })

    resizeObserver.observe(mapElement)
    return () => resizeObserver.disconnect()
  }, [])

  useEffect(() => {
    const controller = new AbortController()

    async function loadRoadRoute() {
      try {
        const response = await fetch(createOsrmRouteUrl(transferStart, transferDestination), {
          signal: controller.signal,
        })

        if (!response.ok) {
          return
        }

        const data = (await response.json()) as OsrmRouteResponse
        const roadCoordinates = data.routes?.[0]?.geometry?.coordinates?.map(([lng, lat]) => ({ lat, lng }))

        if (roadCoordinates && roadCoordinates.length > 1) {
          setRouteCoordinates(roadCoordinates)
        }
      } catch {
        if (!controller.signal.aborted) {
          setRouteCoordinates(fallbackRouteCoordinates)
        }
      }
    }

    void loadRoadRoute()
    return () => controller.abort()
  }, [])

  useEffect(() => {
    const handleHashChange = () => {
      const nextView = getViewFromHash(window.location.hash)
      setCurrentView(nextView)

      if (
        nextView === 'setting' ||
        nextView === 'setting-alerts' ||
        nextView === 'setting-hospitals' ||
        nextView === 'setting-hospital-add' ||
        nextView === 'setting-hospital-detail' ||
        nextView === 'setting-profile-edit'
      ) {
        setCurrentSettingsView(nextView)
      }
    }

    window.addEventListener('hashchange', handleHashChange)
    return () => window.removeEventListener('hashchange', handleHashChange)
  }, [])

  useEffect(() => {
    setDraftHospitalAddForm((currentValue) => normalizeHospitalAddForm(currentValue))
  }, [])

  const projectedCenter = useMemo(() => project(center, zoom), [center, zoom])

  const toScreenPoint = (coordinate: Coordinate): ScreenPoint => {
    const point = project(coordinate, zoom)

    return {
      x: point.x - projectedCenter.x + mapSize.width / 2,
      y: point.y - projectedCenter.y + mapSize.height / 2,
    }
  }

  const routePoints = routeCoordinates.map(toScreenPoint)
  const routePath = pointsToPath(routePoints)
  const ambulancePoint = toScreenPoint(ambulanceLocation)
  const destinationLocation = routeCoordinates[routeCoordinates.length - 1] ?? transferDestination
  const destinationPoint = toScreenPoint(destinationLocation)
  const durationPoint = ambulancePoint
  const ambulanceMarkerSize = clamp(64 + (zoom - 17) * 6, 58, 82)

  const tiles = useMemo(() => {
    const topLeft = {
      x: projectedCenter.x - mapSize.width / 2,
      y: projectedCenter.y - mapSize.height / 2,
    }
    const minTileX = Math.floor(topLeft.x / TILE_SIZE)
    const maxTileX = Math.floor((topLeft.x + mapSize.width) / TILE_SIZE)
    const minTileY = Math.floor(topLeft.y / TILE_SIZE)
    const maxTileY = Math.floor((topLeft.y + mapSize.height) / TILE_SIZE)
    const tileCount = 2 ** zoom
    const nextTiles: Array<{ id: string; x: number; y: number; src: string }> = []

    for (let tileX = minTileX; tileX <= maxTileX; tileX += 1) {
      for (let tileY = minTileY; tileY <= maxTileY; tileY += 1) {
        if (tileY < 0 || tileY >= tileCount) {
          continue
        }

        const wrappedX = ((tileX % tileCount) + tileCount) % tileCount

        nextTiles.push({
          id: `${zoom}-${tileX}-${tileY}`,
          x: tileX * TILE_SIZE - topLeft.x,
          y: tileY * TILE_SIZE - topLeft.y,
          src: `https://tile.openstreetmap.org/${zoom}/${wrappedX}/${tileY}.png`,
        })
      }
    }

    return nextTiles
  }, [mapSize.height, mapSize.width, projectedCenter.x, projectedCenter.y, zoom])

  const handlePointerDown = (event: PointerEvent<HTMLDivElement>) => {
    if (event.button !== 0) {
      return
    }

    dragRef.current = {
      pointerId: event.pointerId,
      startX: event.clientX,
      startY: event.clientY,
      centerWorld: projectedCenter,
    }

    event.currentTarget.setPointerCapture(event.pointerId)
  }

  const handlePointerMove = (event: PointerEvent<HTMLDivElement>) => {
    const dragState = dragRef.current

    if (!dragState || dragState.pointerId !== event.pointerId) {
      return
    }

    const nextCenterWorld = {
      x: dragState.centerWorld.x - (event.clientX - dragState.startX),
      y: dragState.centerWorld.y - (event.clientY - dragState.startY),
    }

    setCenter(unproject(nextCenterWorld, zoom))
  }

  const stopDragging = (event: PointerEvent<HTMLDivElement>) => {
    if (dragRef.current?.pointerId === event.pointerId) {
      dragRef.current = null
    }
  }

  const handleWheel = (event: WheelEvent<HTMLDivElement>) => {
    event.preventDefault()
    zoomWheelDeltaRef.current += event.deltaY

    if (Math.abs(zoomWheelDeltaRef.current) < 140) {
      return
    }

    const zoomDirection = zoomWheelDeltaRef.current < 0 ? 1 : -1
    zoomWheelDeltaRef.current = 0
    setZoom((currentZoom) => clamp(currentZoom + zoomDirection, MIN_ZOOM, MAX_ZOOM))
  }

  const handleZoomClick = (event: MouseEvent<HTMLButtonElement>, difference: number) => {
    event.stopPropagation()
    setZoom((currentZoom) => clamp(currentZoom + difference, MIN_ZOOM, MAX_ZOOM))
  }

  const closeTransportSheet = () => {
    setSheetDragOffset(0)
    setIsTransportSheetOpen(false)
  }

  const closeHospitalSheet = () => {
    setHospitalSheetDragOffset(0)
    setIsHospitalSheetOpen(false)
  }

  const closeContactSheet = () => {
    setContactSheetDragOffset(0)
    setIsContactSheetOpen(false)
  }

  const closeContactSheetToTransport = () => {
    setContactSheetDragOffset(0)
    setIsContactSheetOpen(false)
    setIsTransportSheetOpen(true)
  }

  const closeToMap = () => {
    setSheetDragOffset(0)
    setHospitalSheetDragOffset(0)
    setContactSheetDragOffset(0)
    setIsTransportSheetOpen(false)
    setIsHospitalSheetOpen(false)
    setIsContactSheetOpen(false)
    setIsTransferCompleted(false)
  }

  const closeCompletedTransport = () => {
    setIsTransferCompleted(false)
    setHasActiveTransfer(false)
    setCurrentView('empty')
  }

  const closeOverlay = () => {
    if (isTransferCompleted) {
      closeCompletedTransport()
      return
    }

    if (isHospitalSheetOpen) {
      closeHospitalSheet()
      return
    }

    if (isContactSheetOpen) {
      closeToMap()
      return
    }

    closeTransportSheet()
  }

  const openHospitalSheet = (event: MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation()
    closeTransportSheet()
    setIsHospitalSheetOpen(true)
  }

  const openTransportSheet = (event: MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation()
    if (!hasActiveTransfer) {
      setCurrentView('empty')
      return
    }
    closeHospitalSheet()
    setIsTransportSheetOpen(true)
  }

  const openContactSheet = () => {
    setIsTransportSheetOpen(false)
    setIsContactSheetOpen(true)
  }

  const toggleRouteBadge = (event: MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation()
    setIsRouteActive((currentValue) => !currentValue)
  }

  const markTransferAsCompleted = (event: MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation()
    setIsTransferCompleted(true)
    setIsTransportSheetOpen(false)
    setSheetDragOffset(0)
  }

  const openUpdateView = () => {
    closeTransportSheet()
    setDraftUpdateForm(savedUpdateForm)
    setCurrentView('update')
    window.location.hash = 'update'
  }

  const closeUpdateView = () => {
    window.location.hash = ''
  }

  const openRequestsFallback = () => {
    setHasActiveTransfer(true)
    setCurrentView('map')
    window.location.hash = ''
  }

  const openNavigationTab = (tab: NavigationTab) => {
    if (tab === 'transfer') {
      setCurrentView('map')
      window.location.hash = ''
      return
    }

    setCurrentView(tab)
    window.location.hash = tab
  }

  const openSettingsView = (view: AppView) => {
    setCurrentSettingsView(view)
    setCurrentView(view)
    window.location.hash = view
  }

  const returnToSettingsHome = () => {
    openSettingsView('setting')
  }

  const openSettingsAlerts = () => {
    setDraftNotificationSettings(savedNotificationSettings)
    openSettingsView('setting-alerts')
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
    openSettingsView('setting-hospitals')
  }

  const openHospitalAdd = () => {
    setDraftHospitalAddForm(normalizeHospitalAddForm(defaultHospitalAddForm))
    setHospitalAddStep(1)
    setIsHospitalTypeOpen(false)
    openSettingsView('setting-hospital-add')
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
    openSettingsView('setting-hospital-detail')
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
      } satisfies HospitalManagementItem,
      ...currentValue,
    ])

    closeHospitalAdd()
  }

  const openProfileEdit = () => {
    openSettingsView('setting-profile-edit')
  }

  const saveHospitalDetail = (nextItem: HospitalManagementItem) => {
    setHospitalItems((currentValue) =>
      currentValue.map((item) => (item.id === nextItem.id ? nextItem : item)),
    )
    setSelectedHospitalItem(nextItem)
    closeHospitalDetail()
  }

  const transportSheetHandlers = createSheetHandlers(sheetDragRef, setSheetDragOffset, closeTransportSheet, 80)
  const hospitalSheetHandlers = createSheetHandlers(
    hospitalSheetDragRef,
    setHospitalSheetDragOffset,
    closeHospitalSheet,
    100,
  )
  const contactSheetHandlers = createSheetHandlers(
    contactSheetDragRef,
    setContactSheetDragOffset,
    closeToMap,
    100,
  )

  const handleUpdateFieldChange = (field: keyof UpdateFormData, value: string) => {
    setDraftUpdateForm((currentValue) => ({
      ...currentValue,
      [field]: value,
    }))
  }

  const handleSeverityChange = (field: SeverityField, value: Severity) => {
    setDraftUpdateForm((currentValue) => ({
      ...currentValue,
      [field]: value,
    }))
  }

  const submitUpdateForm = () => {
    setSavedUpdateForm(draftUpdateForm)
    setLastUpdatedAt(
      new Intl.DateTimeFormat('ko-KR', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: false,
      }).format(new Date()),
    )
    closeUpdateView()
  }

  return {
    currentView,
    hasActiveTransfer,
    mapRef,
    tiles,
    routePath,
    ambulancePoint,
    destinationPoint,
    durationPoint,
    ambulanceMarkerSize,
    zoom,
    minZoom: MIN_ZOOM,
    maxZoom: MAX_ZOOM,
    isRouteActive,
    isTransportSheetOpen,
    isHospitalSheetOpen,
    isContactSheetOpen,
    isTransferCompleted,
    sheetDragOffset,
    hospitalSheetDragOffset,
    contactSheetDragOffset,
    lastUpdatedAt,
    savedUpdateForm,
    draftUpdateForm,
    handlePointerDown,
    handlePointerMove,
    stopDragging,
    handleWheel,
    handleZoomClick,
    toggleRouteBadge,
    openHospitalSheet,
    openTransportSheet,
    openContactSheet,
    closeOverlay,
    closeHospitalSheet,
    closeContactSheet,
    closeContactSheetToTransport,
    closeToMap,
    closeCompletedTransport,
    openUpdateView,
    markTransferAsCompleted,
    transportSheetHandlers,
    hospitalSheetHandlers,
    contactSheetHandlers,
    handleUpdateFieldChange,
    handleSeverityChange,
    submitUpdateForm,
    closeUpdateView,
    openRequestsFallback,
    openNavigationTab,
    currentSettingsView,
    draftNotificationSettings,
    hospitalItems,
    selectedHospitalItem,
    hospitalAddStep,
    isHospitalTypeOpen,
    draftHospitalAddForm,
    openSettingsAlerts,
    toggleNotificationSetting,
    saveNotificationSettings,
    cancelNotificationSettings,
    openHospitalManagement,
    openHospitalAdd,
    closeHospitalAdd,
    openHospitalDetail,
    closeHospitalDetail,
    handleHospitalAddFieldChange,
    selectHospitalType,
    toggleHospitalTypeDropdown,
    setHospitalAddBoolean,
    setHospitalAvailability,
    goToNextHospitalAddStep,
    submitHospitalAdd,
    openProfileEdit,
    saveHospitalDetail,
    returnToSettingsHome,
  }
}
