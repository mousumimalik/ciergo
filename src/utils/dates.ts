import moment from 'moment'

const DATE_FORMATS = [
  moment.ISO_8601,
  'DD-MM-YYYY',
  'YYYY-MM-DD',
  'YYYY-MM-DDTHH:mm:ss.SSSZ',
] as const

export function parseApiDate(value: unknown): string {
  if (value === null || value === undefined || value === '') return ''
  const str = String(value).trim()
  const parsed = moment(str, DATE_FORMATS as unknown as string[], true)
  if (parsed.isValid()) return parsed.format('YYYY-MM-DD')
  const loose = moment(str)
  return loose.isValid() ? loose.format('YYYY-MM-DD') : ''
}

export function formatDisplayDate(value: unknown): string {
  if (value === null || value === undefined || value === '') return 'NA'
  const iso = parseApiDate(value)
  if (!iso) return 'NA'
  return moment(iso, 'YYYY-MM-DD').format("DD MMM 'YY")
}

export function toTimestamp(value: unknown): number {
  if (value === null || value === undefined || value === '') return 0
  const iso = parseApiDate(value)
  if (iso) return moment(iso, 'YYYY-MM-DD').valueOf()
  const parsed = moment(String(value), DATE_FORMATS as unknown as string[], true)
  return parsed.isValid() ? parsed.valueOf() : 0
}

export function todayIso(): string {
  return moment().format('YYYY-MM-DD')
}
