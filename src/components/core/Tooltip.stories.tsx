import type { Meta, StoryObj } from "@storybook/react";
import { Button } from "./Button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "./Tooltip";

const meta: Meta = {
  title: "Core/Tooltip",
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj;

export const Default: Story = {
  render: () => (
    <TooltipProvider delayDuration={200}>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button variant="secondary" size="sm">
            Hover for tooltip
          </Button>
        </TooltipTrigger>
        <TooltipContent>Helpful hint text</TooltipContent>
      </Tooltip>
    </TooltipProvider>
  ),
};
