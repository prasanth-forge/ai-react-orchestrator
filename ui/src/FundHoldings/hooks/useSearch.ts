import { useState, useMemo } from 'react'
import type { FundHolding } from '../types/FundHolding'

export interface SearchCriteria {
  ticker: string
  name: string
  weightMin: number
  weightMax: number
  valueMin: number
  valueMax: number
}

interface UseSearchResult {
  criteria: SearchCriteria
  setCriteria: (c: SearchCriteria) => void
  apply: () => void
  reset: () => void
  filtered: FundHolding[]
}

export function useSearch(data: FundHolding[], defaults: SearchCriteria): UseSearchResult {
  const [criteria, setCriteria] = useState<SearchCriteria>(defaults)
  const [activeCriteria, setActiveCriteria] = useState<SearchCriteria>(defaults)

  const filtered = useMemo(() => {
    return data.filter(h => {
      if (activeCriteria.ticker && !h.ticker.toLowerCase().includes(activeCriteria.ticker.toLowerCase())) return false
      if (activeCriteria.name && !h.name.toLowerCase().includes(activeCriteria.name.toLowerCase())) return false
      if (h.weight < activeCriteria.weightMin || h.weight > activeCriteria.weightMax) return false
      if (h.value < activeCriteria.valueMin || h.value > activeCriteria.valueMax) return false
      return true
    })
  }, [data, activeCriteria])

  const apply = () => setActiveCriteria(criteria)

  const reset = () => {
    setCriteria(defaults)
    setActiveCriteria(defaults)
  }

  return { criteria, setCriteria, apply, reset, filtered }
}
