import { TransportUpdateForm } from '../../../features/transport-update-form/ui/TransportUpdateForm'
import { createThemeVars } from '../../../shared/lib/theme'
import { EmptyTransportState } from '../../../widgets/empty-transport-state/ui/EmptyTransportState'
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
        />
      </div>
    )
  }

  if (transportPage.currentView === 'empty' || !transportPage.hasActiveTransfer) {
    return (
      <div style={createThemeVars()}>
        <EmptyTransportState onPrimaryAction={transportPage.openRequestsFallback} />
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
      />
    </div>
  )
}
