import type { FundHolding, SortKey, SortDir } from '../types/FundHolding'
import styles from '../FundHoldings.module.css'

const columns: { key: SortKey; label: string }[] = [
  { key: 'ticker', label: 'Ticker' },
  { key: 'name', label: 'Name' },
  { key: 'weight', label: 'Weight' },
  { key: 'value', label: 'Value (USD)' },
]

interface TableProps {
  holdings: FundHolding[]
  sortKey: SortKey | null
  sortDir: SortDir
  onHeaderClick: (key: SortKey) => void
  onClearSort: () => void
}

export default function Table({ holdings, sortKey, sortDir, onHeaderClick, onClearSort }: TableProps) {
  return (
    <div className={styles.wrapper}>
      <table className={styles.table}>
        <thead>
          <tr>
            {columns.map(col => (
              <th
                key={col.key}
                className={styles.sortable}
                onClick={() => onHeaderClick(col.key)}
              >
                <span className={styles.thContent}>
                  <span>{col.label}</span>
                  {sortKey === col.key && (
                    <span className={styles.sortControls}>
                      <span className={styles.sortIcon}>
                        {sortDir === 'asc' ? '↑' : '↓'}
                      </span>
                      <button
                        className={styles.clearBtn}
                        onClick={e => { e.stopPropagation(); onClearSort() }}
                        title="Clear sort"
                      >
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
          {holdings.map(h => (
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
