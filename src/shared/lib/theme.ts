import type { CSSProperties } from 'react'
import { lightTheme } from '../../pakages/design-tokens'

export function createThemeVars(): CSSProperties {
  return {
    '--primary-normal': lightTheme.primary.normal,
    '--primary-strong': lightTheme.primary.strong,
    '--primary-heavy': lightTheme.primary.heavy,
    '--label-normal': lightTheme.label.normal,
    '--label-neutral': lightTheme.label.neutral,
    '--label-alternative': lightTheme.label.alternative,
    '--label-assistive': lightTheme.label.assistive,
    '--label-disable': lightTheme.label.disable,
    '--background-normal': lightTheme.background.normal.normal,
    '--background-normal-alternative': lightTheme.background.normal.alternative,
    '--background-elevated': lightTheme.background.elevated.normal,
    '--fill-normal': lightTheme.fill.normal,
    '--fill-neutral': lightTheme.fill.neutral,
    '--fill-alternative': lightTheme.fill.alternative,
    '--interaction-inactive': lightTheme.interaction.inactive,
    '--line-neutral': lightTheme.line.neutral,
    '--status-destructive': lightTheme.status.destructive,
  } as CSSProperties
}
