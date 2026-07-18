import type { CustomerLedgerData } from '../types/ledger'
import ledgerData from './json/ledger.json'

export const mockLedgerData = ledgerData as CustomerLedgerData

export function calculateCollectPay(entries: typeof mockLedgerData.entries): {
  status: 'You Collect' | 'You Pay'
  amount: number
} {
  const lastEntry = entries[entries.length - 1]
  const balance = lastEntry?.closingBalance ?? 0
  if (balance >= 0) {
    return { status: 'You Collect', amount: Math.abs(balance) }
  }
  return { status: 'You Pay', amount: Math.abs(balance) }
}
