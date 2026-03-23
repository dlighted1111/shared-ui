import type { Meta, StoryObj } from "@storybook/react";
import { PropertyTypeBadge } from "./PropertyTypeBadge";

const meta: Meta<typeof PropertyTypeBadge> = {
  title: "Components/PropertyTypeBadge",
  tags: ["autodocs"],
  component: PropertyTypeBadge,
  args: {
    label: "Multifamily",
    backgroundColor: "#E9E5E3",
    textColor: "#64473A",
    size: "sm",
  },
};

export default meta;
type Story = StoryObj<typeof PropertyTypeBadge>;

export const Default: Story = {};
