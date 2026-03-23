import type { Meta, StoryObj } from "@storybook/react";
import { ColorBadge } from "./ColorBadge";

const meta: Meta<typeof ColorBadge> = {
  title: "Components/ColorBadge",
  tags: ["autodocs"],
  component: ColorBadge,
  args: {
    label: "Badge",
    backgroundColor: "#E8E8E4",
    textColor: "#37352F",
  },
};

export default meta;
type Story = StoryObj<typeof ColorBadge>;

export const Default: Story = {};

export const Pill: Story = {
  args: {
    shape: "pill",
    size: "md",
  },
};
