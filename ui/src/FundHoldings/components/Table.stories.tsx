import type { Meta, StoryObj } from '@storybook/react'
import { fn } from 'storybook/test'
import Table from './Table'
import { holdings } from '../fixtures/holdings'

const meta: Meta<typeof Table> = {
  component: Table,
  decorators: [
    Story => (
      <div style={{ padding: '24px' }}>
        <Story />
      </div>
    ),
  ],
  args: {
    onHeaderClick: fn(),
    onClearSort: fn(),
  },
}

export default meta
type Story = StoryObj<typeof Table>

export const Default: Story = {
  args: {
    holdings,
    sortKey: null,
    sortDir: 'asc',
  },
}

export const SortedByTickerAscending: Story = {
  args: {
    holdings: [...holdings].sort((a, b) => (a.ticker < b.ticker ? -1 : 1)),
    sortKey: 'ticker',
    sortDir: 'asc',
  },
}

export const SortedByTickerDescending: Story = {
  args: {
    holdings: [...holdings].sort((a, b) => (a.ticker > b.ticker ? -1 : 1)),
    sortKey: 'ticker',
    sortDir: 'desc',
  },
}

export const SortedByValueDescending: Story = {
  args: {
    holdings: [...holdings].sort((a, b) => b.value - a.value),
    sortKey: 'value',
    sortDir: 'desc',
  },
}

export const Empty: Story = {
  args: {
    holdings: [],
    sortKey: null,
    sortDir: 'asc',
  },
}
