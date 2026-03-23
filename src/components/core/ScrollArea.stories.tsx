import type { Meta, StoryObj } from "@storybook/react";
import { ScrollArea } from "./ScrollArea";

const meta: Meta<typeof ScrollArea> = {
  title: "Core/ScrollArea",
  tags: ["autodocs"],
  component: ScrollArea,
};

export default meta;
type Story = StoryObj<typeof ScrollArea>;

export const Default: Story = {
  render: () => (
    <ScrollArea className="h-32 w-64 rounded-md border p-2">
      <div className="space-y-2 pr-2">
        {Array.from({ length: 24 }, (_, i) => (
          <p key={i} className="text-sm">
            Scrollable line {i + 1}
          </p>
        ))}
      </div>
    </ScrollArea>
  ),
};
