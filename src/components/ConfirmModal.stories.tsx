import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { Button } from "./core/Button";
import { ConfirmModal } from "./ConfirmModal";

const meta: Meta<typeof ConfirmModal> = {
  title: "Components/ConfirmModal",
  tags: ["autodocs"],
  component: ConfirmModal,
};

export default meta;
type Story = StoryObj<typeof ConfirmModal>;

function Harness() {
  const [open, setOpen] = useState(true);
  return (
    <div>
      <Button size="sm" onClick={() => setOpen(true)}>
        Open confirm modal
      </Button>
      <ConfirmModal
        open={open}
        title="Are you sure?"
        message="This modal is a static preview."
        onConfirm={() => setOpen(false)}
        onCancel={() => setOpen(false)}
      />
    </div>
  );
}

export const Default: Story = {
  render: () => <Harness />,
};
