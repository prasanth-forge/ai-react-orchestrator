import type { Meta, StoryObj } from '@storybook/react'
import FundHoldings from './index'

const meta: Meta<typeof FundHoldings> = {
  component: FundHoldings,
  parameters: {
    layout: 'fullscreen',
  },
  decorators: [
    Story => (
      <div style={{ padding: '32px', backgroundColor: '#0d1117', minHeight: '100vh' }}>
        <Story />
      </div>
    ),
  ],
}

export default meta
type Story = StoryObj<typeof FundHoldings>

export const Default: Story = {}
