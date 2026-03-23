import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { Button } from "./Button";
import { Modal } from "./Modal";

const meta: Meta<typeof Modal> = {
  title: "Core/Modal",
  component: Modal,
  args: {
    title: "Confirm action",
    description: "This operation cannot be undone.",
  },
};

export default meta;
type Story = StoryObj<typeof Modal>;

function ModalHarness(args: Story["args"]) {
  const [open, setOpen] = useState(false);
  return (
    <div>
      <Button onClick={() => setOpen(true)}>Open modal</Button>
      <Modal {...args} open={open} onClose={() => setOpen(false)}>
        <p style={{ margin: 0 }}>Review details before continuing.</p>
      </Modal>
    </div>
  );
}

export const Default: Story = {
  render: (args) => <ModalHarness {...args} />,
};

export const Dark: Story = {
  render: (args) => <ModalHarness {...args} />,
  parameters: {
    globals: {
      theme: "dark",
    },
  },
};
