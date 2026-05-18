import { describe, it, expect } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useSort } from '../useSort'
import type { FundHolding } from '../../types/FundHolding'

const data: FundHolding[] = [
  { ticker: 'NVDA', name: 'NVIDIA Corp.', weight: 0.058, value: 174120 },
  { ticker: 'AAPL', name: 'Apple Inc.', weight: 0.072, value: 215340 },
  { ticker: 'AMZN', name: 'Amazon.com Inc.', weight: 0.041, value: 123060 },
]

describe('useSort', () => {
  it('should return original order when no sort is applied', () => {
    const { result } = renderHook(() => useSort(data))

    expect(result.current.sortKey).toBeNull()
    expect(result.current.sorted).toEqual(data)
  })

  it('should default sort ascending on first column click', () => {
    const { result } = renderHook(() => useSort(data))

    act(() => result.current.handleHeaderClick('ticker'))

    expect(result.current.sortDir).toBe('asc')
  })

  it('should return sorted FundHoldings based on given field name', () => {
    const { result } = renderHook(() => useSort(data))

    act(() => result.current.handleHeaderClick('ticker'))

    const tickers = result.current.sorted.map(h => h.ticker)
    expect(tickers).toEqual(['AAPL', 'AMZN', 'NVDA'])
  })

  it('should sort descending when the same column is clicked a second time', () => {
    const { result } = renderHook(() => useSort(data))

    act(() => result.current.handleHeaderClick('ticker'))
    act(() => result.current.handleHeaderClick('ticker'))

    expect(result.current.sortDir).toBe('desc')
    const tickers = result.current.sorted.map(h => h.ticker)
    expect(tickers).toEqual(['NVDA', 'AMZN', 'AAPL'])
  })

  it('should reset to ascending and sort by the new field when a different column is clicked', () => {
    const { result } = renderHook(() => useSort(data))

    act(() => result.current.handleHeaderClick('ticker'))
    act(() => result.current.handleHeaderClick('ticker')) // now desc
    act(() => result.current.handleHeaderClick('value'))  // switch column → resets to asc

    expect(result.current.sortKey).toBe('value')
    expect(result.current.sortDir).toBe('asc')
    const values = result.current.sorted.map(h => h.value)
    expect(values).toEqual([123060, 174120, 215340])
  })

  it('should return original order and clear sortKey when clearSort is invoked', () => {
    const { result } = renderHook(() => useSort(data))

    act(() => result.current.handleHeaderClick('ticker'))
    act(() => result.current.clearSort())

    expect(result.current.sortKey).toBeNull()
    expect(result.current.sorted).toEqual(data)
  })
})
