export const CURRENCY = '₹'

export function formatCurrency(amount: number): string {
  return `${CURRENCY} ${amount.toLocaleString('en-IN')}`
}

export function formatDate(dateStr: string): string {
  const date = new Date(dateStr)
  const day = date.getDate().toString().padStart(2, '0')
  const month = date.toLocaleString('en-IN', { month: 'short' })
  const year = date.getFullYear().toString().slice(-2)
  return `${day} ${month} '${year}`
}

export function getCurrentFinancialYear(): { start: string; end: string } {
  const now = new Date()
  const year = now.getFullYear()
  const month = now.getMonth()
  const fyStartYear = month >= 3 ? year : year - 1
  const start = `${fyStartYear}-04-01`
  const end = `${fyStartYear + 1}-03-31`
  return { start, end }
}
