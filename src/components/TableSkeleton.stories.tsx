import type { Meta, StoryObj } from "@storybook/react";
import { TableSkeleton } from "./TableSkeleton";

const meta: Meta<typeof TableSkeleton> = {
  title: "Components/TableSkeleton",
  tags: ["autodocs"],
  component: TableSkeleton,
  args: {
    rows: 6,
    columns: 4,
  },
};

export default meta;
type Story = StoryObj<typeof TableSkeleton>;

export const Default: Story = {};

export const Compact: Story = {
  args: {
    compact: true,
    rows: 4,
  },
};
