import { useState, useMemo } from 'react'
import type { FundHolding, SortKey, SortDir } from '../types/FundHolding'

interface UseSortResult {
  sortKey: SortKey | null
  sortDir: SortDir
  sorted: FundHolding[]
  handleHeaderClick: (key: SortKey) => void
  clearSort: () => void
}

export function useSort(data: FundHolding[]): UseSortResult {
  const [sortKey, setSortKey] = useState<SortKey | null>(null)
  const [sortDir, setSortDir] = useState<SortDir>('asc')

  const sorted = useMemo(() => {
    if (!sortKey) return data
    return [...data].sort((a, b) => {
      const av = a[sortKey]
      const bv = b[sortKey]
      const cmp = av < bv ? -1 : av > bv ? 1 : 0
      return sortDir === 'asc' ? cmp : -cmp
    })
  }, [data, sortKey, sortDir])

  const handleHeaderClick = (key: SortKey) => {
    if (sortKey === key) {
      setSortDir(d => (d === 'asc' ? 'desc' : 'asc'))
    } else {
      setSortKey(key)
      setSortDir('asc')
    }
  }

  const clearSort = () => setSortKey(null)

  return { sortKey, sortDir, sorted, handleHeaderClick, clearSort }
}
