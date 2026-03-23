import type { Meta, StoryObj } from "@storybook/react";
import { Dropdown } from "./Dropdown";

const defaultItems = [
  { id: "edit", label: "Edit" },
  { id: "duplicate", label: "Duplicate" },
  { id: "archive", label: "Archive", disabled: true },
  { id: "delete", label: "Delete", danger: true },
];

const meta: Meta<typeof Dropdown> = {
  title: "Core/Dropdown",
  component: Dropdown,
  args: {
    triggerLabel: "Actions",
    items: defaultItems,
  },
};

export default meta;
type Story = StoryObj<typeof Dropdown>;

export const Default: Story = {};

export const AlignEnd: Story = {
  args: {
    align: "end",
  },
};

export const Disabled: Story = {
  args: {
    disabled: true,
  },
};

export const Dark: Story = {
  parameters: {
    globals: {
      theme: "dark",
    },
  },
};
