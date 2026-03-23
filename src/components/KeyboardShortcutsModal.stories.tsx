import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { Button } from "./core/Button";
import { KeyboardShortcutsModal } from "./KeyboardShortcutsModal";

const meta: Meta<typeof KeyboardShortcutsModal> = {
  title: "Components/KeyboardShortcutsModal",
  tags: ["autodocs"],
  component: KeyboardShortcutsModal,
};

export default meta;
type Story = StoryObj<typeof KeyboardShortcutsModal>;

function Harness() {
  const [open, setOpen] = useState(true);
  return (
    <div>
      <Button size="sm" onClick={() => setOpen(true)}>
        Open shortcuts
      </Button>
      <KeyboardShortcutsModal
        open={open}
        onClose={() => setOpen(false)}
        sections={[
          {
            title: "Navigation",
            items: [
              { action: "Go home", keys: "g h" },
              { action: "Search", keys: ["⌘", "K"] },
            ],
          },
        ]}
      />
    </div>
  );
}

export const Default: Story = {
  render: () => <Harness />,
};
