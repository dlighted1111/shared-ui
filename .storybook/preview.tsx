import type { Preview } from '@storybook/react';
import React from 'react';
import { ThemeProvider, type ThemeMode } from '../src/theme';

const preview: Preview = {
  globalTypes: {
    theme: {
      name: 'Theme',
      description: 'Global theme mode',
      defaultValue: 'light',
      toolbar: {
        icon: 'paintbrush',
        items: [
          { value: 'light', title: 'Light' },
          { value: 'dark', title: 'Dark' },
          { value: 'system', title: 'System' },
        ],
      },
    },
  },
  decorators: [
    (Story, context) => (
      <ThemeProvider
        initialMode={context.globals.theme as ThemeMode}
        disableStorage
        className="sb-theme-root"
      >
        <div
          style={{
            background: 'var(--lt-color-bg)',
            color: 'var(--lt-color-text)',
            minHeight: '100vh',
            padding: '24px',
            fontFamily: 'system-ui, sans-serif',
          }}
        >
          <Story />
        </div>
      </ThemeProvider>
    ),
  ],
};

export default preview;
