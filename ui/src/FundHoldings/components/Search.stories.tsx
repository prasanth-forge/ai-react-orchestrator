import { useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react'
import { fn } from 'storybook/test'
import Search from './Search'
import type { SearchCriteria } from '../hooks/useSearch'
import { holdings } from '../fixtures/holdings'

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

const meta: Meta<typeof Search> = {
  component: Search,
  decorators: [
    Story => (
      <div style={{ padding: '24px' }}>
        <Story />
      </div>
    ),
  ],
  args: {
    weightMin,
    weightMax,
    valueMin,
    valueMax,
    onApply: fn(),
    onReset: fn(),
    onChange: fn(),
  },
}

export default meta
type Story = StoryObj<typeof Search>

// Stateful wrapper — Search is controlled so criteria needs local state
const Interactive = (args: React.ComponentProps<typeof Search>) => {
  const [criteria, setCriteria] = useState<SearchCriteria>(args.criteria)
  return (
    <Search
      {...args}
      criteria={criteria}
      onChange={setCriteria}
      onReset={() => {
        setCriteria(args.criteria) // restore to the story's initial criteria
        args.onReset()
      }}
    />
  )
}

export const Default: Story = {
  render: Interactive,
  args: {
    criteria: defaultCriteria,
  },
}

export const WithTickerFilter: Story = {
  render: Interactive,
  args: {
    criteria: { ...defaultCriteria, ticker: 'AA' },
  },
}

export const WithNameFilter: Story = {
  render: Interactive,
  args: {
    criteria: { ...defaultCriteria, name: 'corp' },
  },
}

export const WithRangeFilters: Story = {
  render: Interactive,
  args: {
    criteria: {
      ...defaultCriteria,
      weightMin: 0.05,
      weightMax: 0.068,
      valueMin: 150000,
      valueMax: 200000,
    },
  },
}
