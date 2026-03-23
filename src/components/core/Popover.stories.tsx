import type { Meta, StoryObj } from "@storybook/react";
import { Button } from "./Button";
import { Popover, PopoverContent, PopoverTrigger } from "./Popover";

const meta: Meta = {
  title: "Core/Popover",
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj;

export const Default: Story = {
  render: () => (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="secondary" size="sm">
          Open popover
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-64 p-3 text-sm">Popover body content.</PopoverContent>
    </Popover>
  ),
};
