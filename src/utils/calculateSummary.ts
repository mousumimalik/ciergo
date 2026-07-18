import type { FinancialSummary } from '../types/booking'
import summaryData from '../data/json/summary.json'

export function calculateSummary(): FinancialSummary {
  const { youGive, youGet } = summaryData
  const net = youGet - youGive
  return { youGive, youGet, net }
}
