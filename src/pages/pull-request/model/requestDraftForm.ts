import type { CreateTransferPayload } from '../../../entities/transfer/model/types'

export type SeverityLevel = 'none' | 'little' | 'many'
export type FetusType = 'single' | 'multiple'

export type RequestDraftForm = {
  patientName: string
  pregnancyWeeks: string
  pregnancyDays: string
  fetusType: FetusType
  age: string
  currentLocation: string
  bloodPressure: string
  pulse: string
  oxygenSaturation: string
  bleedingLevel: SeverityLevel
  departureInstitution: string
  painLevel: SeverityLevel
  amnioticFluidLeakLevel: SeverityLevel
  fetalHeartRate: string
}

export const defaultRequestDraftForm: RequestDraftForm = {
  patientName: '',
  pregnancyWeeks: '',
  pregnancyDays: '',
  fetusType: 'single',
  age: '',
  currentLocation: '',
  bloodPressure: '',
  pulse: '',
  oxygenSaturation: '',
  bleedingLevel: 'none',
  departureInstitution: '',
  painLevel: 'none',
  amnioticFluidLeakLevel: 'none',
  fetalHeartRate: '',
}

const severityLabels: Record<SeverityLevel, string> = {
  none: '없음',
  little: '조금',
  many: '많이',
}

export function buildCreateTransferPayload(form: RequestDraftForm): CreateTransferPayload {
  const symptomParts: string[] = []
  const addSymptomPart = (value: string, formatter: (value: string) => string) => {
    const trimmedValue = value.trim()

    if (trimmedValue) {
      symptomParts.push(formatter(trimmedValue))
    }
  }

  const pregnancyWeeks = form.pregnancyWeeks.trim()
  const pregnancyDays = form.pregnancyDays.trim()

  if (pregnancyWeeks || pregnancyDays) {
    symptomParts.push(`임신 ${pregnancyWeeks || '0'}주 ${pregnancyDays || '0'}일`)
  }

  if (form.fetusType === 'multiple') {
    symptomParts.push('다태아')
  }

  addSymptomPart(form.bloodPressure, (value) => `혈압 ${value}mmHg`)
  addSymptomPart(form.pulse, (value) => `맥박 ${value}bpm`)
  addSymptomPart(form.oxygenSaturation, (value) => `산소포화도 ${value}%`)

  if (form.bleedingLevel !== 'none') {
    symptomParts.push(`출혈 ${severityLabels[form.bleedingLevel]}`)
  }

  if (form.painLevel !== 'none') {
    symptomParts.push(`진통 ${severityLabels[form.painLevel]}`)
  }

  if (form.amnioticFluidLeakLevel !== 'none') {
    symptomParts.push(`양수 파수 ${severityLabels[form.amnioticFluidLeakLevel]}`)
  }

  addSymptomPart(form.fetalHeartRate, (value) => `태아 심박수 ${value}bpm`)

  return {
    patientName: form.patientName.trim(),
    patientAge: Number(form.age) || 0,
    symptom: symptomParts.join(', '),
    departureAddress: (form.departureInstitution || form.currentLocation).trim(),
  }
}

export function validateRequestDraftForm(form: RequestDraftForm): string | null {
  return validateBasicRequestDraftForm(form) ?? validateMedicalRequestDraftForm(form) ?? validateFinalRequestDraftForm(form)
}

export function validateBasicRequestDraftForm(form: RequestDraftForm): string | null {
  if (!form.patientName.trim()) {
    return '환자 이름을 입력해주세요.'
  }

  if (!form.pregnancyWeeks.trim()) {
    return '임신 주수를 입력해주세요.'
  }

  if (!form.pregnancyDays.trim()) {
    return '임신 일수를 입력해주세요.'
  }

  if (!form.age.trim()) {
    return '연령대를 입력해주세요.'
  }

  if (!form.currentLocation.trim()) {
    return '현재 위치를 입력해주세요.'
  }

  return null
}

export function validateMedicalRequestDraftForm(form: RequestDraftForm): string | null {
  if (!form.bloodPressure.trim()) {
    return '혈압을 입력해주세요.'
  }

  if (!form.pulse.trim()) {
    return '맥박을 입력해주세요.'
  }

  if (!form.oxygenSaturation.trim()) {
    return '산소포화도를 입력해주세요.'
  }

  return null
}

export function validateFinalRequestDraftForm(form: RequestDraftForm): string | null {
  if (!form.departureInstitution.trim()) {
    return '출발 의료기관을 입력해주세요.'
  }

  if (!form.fetalHeartRate.trim()) {
    return '태아 심박수를 입력해주세요.'
  }

  return null
}
