import { useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react'
import RangeSlider from './RangeSlider'
import { holdings } from '../fixtures/holdings'

const weightMin = Math.min(...holdings.map(h => h.weight))
const weightMax = Math.max(...holdings.map(h => h.weight))
const valueMin = Math.min(...holdings.map(h => h.value))
const valueMax = Math.max(...holdings.map(h => h.value))

const meta: Meta<typeof RangeSlider> = {
  component: RangeSlider,
  decorators: [
    Story => (
      <div style={{ padding: '32px', width: '280px' }}>
        <Story />
      </div>
    ),
  ],
}

export default meta
type Story = StoryObj<typeof RangeSlider>

// Stateful wrapper — RangeSlider is controlled so it needs local state to be interactive
const Interactive = (args: React.ComponentProps<typeof RangeSlider>) => {
  const [min, setMin] = useState(args.valueMin)
  const [max, setMax] = useState(args.valueMax)
  return (
    <RangeSlider
      {...args}
      valueMin={min}
      valueMax={max}
      onChangeMin={setMin}
      onChangeMax={setMax}
    />
  )
}

export const WeightRangeDefault: Story = {
  render: Interactive,
  args: {
    min: weightMin,
    max: weightMax,
    valueMin: weightMin,
    valueMax: weightMax,
    step: 0.001,
  },
}

export const WeightRangeFiltered: Story = {
  render: Interactive,
  args: {
    min: weightMin,
    max: weightMax,
    valueMin: 0.05,
    valueMax: 0.068,
    step: 0.001,
  },
}

export const ValueRangeDefault: Story = {
  render: Interactive,
  args: {
    min: valueMin,
    max: valueMax,
    valueMin: valueMin,
    valueMax: valueMax,
    step: 1000,
  },
}

export const ValueRangeFiltered: Story = {
  render: Interactive,
  args: {
    min: valueMin,
    max: valueMax,
    valueMin: 150000,
    valueMax: 200000,
    step: 1000,
  },
}
