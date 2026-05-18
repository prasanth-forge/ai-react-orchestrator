export interface FundHolding {
  ticker: string
  name: string
  weight: number
  value: number
}

export type SortKey = keyof FundHolding
export type SortDir = 'asc' | 'desc'
