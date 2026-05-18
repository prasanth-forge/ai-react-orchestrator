import { holdings } from './fixtures/holdings'
import { useSort } from './hooks/useSort'
import { useSearch, type SearchCriteria } from './hooks/useSearch'
import Table from './components/Table'
import Search from './components/Search'

const weightMin = Math.min(...holdings.map(h => h.weight))
const weightMax = Math.max(...holdings.map(h => h.weight))
const valueMin = Math.min(...holdings.map(h => h.value))
const valueMax = Math.max(...holdings.map(h => h.value))

const defaultCriteria: SearchCriteria = {
  ticker: '',
  name: '',
  weightMin,
  weightMax,
  valueMin,
  valueMax,
}

export default function FundHoldings() {
  const { criteria, setCriteria, apply, reset, filtered } = useSearch(holdings, defaultCriteria)
  const { sortKey, sortDir, sorted, handleHeaderClick, clearSort } = useSort(filtered)

  return (
    <div>
      <Search
        criteria={criteria}
        onChange={setCriteria}
        onApply={apply}
        onReset={reset}
        weightMin={weightMin}
        weightMax={weightMax}
        valueMin={valueMin}
        valueMax={valueMax}
      />
      <Table
        holdings={sorted}
        sortKey={sortKey}
        sortDir={sortDir}
        onHeaderClick={handleHeaderClick}
        onClearSort={clearSort}
      />
    </div>
  )
}
