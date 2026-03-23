import type { Meta, StoryObj } from "@storybook/react";
import { TableEmptyState } from "./TableEmptyState";

const meta: Meta<typeof TableEmptyState> = {
  title: "Components/TableEmptyState",
  tags: ["autodocs"],
  component: TableEmptyState,
  args: {
    message: "No rows match",
    description: "Try adjusting filters or search.",
    actionLabel: "Clear filters",
    onAction: () => {},
  },
};

export default meta;
type Story = StoryObj<typeof TableEmptyState>;

export const Default: Story = {};
