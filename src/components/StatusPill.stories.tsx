import type { Meta, StoryObj } from "@storybook/react";
import { StatusPill } from "./StatusPill";

const meta: Meta<typeof StatusPill> = {
  title: "Components/StatusPill",
  tags: ["autodocs"],
  component: StatusPill,
  args: {
    label: "In progress",
    color: "blue",
  },
};

export default meta;
type Story = StoryObj<typeof StatusPill>;

export const Default: Story = {};
