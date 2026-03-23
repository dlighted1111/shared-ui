import type { Meta, StoryObj } from "@storybook/react";
import { ThemeProvider } from "./ThemeProvider";

const meta: Meta<typeof ThemeProvider> = {
  title: "Foundation/ThemeProvider",
  tags: ["autodocs"],
  component: ThemeProvider,
  parameters: {
    layout: "fullscreen",
  },
};

export default meta;

type Story = StoryObj<typeof ThemeProvider>;

function ThemeSurface() {
  return (
    <div
      style={{
        background: "var(--lt-color-surface)",
        color: "var(--lt-color-text)",
        border: "1px solid var(--lt-color-border)",
        borderRadius: "var(--lt-radius-md)",
        boxShadow: "var(--lt-shadow-sm)",
        maxWidth: 560,
        padding: "var(--lt-space-6)",
      }}
    >
      <h3 style={{ margin: 0, fontSize: "var(--lt-font-size-lg)" }}>Theme foundation preview</h3>
      <p style={{ color: "var(--lt-color-text-muted)", marginTop: "var(--lt-space-3)" }}>
        These surfaces are wired through shared design tokens provided by ThemeProvider.
      </p>
      <button
        type="button"
        style={{
          marginTop: "var(--lt-space-4)",
          borderRadius: "var(--lt-radius-sm)",
          border: "1px solid transparent",
          background: "var(--lt-color-primary)",
          color: "var(--lt-color-primary-contrast)",
          cursor: "pointer",
          fontSize: "var(--lt-font-size-sm)",
          padding: "10px 14px",
        }}
      >
        Tokenized action
      </button>
    </div>
  );
}

export const Light: Story = {
  args: {
    initialMode: "light",
    disableStorage: true,
    children: <ThemeSurface />,
  },
};

export const Dark: Story = {
  args: {
    initialMode: "dark",
    disableStorage: true,
    children: <ThemeSurface />,
  },
};
