import type { Meta, StoryObj } from "@storybook/react";
import { Button } from "./Button";

const meta: Meta<typeof Button> = {
  title: "Core/Button",
  component: Button,
  args: {
    children: "Save changes",
  },
};

export default meta;
type Story = StoryObj<typeof Button>;

export const Primary: Story = {};

export const Secondary: Story = {
  args: {
    variant: "secondary",
  },
};

export const Danger: Story = {
  args: {
    variant: "danger",
    children: "Delete",
  },
};

export const Disabled: Story = {
  args: {
    disabled: true,
  },
};

export const Dark: Story = {
  args: {
    variant: "secondary",
  },
  parameters: {
    globals: {
      theme: "dark",
    },
  },
};
