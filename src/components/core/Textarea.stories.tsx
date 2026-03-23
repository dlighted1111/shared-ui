import type { Meta, StoryObj } from "@storybook/react";
import { Textarea } from "./Textarea";

const meta: Meta<typeof Textarea> = {
  title: "Core/Textarea",
  component: Textarea,
  args: {
    label: "Notes",
    placeholder: "Enter details",
  },
};

export default meta;
type Story = StoryObj<typeof Textarea>;

export const Default: Story = {
  args: {
    description: "Supports helper and error messaging.",
  },
};

export const Disabled: Story = {
  args: {
    value: "This field is disabled",
    disabled: true,
  },
};

export const Error: Story = {
  args: {
    value: "Too short",
    error: "Please add at least 20 characters.",
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
