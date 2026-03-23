import type { Meta, StoryObj } from "@storybook/react";
import { ValueBadge } from "./ValueBadge";

const meta: Meta<typeof ValueBadge> = {
  title: "Components/ValueBadge",
  tags: ["autodocs"],
  component: ValueBadge,
  args: {
    label: "12 units",
    backgroundColor: "#F1F1EF",
    textColor: "#37352F",
  },
};

export default meta;
type Story = StoryObj<typeof ValueBadge>;

export const Default: Story = {};
