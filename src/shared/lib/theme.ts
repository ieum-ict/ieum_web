import type { CSSProperties } from 'react'
import { lightTheme } from '../../pakages/design-tokens'

export function createThemeVars(): CSSProperties {
  return {
    '--primary-normal': lightTheme.primary.normal,
    '--primary-heavy': lightTheme.primary.heavy,
    '--label-normal': lightTheme.label.normal,
    '--label-neutral': lightTheme.label.neutral,
    '--label-alternative': lightTheme.label.alternative,
    '--background-normal': lightTheme.background.normal.normal,
    '--background-elevated': lightTheme.background.elevated.normal,
    '--fill-alternative': lightTheme.fill.alternative,
    '--interaction-inactive': lightTheme.interaction.inactive,
    '--line-neutral': lightTheme.line.neutral,
  } as CSSProperties
}
