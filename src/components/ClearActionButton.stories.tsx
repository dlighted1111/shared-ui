import type { Meta, StoryObj } from "@storybook/react";
import { ClearActionButton } from "./ClearActionButton";

const meta: Meta<typeof ClearActionButton> = {
  title: "Components/ClearActionButton",
  tags: ["autodocs"],
  component: ClearActionButton,
  args: {
    onClick: () => {},
  },
};

export default meta;
type Story = StoryObj<typeof ClearActionButton>;

export const Default: Story = {};
