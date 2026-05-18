import styles from './FundHoldings.module.css'

interface FundHolding {
  ticker: string
  name: string
  weight: number
  value: number
}

const holdings: FundHolding[] = [
  { ticker: 'AAPL', name: 'Apple Inc.', weight: 0.072, value: 215340 },
  { ticker: 'MSFT', name: 'Microsoft Corp.', weight: 0.065, value: 194880 },
  { ticker: 'NVDA', name: 'NVIDIA Corp.', weight: 0.058, value: 174120 },
  { ticker: 'AMZN', name: 'Amazon.com Inc.', weight: 0.041, value: 123060 },
  { ticker: 'GOOGL', name: 'Alphabet Inc.', weight: 0.038, value: 114040 },
]

export default function FundHoldings() {
  return (
    <div className={styles.wrapper}>
    <table className={styles.table}>
      <thead>
        <tr>
          <th>Ticker</th>
          <th>Name</th>
          <th>Weight</th>
          <th>Value (USD)</th>
        </tr>
      </thead>
      <tbody>
        {holdings.map((h) => (
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
