import type { Meta, StoryObj } from "@storybook/react";
import { Datepicker } from "./Datepicker";

const meta: Meta<typeof Datepicker> = {
  title: "Core/Datepicker",
  tags: ["autodocs"],
  component: Datepicker,
  args: {
    label: "Due date",
  },
};

export default meta;
type Story = StoryObj<typeof Datepicker>;

export const Default: Story = {
  args: {
    description: "Native date input for low-risk parity.",
  },
};

export const Disabled: Story = {
  args: {
    disabled: true,
    value: "2026-03-17",
  },
};

export const Error: Story = {
  args: {
    error: "Date is required.",
  },
};

export const Dark: Story = {
  parameters: {
    globals: {
      theme: "dark",
    },
  },
};
