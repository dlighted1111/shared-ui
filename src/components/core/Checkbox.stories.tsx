import type { Meta, StoryObj } from "@storybook/react";
import { Checkbox } from "./Checkbox";

const meta: Meta<typeof Checkbox> = {
  title: "Core/Checkbox",
  tags: ["autodocs"],
  component: Checkbox,
  args: {
    label: "Send weekly digest",
  },
};

export default meta;
type Story = StoryObj<typeof Checkbox>;

export const Default: Story = {
  args: {
    description: "Receive weekly product and billing updates.",
  },
};

export const Disabled: Story = {
  args: {
    checked: true,
    disabled: true,
    description: "Preference is locked by policy.",
  },
};

export const Error: Story = {
  args: {
    error: "You must accept this option before continuing.",
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
