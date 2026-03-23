import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { Button } from "./core/Button";
import { ConfirmDialog } from "./ConfirmDialog";

const meta: Meta<typeof ConfirmDialog> = {
  title: "Components/ConfirmDialog",
  tags: ["autodocs"],
  component: ConfirmDialog,
};

export default meta;
type Story = StoryObj<typeof ConfirmDialog>;

function Harness() {
  const [open, setOpen] = useState(true);
  return (
    <div>
      <Button size="sm" onClick={() => setOpen(true)}>
        Open confirm dialog
      </Button>
      <ConfirmDialog
        open={open}
        onOpenChange={setOpen}
        title="Confirm action"
        description="This is a placeholder confirmation."
        onConfirm={() => setOpen(false)}
      />
    </div>
  );
}

export const Default: Story = {
  render: () => <Harness />,
};
