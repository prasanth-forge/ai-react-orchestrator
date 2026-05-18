import styles from './RangeSlider.module.css'

interface RangeSliderProps {
  min: number
  max: number
  valueMin: number
  valueMax: number
  step: number
  onChangeMin: (v: number) => void
  onChangeMax: (v: number) => void
}

export default function RangeSlider({
  min, max, valueMin, valueMax, step, onChangeMin, onChangeMax,
}: RangeSliderProps) {
  const range = max - min
  const minPct = range === 0 ? 0 : ((valueMin - min) / range) * 100
  const maxPct = range === 0 ? 100 : ((valueMax - min) / range) * 100

  return (
    <div className={styles.container}>
      <div className={styles.rail} />
      <div className={styles.fill} style={{ left: `${minPct}%`, width: `${maxPct - minPct}%` }} />
      <input
        type="range"
        className={styles.thumb}
        style={{ zIndex: minPct >= 95 ? 5 : 3 }}
        min={min}
        max={max}
        step={step}
        value={valueMin}
        onChange={e => onChangeMin(Math.min(parseFloat(e.target.value), valueMax - step))}
      />
      <input
        type="range"
        className={styles.thumb}
        style={{ zIndex: 4 }}
        min={min}
        max={max}
        step={step}
        value={valueMax}
        onChange={e => onChangeMax(Math.max(parseFloat(e.target.value), valueMin + step))}
      />
    </div>
  )
}
