import type { Meta, StoryObj } from "@storybook/react";
import { RadioGroup, RadioGroupItem } from "./RadioGroup";

const meta: Meta = {
  title: "Core/RadioGroup",
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj;

export const Default: Story = {
  render: () => (
    <RadioGroup defaultValue="a" className="flex flex-col gap-3">
      <div className="flex items-center gap-2">
        <RadioGroupItem value="a" aria-label="Option A" />
        <span className="text-sm">Option A</span>
      </div>
      <div className="flex items-center gap-2">
        <RadioGroupItem value="b" aria-label="Option B" />
        <span className="text-sm">Option B</span>
      </div>
    </RadioGroup>
  ),
};
