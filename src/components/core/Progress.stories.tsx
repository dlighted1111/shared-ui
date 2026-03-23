import type { Meta, StoryObj } from "@storybook/react";
import { Progress } from "./Progress";

const meta: Meta<typeof Progress> = {
  title: "Core/Progress",
  tags: ["autodocs"],
  component: Progress,
  args: {
    value: 45,
  },
};

export default meta;
type Story = StoryObj<typeof Progress>;

export const Default: Story = {
  decorators: [
    (Story) => (
      <div style={{ maxWidth: 280 }}>
        <Story />
      </div>
    ),
  ],
};
