import { describe, it, expect } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useSort } from '../useSort'
import { holdings } from '../../fixtures/holdings'

// Derive expected orders from the fixture so tests stay in sync if data changes
const byTickerAsc = [...holdings].sort((a, b) => (a.ticker < b.ticker ? -1 : a.ticker > b.ticker ? 1 : 0))
const byTickerDesc = [...byTickerAsc].reverse()
const byValueAsc = [...holdings].sort((a, b) => a.value - b.value)

describe('useSort', () => {
  it('should return original order when no sort is applied', () => {
    const { result } = renderHook(() => useSort(holdings))

    expect(result.current.sortKey).toBeNull()
    expect(result.current.sorted).toEqual(holdings)
  })

  it('should default sort ascending on first column click', () => {
    const { result } = renderHook(() => useSort(holdings))

    act(() => result.current.handleHeaderClick('ticker'))

    expect(result.current.sortDir).toBe('asc')
  })

  it('should return sorted FundHoldings based on given field name', () => {
    const { result } = renderHook(() => useSort(holdings))

    act(() => result.current.handleHeaderClick('ticker'))

    expect(result.current.sorted.map(h => h.ticker)).toEqual(byTickerAsc.map(h => h.ticker))
  })

  it('should sort descending when the same column is clicked a second time', () => {
    const { result } = renderHook(() => useSort(holdings))

    act(() => result.current.handleHeaderClick('ticker'))
    act(() => result.current.handleHeaderClick('ticker'))

    expect(result.current.sortDir).toBe('desc')
    expect(result.current.sorted.map(h => h.ticker)).toEqual(byTickerDesc.map(h => h.ticker))
  })

  it('should reset to ascending and sort by the new field when a different column is clicked', () => {
    const { result } = renderHook(() => useSort(holdings))

    act(() => result.current.handleHeaderClick('ticker'))
    act(() => result.current.handleHeaderClick('ticker')) // now desc
    act(() => result.current.handleHeaderClick('value'))  // switch column → resets to asc

    expect(result.current.sortKey).toBe('value')
    expect(result.current.sortDir).toBe('asc')
    expect(result.current.sorted.map(h => h.value)).toEqual(byValueAsc.map(h => h.value))
  })

  it('should return original order and clear sortKey when clearSort is invoked', () => {
    const { result } = renderHook(() => useSort(holdings))

    act(() => result.current.handleHeaderClick('ticker'))
    act(() => result.current.clearSort())

    expect(result.current.sortKey).toBeNull()
    expect(result.current.sorted).toEqual(holdings)
  })
})
