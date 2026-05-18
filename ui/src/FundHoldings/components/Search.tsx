import type { SearchCriteria } from '../hooks/useSearch'
import RangeSlider from './RangeSlider'
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
            data-testid="search-ticker"
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
            data-testid="search-name"
            value={criteria.name}
            onChange={e => update({ name: e.target.value })}
            placeholder="e.g. Apple"
          />
        </label>

        <div className={styles.field}>
          <span className={styles.label}>
            Weight
            <span className={styles.value}>
              {(criteria.weightMin * 100).toFixed(1)}% – {(criteria.weightMax * 100).toFixed(1)}%
            </span>
          </span>
          <RangeSlider
            min={weightMin}
            max={weightMax}
            valueMin={criteria.weightMin}
            valueMax={criteria.weightMax}
            step={0.001}
            testId="weight"
            onChangeMin={v => update({ weightMin: v })}
            onChangeMax={v => update({ weightMax: v })}
          />
        </div>

        <div className={styles.field}>
          <span className={styles.label}>
            Value
            <span className={styles.value}>
              {criteria.valueMin.toLocaleString()} – {criteria.valueMax.toLocaleString()}
            </span>
          </span>
          <RangeSlider
            min={valueMin}
            max={valueMax}
            valueMin={criteria.valueMin}
            valueMax={criteria.valueMax}
            step={1000}
            testId="value"
            onChangeMin={v => update({ valueMin: v })}
            onChangeMax={v => update({ valueMax: v })}
          />
        </div>

      </div>

      <div className={styles.actions}>
        <button className={styles.applyBtn} data-testid="search-apply" onClick={onApply}>Apply</button>
        <button className={styles.resetBtn} data-testid="search-reset" onClick={onReset}>Reset</button>
      </div>
    </div>
  )
}
