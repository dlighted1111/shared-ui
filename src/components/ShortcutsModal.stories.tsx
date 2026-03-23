import type { Meta, StoryObj } from "@storybook/react";
import { ShortcutsModal } from "./ShortcutsModal";

const meta: Meta<typeof ShortcutsModal> = {
  title: "Components/ShortcutsModal",
  tags: ["autodocs"],
  component: ShortcutsModal,
  args: {
    sections: [
      {
        title: "General",
        items: [
          { action: "Open shortcuts", keys: "?" },
          { action: "Close", keys: "Esc" },
        ],
      },
    ],
  },
};

export default meta;
type Story = StoryObj<typeof ShortcutsModal>;

export const Default: Story = {
  parameters: {
    docs: {
      description: {
        story: "Press ? in the preview (without modifiers) to toggle the shortcuts modal.",
      },
    },
  },
};
