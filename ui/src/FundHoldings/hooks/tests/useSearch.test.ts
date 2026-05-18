import { describe, it, expect } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useSearch, type SearchCriteria } from '../useSearch'
import type { FundHolding } from '../../types/FundHolding'

const data: FundHolding[] = [
  { ticker: 'AAPL', name: 'Apple Inc.', weight: 0.072, value: 215340 },
  { ticker: 'MSFT', name: 'Microsoft Corp.', weight: 0.065, value: 194880 },
  { ticker: 'NVDA', name: 'NVIDIA Corp.', weight: 0.058, value: 174120 },
  { ticker: 'AMZN', name: 'Amazon.com Inc.', weight: 0.041, value: 123060 },
  { ticker: 'GOOGL', name: 'Alphabet Inc.', weight: 0.038, value: 114040 },
]

const defaults: SearchCriteria = {
  ticker: '',
  name: '',
  weightMin: 0.038,
  weightMax: 0.072,
  valueMin: 114040,
  valueMax: 215340,
}

describe('useSearch', () => {
  it('should return all records when no search criteria is specified and apply is called', () => {
    const { result } = renderHook(() => useSearch(data, defaults))

    act(() => result.current.apply())

    expect(result.current.filtered).toEqual(data)
  })

  it('should return records with case-insensitive substring match on ticker when apply is called', () => {
    const { result } = renderHook(() => useSearch(data, defaults))

    act(() => result.current.setCriteria({ ...defaults, ticker: 'aa' }))
    act(() => result.current.apply())

    expect(result.current.filtered).toHaveLength(1)
    expect(result.current.filtered[0].ticker).toBe('AAPL')
  })

  it('should return records with case-insensitive substring match on name when apply is called', () => {
    const { result } = renderHook(() => useSearch(data, defaults))

    act(() => result.current.setCriteria({ ...defaults, name: 'corp' }))
    act(() => result.current.apply())

    const names = result.current.filtered.map(h => h.name)
    expect(names).toEqual(['Microsoft Corp.', 'NVIDIA Corp.'])
  })

  it('should return records with weight between weightMin and weightMax when apply is called', () => {
    const { result } = renderHook(() => useSearch(data, defaults))

    act(() => result.current.setCriteria({ ...defaults, weightMin: 0.055, weightMax: 0.070 }))
    act(() => result.current.apply())

    const tickers = result.current.filtered.map(h => h.ticker)
    expect(tickers).toEqual(['MSFT', 'NVDA'])
    result.current.filtered.forEach(h => {
      expect(h.weight).toBeGreaterThanOrEqual(0.055)
      expect(h.weight).toBeLessThanOrEqual(0.070)
    })
  })

  it('should return records with value between valueMin and valueMax when apply is called', () => {
    const { result } = renderHook(() => useSearch(data, defaults))

    act(() => result.current.setCriteria({ ...defaults, valueMin: 150000, valueMax: 200000 }))
    act(() => result.current.apply())

    const tickers = result.current.filtered.map(h => h.ticker)
    expect(tickers).toEqual(['MSFT', 'NVDA'])
    result.current.filtered.forEach(h => {
      expect(h.value).toBeGreaterThanOrEqual(150000)
      expect(h.value).toBeLessThanOrEqual(200000)
    })
  })

  it('should return no records when no data matches the given criteria and apply is called', () => {
    const { result } = renderHook(() => useSearch(data, defaults))

    act(() => result.current.setCriteria({ ...defaults, ticker: 'TSLA' }))
    act(() => result.current.apply())

    expect(result.current.filtered).toHaveLength(0)
  })

  it('should reset all filters and return all records when reset is called', () => {
    const { result } = renderHook(() => useSearch(data, defaults))

    act(() => result.current.setCriteria({ ...defaults, ticker: 'AAPL', weightMin: 0.065, valueMax: 180000 }))
    act(() => result.current.apply())
    expect(result.current.filtered).toHaveLength(0)

    act(() => result.current.reset())

    expect(result.current.criteria).toEqual(defaults)
    expect(result.current.filtered).toEqual(data)
  })
})
