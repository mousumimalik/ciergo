import type { PaymentParty } from '../types/payment'

const LETTERS = 'ABCDEFGHJKLMNPQRSTUVWXYZ'
const NUMBERS = '0123456789'

function randomChar(pool: string): string {
  return pool[Math.floor(Math.random() * pool.length)]
}

function shuffle(chars: string[]): string[] {
  const arr = [...chars]
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[arr[i], arr[j]] = [arr[j], arr[i]]
  }
  return arr
}

export function generatePaymentId(party: PaymentParty): string {
  const prefix = party === 'customer' ? 'PI-' : 'PO-'
  const chars = shuffle([
    randomChar(LETTERS),
    randomChar(LETTERS),
    randomChar(NUMBERS),
    randomChar(NUMBERS),
    randomChar(LETTERS),
  ])
  return prefix + chars.join('')
}
