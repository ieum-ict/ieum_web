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

  if (form.pregnancyWeeks || form.pregnancyDays) {
    symptomParts.push(`임신 ${form.pregnancyWeeks || '0'}주 ${form.pregnancyDays || '0'}일`)
  }

  symptomParts.push(form.fetusType === 'multiple' ? '다태아' : '단태아')

  if (form.bloodPressure) {
    symptomParts.push(`혈압 ${form.bloodPressure}mmHg`)
  }

  if (form.pulse) {
    symptomParts.push(`맥박 ${form.pulse}bpm`)
  }

  if (form.oxygenSaturation) {
    symptomParts.push(`산소포화도 ${form.oxygenSaturation}%`)
  }

  symptomParts.push(`출혈 ${severityLabels[form.bleedingLevel]}`)
  symptomParts.push(`진통 ${severityLabels[form.painLevel]}`)
  symptomParts.push(`양수 파수 ${severityLabels[form.amnioticFluidLeakLevel]}`)

  if (form.fetalHeartRate) {
    symptomParts.push(`태아 심박수 ${form.fetalHeartRate}bpm`)
  }

  return {
    patientName: form.patientName.trim(),
    patientAge: Number(form.age) || 0,
    symptom: symptomParts.join(', '),
    departureAddress: (form.departureInstitution || form.currentLocation).trim(),
  }
}

export function validateRequestDraftForm(form: RequestDraftForm): string | null {
  if (!form.patientName.trim()) {
    return '환자 이름을 입력해주세요.'
  }

  if (!form.age.trim()) {
    return '연령대를 입력해주세요.'
  }

  if (!form.departureInstitution.trim() && !form.currentLocation.trim()) {
    return '출발 의료기관 또는 현재 위치를 입력해주세요.'
  }

  return null
}
