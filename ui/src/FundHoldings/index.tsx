import { useState, useMemo } from 'react'
import type { FundHolding } from './types/FundHolding'
import { holdings } from './fixtures/holdings'
import styles from './FundHoldings.module.css'

type SortKey = keyof FundHolding
type SortDir = 'asc' | 'desc'

const columns: { key: SortKey; label: string }[] = [
  { key: 'ticker', label: 'Ticker' },
  { key: 'name', label: 'Name' },
  { key: 'weight', label: 'Weight' },
  { key: 'value', label: 'Value (USD)' },
]

export default function FundHoldings() {
  const [sortKey, setSortKey] = useState<SortKey | null>(null)
  const [sortDir, setSortDir] = useState<SortDir>('asc')

  const sorted = useMemo(() => {
    if (!sortKey) return holdings
    return [...holdings].sort((a, b) => {
      const av = a[sortKey]
      const bv = b[sortKey]
      const cmp = av < bv ? -1 : av > bv ? 1 : 0
      return sortDir === 'asc' ? cmp : -cmp
    })
  }, [sortKey, sortDir])

  const handleHeaderClick = (key: SortKey) => {
    if (sortKey === key) {
      setSortDir(d => (d === 'asc' ? 'desc' : 'asc'))
    } else {
      setSortKey(key)
      setSortDir('asc')
    }
  }

  const clearSort = (e: React.MouseEvent) => {
    e.stopPropagation()
    setSortKey(null)
  }

  return (
    <div className={styles.wrapper}>
      <table className={styles.table}>
        <thead>
          <tr>
            {columns.map(col => (
              <th
                key={col.key}
                className={styles.sortable}
                onClick={() => handleHeaderClick(col.key)}
              >
                <span className={styles.thContent}>
                  <span>{col.label}</span>
                  {sortKey === col.key && (
                    <span className={styles.sortControls}>
                      <span className={styles.sortIcon}>
                        {sortDir === 'asc' ? '↑' : '↓'}
                      </span>
                      <button className={styles.clearBtn} onClick={clearSort} title="Clear sort">
                        ✕
                      </button>
                    </span>
                  )}
                </span>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {sorted.map(h => (
            <tr key={h.ticker}>
              <td>{h.ticker}</td>
              <td>{h.name}</td>
              <td>{(h.weight * 100).toFixed(1)}%</td>
              <td>{h.value.toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
