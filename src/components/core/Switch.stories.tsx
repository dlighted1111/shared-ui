import type { Meta, StoryObj } from "@storybook/react";
import { Switch } from "./Switch";

const meta: Meta<typeof Switch> = {
  title: "Core/Switch",
  tags: ["autodocs"],
  component: Switch,
  args: {
    defaultChecked: true,
    "aria-label": "Demo switch",
  },
};

export default meta;
type Story = StoryObj<typeof Switch>;

export const Default: Story = {};

export const Disabled: Story = {
  args: {
    disabled: true,
    defaultChecked: false,
  },
};
