import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { Button } from "./core/Button";
import { DeleteConfirmDialog } from "./DeleteConfirmDialog";

const meta: Meta<typeof DeleteConfirmDialog> = {
  title: "Components/DeleteConfirmDialog",
  tags: ["autodocs"],
  component: DeleteConfirmDialog,
};

export default meta;
type Story = StoryObj<typeof DeleteConfirmDialog>;

function Harness() {
  const [open, setOpen] = useState(true);
  return (
    <div>
      <Button size="sm" variant="danger" onClick={() => setOpen(true)}>
        Delete
      </Button>
      <DeleteConfirmDialog
        open={open}
        onOpenChange={setOpen}
        title="Delete item?"
        description="This cannot be undone."
        onConfirm={() => setOpen(false)}
      />
    </div>
  );
}

export const Default: Story = {
  render: () => <Harness />,
};
