import type { Meta, StoryObj } from "@storybook/react";
import { SelectMenu } from "./SelectMenu";

const options = [
  { value: "new", label: "New" },
  { value: "active", label: "Active" },
  { value: "closed", label: "Closed" },
];

const meta: Meta<typeof SelectMenu> = {
  title: "Core/SelectMenu",
  component: SelectMenu,
  args: {
    label: "Status",
    options,
    placeholder: "Choose status",
  },
};

export default meta;
type Story = StoryObj<typeof SelectMenu>;

export const Default: Story = {
  args: {
    description: "Simple contract-first select component.",
  },
};

export const Disabled: Story = {
  args: {
    value: "active",
    disabled: true,
  },
};

export const Error: Story = {
  args: {
    error: "Please select a valid status.",
  },
};

export const Dark: Story = {
  args: {
    description: "Dark mode surface validation.",
  },
  parameters: {
    globals: {
      theme: "dark",
    },
  },
};
