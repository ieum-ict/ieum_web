import { TransportUpdateForm } from '../../../features/transport-update-form/ui/TransportUpdateForm'
import { createThemeVars } from '../../../shared/lib/theme'
import { EmptyTransportState } from '../../../widgets/empty-transport-state/ui/EmptyTransportState'
import { NavigationPlaceholder } from '../../../widgets/navigation-placeholder/ui/NavigationPlaceholder'
import { SettingsPage } from '../../../widgets/settings-page/ui/SettingsPage'
import {
  AlertSettingsPage,
  HospitalAddPage,
  HospitalDetailPage,
  HospitalManagementPage,
  ProfileEditPage,
} from '../../../widgets/settings-page/ui/SettingsSubPages'
import { TransportMapView } from '../../../widgets/transport-map/ui/TransportMapView'
import { useTransportPage } from '../model/useTransportPage'
import './transport-page.css'

export function TransportPage() {
  const transportPage = useTransportPage()

  if (transportPage.currentView === 'update') {
    return (
      <div style={createThemeVars()}>
        <TransportUpdateForm
          draftUpdateForm={transportPage.draftUpdateForm}
          onBack={transportPage.closeUpdateView}
          onSubmit={transportPage.submitUpdateForm}
          onFieldChange={transportPage.handleUpdateFieldChange}
          onSeverityChange={transportPage.handleSeverityChange}
          onTabChange={transportPage.openNavigationTab}
        />
      </div>
    )
  }

  if (transportPage.currentView === 'setting') {
    return (
      <div style={createThemeVars()}>
        <SettingsPage
          onTabChange={transportPage.openNavigationTab}
          onOpenAlerts={transportPage.openSettingsAlerts}
          onOpenHospitalManagement={transportPage.openHospitalManagement}
          onOpenProfileEdit={transportPage.openProfileEdit}
        />
      </div>
    )
  }

  if (transportPage.currentView === 'setting-alerts') {
    return (
      <div style={createThemeVars()}>
        <AlertSettingsPage
          items={transportPage.draftNotificationSettings}
          onToggle={transportPage.toggleNotificationSetting}
          onCancel={transportPage.cancelNotificationSettings}
          onSave={transportPage.saveNotificationSettings}
          onBack={transportPage.returnToSettingsHome}
          onTabChange={transportPage.openNavigationTab}
        />
      </div>
    )
  }

  if (transportPage.currentView === 'setting-hospitals') {
    return (
      <div style={createThemeVars()}>
        <HospitalManagementPage
          items={transportPage.hospitalItems}
          onAddHospital={transportPage.openHospitalAdd}
          onOpenHospitalDetail={transportPage.openHospitalDetail}
          onBack={transportPage.returnToSettingsHome}
          onTabChange={transportPage.openNavigationTab}
        />
      </div>
    )
  }

  if (transportPage.currentView === 'setting-hospital-detail' && transportPage.selectedHospitalItem) {
    return (
      <div style={createThemeVars()}>
        <HospitalDetailPage
          item={transportPage.selectedHospitalItem}
          onBack={transportPage.closeHospitalDetail}
          onClose={transportPage.closeHospitalDetail}
          onSave={transportPage.closeHospitalDetail}
          onTabChange={transportPage.openNavigationTab}
        />
      </div>
    )
  }

  if (transportPage.currentView === 'setting-hospital-add') {
    return (
      <div style={createThemeVars()}>
        <HospitalAddPage
          step={transportPage.hospitalAddStep}
          form={transportPage.draftHospitalAddForm}
          isTypeOpen={transportPage.isHospitalTypeOpen}
          onFieldChange={transportPage.handleHospitalAddFieldChange}
          onToggleTypeOpen={transportPage.toggleHospitalTypeDropdown}
          onSelectType={transportPage.selectHospitalType}
          onNext={transportPage.goToNextHospitalAddStep}
          onSubmit={transportPage.submitHospitalAdd}
          onBooleanChange={transportPage.setHospitalAddBoolean}
          onAvailabilityChange={transportPage.setHospitalAvailability}
          onBack={transportPage.closeHospitalAdd}
          onTabChange={transportPage.openNavigationTab}
        />
      </div>
    )
  }

  if (transportPage.currentView === 'setting-profile-edit') {
    return (
      <div style={createThemeVars()}>
        <ProfileEditPage
          onBack={transportPage.returnToSettingsHome}
          onTabChange={transportPage.openNavigationTab}
        />
      </div>
    )
  }

  if (transportPage.currentView === 'empty' || !transportPage.hasActiveTransfer) {
    return (
      <div style={createThemeVars()}>
        <EmptyTransportState
          onPrimaryAction={transportPage.openRequestsFallback}
          onTabChange={transportPage.openNavigationTab}
        />
      </div>
    )
  }

  if (transportPage.currentView === 'request' || transportPage.currentView === 'hospital') {
    return (
      <div style={createThemeVars()}>
        <NavigationPlaceholder
          activeTab={transportPage.currentView}
          onTabChange={transportPage.openNavigationTab}
        />
      </div>
    )
  }

  return (
    <div style={createThemeVars()}>
      <TransportMapView
        mapRef={transportPage.mapRef}
        tiles={transportPage.tiles}
        routePath={transportPage.routePath}
        ambulancePoint={transportPage.ambulancePoint}
        destinationPoint={transportPage.destinationPoint}
        durationPoint={transportPage.durationPoint}
        ambulanceMarkerSize={transportPage.ambulanceMarkerSize}
        zoom={transportPage.zoom}
        minZoom={transportPage.minZoom}
        maxZoom={transportPage.maxZoom}
        isRouteActive={transportPage.isRouteActive}
        isTransportSheetOpen={transportPage.isTransportSheetOpen}
        isHospitalSheetOpen={transportPage.isHospitalSheetOpen}
        isContactSheetOpen={transportPage.isContactSheetOpen}
        isTransferCompleted={transportPage.isTransferCompleted}
        sheetDragOffset={transportPage.sheetDragOffset}
        hospitalSheetDragOffset={transportPage.hospitalSheetDragOffset}
        contactSheetDragOffset={transportPage.contactSheetDragOffset}
        onMapPointerDown={transportPage.handlePointerDown}
        onMapPointerMove={transportPage.handlePointerMove}
        onMapPointerUp={transportPage.stopDragging}
        onMapPointerCancel={transportPage.stopDragging}
        onWheel={transportPage.handleWheel}
        onAmbulanceClick={transportPage.toggleRouteBadge}
        onHospitalCardClick={transportPage.openHospitalSheet}
        onCarActionClick={transportPage.openTransportSheet}
        onZoomClick={transportPage.handleZoomClick}
        onBackdropClick={transportPage.closeOverlay}
        onHospitalSheetPointerDown={transportPage.hospitalSheetHandlers.onPointerDown}
        onHospitalSheetPointerMove={transportPage.hospitalSheetHandlers.onPointerMove}
        onHospitalSheetPointerUp={transportPage.hospitalSheetHandlers.onPointerUp}
        onCloseHospitalSheet={transportPage.closeHospitalSheet}
        onOpenContactSheet={transportPage.openContactSheet}
        onContactSheetPointerDown={transportPage.contactSheetHandlers.onPointerDown}
        onContactSheetPointerMove={transportPage.contactSheetHandlers.onPointerMove}
        onContactSheetPointerUp={transportPage.contactSheetHandlers.onPointerUp}
        onCloseContactSheet={transportPage.closeContactSheetToTransport}
        onCloseCompletedTransport={transportPage.closeCompletedTransport}
        onTransportSheetPointerDown={transportPage.transportSheetHandlers.onPointerDown}
        onTransportSheetPointerMove={transportPage.transportSheetHandlers.onPointerMove}
        onTransportSheetPointerUp={transportPage.transportSheetHandlers.onPointerUp}
        onOpenUpdateView={transportPage.openUpdateView}
        onMarkTransferCompleted={transportPage.markTransferAsCompleted}
        onTabChange={transportPage.openNavigationTab}
      />
    </div>
  )
}
