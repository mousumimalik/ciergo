export const NA = 'NA'

export function apiString(value: unknown): string {
  if (value === null || value === undefined) return NA
  const str = String(value).trim()
  return str.length > 0 ? str : NA
}

export function apiNumber(value: unknown): number {
  if (value === null || value === undefined || value === '') return 0
  const num = Number(value)
  return Number.isFinite(num) ? num : 0
}
