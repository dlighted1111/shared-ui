import type { Meta, StoryObj } from "@storybook/react";
import { DealStageBadge } from "./DealStageBadge";

const meta: Meta<typeof DealStageBadge> = {
  title: "Components/DealStageBadge",
  tags: ["autodocs"],
  component: DealStageBadge,
  args: {
    label: "Negotiation",
    backgroundColor: "#DDEDEA",
    textColor: "#0F7B6C",
  },
};

export default meta;
type Story = StoryObj<typeof DealStageBadge>;

export const Default: Story = {};
