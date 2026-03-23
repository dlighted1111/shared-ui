import type { Meta, StoryObj } from "@storybook/react";
import { Input } from "./Input";

const meta: Meta<typeof Input> = {
  title: "Core/Input",
  tags: ["autodocs"],
  component: Input,
  args: {
    label: "Email",
    placeholder: "name@company.com",
  },
};

export default meta;
type Story = StoryObj<typeof Input>;

export const Default: Story = {
  args: {
    description: "We will only use this for account notifications.",
  },
};

export const Disabled: Story = {
  args: {
    value: "readonly@example.com",
    disabled: true,
  },
};

export const Error: Story = {
  args: {
    value: "not-an-email",
    error: "Enter a valid email address.",
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
