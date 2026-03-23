import type { Meta, StoryObj } from "@storybook/react";
import { ThemeToggle } from "./ThemeToggle";

const meta: Meta<typeof ThemeToggle> = {
  title: "Components/ThemeToggle",
  tags: ["autodocs"],
  component: ThemeToggle,
};

export default meta;
type Story = StoryObj<typeof ThemeToggle>;

export const Default: Story = {
  render: () => <ThemeToggle />,
  parameters: {
    docs: {
      description: {
        story: "Toggles local theme preference (separate from Storybook toolbar theme).",
      },
    },
  },
};
