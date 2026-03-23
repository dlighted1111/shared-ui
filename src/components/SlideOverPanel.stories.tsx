import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { Button } from "./core/Button";
import { SlideOverPanel } from "./SlideOverPanel";

const meta: Meta<typeof SlideOverPanel> = {
  title: "Components/SlideOverPanel",
  tags: ["autodocs"],
  component: SlideOverPanel,
};

export default meta;
type Story = StoryObj<typeof SlideOverPanel>;

function Harness() {
  const [open, setOpen] = useState(true);
  return (
    <div>
      <Button size="sm" onClick={() => setOpen(true)}>
        Open panel
      </Button>
      <SlideOverPanel open={open} onClose={() => setOpen(false)} title="Details">
        <p className="text-sm text-muted-foreground">Slide-over body placeholder.</p>
      </SlideOverPanel>
    </div>
  );
}

export const Default: Story = {
  render: () => <Harness />,
};
