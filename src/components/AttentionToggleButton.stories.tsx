import type { Meta, StoryObj } from "@storybook/react";
import { AttentionToggleButton } from "./AttentionToggleButton";

const meta: Meta<typeof AttentionToggleButton> = {
  title: "Components/AttentionToggleButton",
  tags: ["autodocs"],
  component: AttentionToggleButton,
  args: {
    label: "Attention",
    count: 3,
    active: false,
    onClick: () => {},
  },
};

export default meta;
type Story = StoryObj<typeof AttentionToggleButton>;

export const Default: Story = {};

export const Active: Story = {
  args: {
    active: true,
  },
};
