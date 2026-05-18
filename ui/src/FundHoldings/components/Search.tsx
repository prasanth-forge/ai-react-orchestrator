import type { SearchCriteria } from '../hooks/useSearch'
import styles from './Search.module.css'

interface SearchProps {
  criteria: SearchCriteria
  onChange: (criteria: SearchCriteria) => void
  onApply: () => void
  onReset: () => void
  weightMin: number
  weightMax: number
  valueMin: number
  valueMax: number
}

export default function Search({
  criteria,
  onChange,
  onApply,
  onReset,
  weightMin,
  weightMax,
  valueMin,
  valueMax,
}: SearchProps) {
  const update = (patch: Partial<SearchCriteria>) => onChange({ ...criteria, ...patch })

  return (
    <div className={styles.container}>
      <div className={styles.fields}>

        <label className={styles.field}>
          <span className={styles.label}>Ticker</span>
          <input
            type="text"
            className={styles.textInput}
            value={criteria.ticker}
            onChange={e => update({ ticker: e.target.value })}
            placeholder="e.g. AAPL"
          />
        </label>

        <label className={styles.field}>
          <span className={styles.label}>Name</span>
          <input
            type="text"
            className={styles.textInput}
            value={criteria.name}
            onChange={e => update({ name: e.target.value })}
            placeholder="e.g. Apple"
          />
        </label>

        <label className={styles.field}>
          <span className={styles.label}>
            Weight min <span className={styles.value}>{(criteria.weightMin * 100).toFixed(1)}%</span>
          </span>
          <input
            type="range"
            min={weightMin}
            max={criteria.weightMax}
            step={0.001}
            value={criteria.weightMin}
            onChange={e => update({ weightMin: parseFloat(e.target.value) })}
          />
        </label>

        <label className={styles.field}>
          <span className={styles.label}>
            Weight max <span className={styles.value}>{(criteria.weightMax * 100).toFixed(1)}%</span>
          </span>
          <input
            type="range"
            min={criteria.weightMin}
            max={weightMax}
            step={0.001}
            value={criteria.weightMax}
            onChange={e => update({ weightMax: parseFloat(e.target.value) })}
          />
        </label>

        <label className={styles.field}>
          <span className={styles.label}>
            Value min <span className={styles.value}>{criteria.valueMin.toLocaleString()}</span>
          </span>
          <input
            type="range"
            min={valueMin}
            max={criteria.valueMax}
            step={1000}
            value={criteria.valueMin}
            onChange={e => update({ valueMin: parseInt(e.target.value, 10) })}
          />
        </label>

        <label className={styles.field}>
          <span className={styles.label}>
            Value max <span className={styles.value}>{criteria.valueMax.toLocaleString()}</span>
          </span>
          <input
            type="range"
            min={criteria.valueMin}
            max={valueMax}
            step={1000}
            value={criteria.valueMax}
            onChange={e => update({ valueMax: parseInt(e.target.value, 10) })}
          />
        </label>

      </div>

      <div className={styles.actions}>
        <button className={styles.applyBtn} onClick={onApply}>Apply</button>
        <button className={styles.resetBtn} onClick={onReset}>Reset</button>
      </div>
    </div>
  )
}
