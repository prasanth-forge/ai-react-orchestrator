import { describe, it, expect } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useSearch, type SearchCriteria } from '../useSearch'
import { holdings } from '../../fixtures/holdings'

// Derive bounds from the fixture — mirrors how index.tsx builds defaultCriteria
const defaults: SearchCriteria = {
  ticker: '',
  name: '',
  weightMin: Math.min(...holdings.map(h => h.weight)),
  weightMax: Math.max(...holdings.map(h => h.weight)),
  valueMin: Math.min(...holdings.map(h => h.value)),
  valueMax: Math.max(...holdings.map(h => h.value)),
}

describe('useSearch', () => {
  it('should return all records when no search criteria is specified and apply is called', () => {
    const { result } = renderHook(() => useSearch(holdings, defaults))

    act(() => result.current.apply())

    expect(result.current.filtered).toEqual(holdings)
  })

  it('should return records with case-insensitive substring match on ticker when apply is called', () => {
    const { result } = renderHook(() => useSearch(holdings, defaults))
    const query = 'aa'
    const expected = holdings.filter(h => h.ticker.toLowerCase().includes(query))

    act(() => result.current.setCriteria({ ...defaults, ticker: query }))
    act(() => result.current.apply())

    expect(result.current.filtered).toEqual(expected)
  })

  it('should return records with case-insensitive substring match on name when apply is called', () => {
    const { result } = renderHook(() => useSearch(holdings, defaults))
    const query = 'corp'
    const expected = holdings.filter(h => h.name.toLowerCase().includes(query))

    act(() => result.current.setCriteria({ ...defaults, name: query }))
    act(() => result.current.apply())

    expect(result.current.filtered).toEqual(expected)
  })

  it('should return records with weight between weightMin and weightMax when apply is called', () => {
    const { result } = renderHook(() => useSearch(holdings, defaults))
    const weightMin = 0.055
    const weightMax = 0.070
    const expected = holdings.filter(h => h.weight >= weightMin && h.weight <= weightMax)

    act(() => result.current.setCriteria({ ...defaults, weightMin, weightMax }))
    act(() => result.current.apply())

    expect(result.current.filtered).toEqual(expected)
    result.current.filtered.forEach(h => {
      expect(h.weight).toBeGreaterThanOrEqual(weightMin)
      expect(h.weight).toBeLessThanOrEqual(weightMax)
    })
  })

  it('should return records with value between valueMin and valueMax when apply is called', () => {
    const { result } = renderHook(() => useSearch(holdings, defaults))
    const valueMin = 150000
    const valueMax = 200000
    const expected = holdings.filter(h => h.value >= valueMin && h.value <= valueMax)

    act(() => result.current.setCriteria({ ...defaults, valueMin, valueMax }))
    act(() => result.current.apply())

    expect(result.current.filtered).toEqual(expected)
    result.current.filtered.forEach(h => {
      expect(h.value).toBeGreaterThanOrEqual(valueMin)
      expect(h.value).toBeLessThanOrEqual(valueMax)
    })
  })

  it('should return no records when no data matches the given criteria and apply is called', () => {
    const { result } = renderHook(() => useSearch(holdings, defaults))

    act(() => result.current.setCriteria({ ...defaults, ticker: 'TSLA' }))
    act(() => result.current.apply())

    expect(result.current.filtered).toHaveLength(0)
  })

  it('should reset all filters and return all records when reset is called', () => {
    const { result } = renderHook(() => useSearch(holdings, defaults))

    act(() => result.current.setCriteria({ ...defaults, ticker: 'AAPL', weightMin: 0.065, valueMax: 180000 }))
    act(() => result.current.apply())
    expect(result.current.filtered).toHaveLength(0)

    act(() => result.current.reset())

    expect(result.current.criteria).toEqual(defaults)
    expect(result.current.filtered).toEqual(holdings)
  })
})
