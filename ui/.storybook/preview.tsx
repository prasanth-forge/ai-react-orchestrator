import type { Preview } from '@storybook/react-vite'

const preview: Preview = {
  parameters: {
    backgrounds: {
      default: 'dashboard',
      values: [{ name: 'dashboard', value: '#0d1117' }],
    },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    a11y: {
      test: 'todo',
    },
  },
}

export default preview
