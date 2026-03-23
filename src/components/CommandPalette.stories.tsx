import type { Meta, StoryObj } from "@storybook/react";
import { CommandPalette } from "./CommandPalette";

const meta: Meta<typeof CommandPalette> = {
  title: "Components/CommandPalette",
  tags: ["autodocs"],
  component: CommandPalette,
  args: {
    pages: [
      { id: "home", label: "Home", path: "/" },
      { id: "settings", label: "Settings", path: "/settings" },
    ],
    searchRecords: async () => [],
    onSelect: () => {},
  },
};

export default meta;
type Story = StoryObj<typeof CommandPalette>;

export const Default: Story = {
  parameters: {
    docs: {
      description: {
        story: "Use ⌘K (Ctrl+K) to open the command palette in the preview.",
      },
    },
  },
};
