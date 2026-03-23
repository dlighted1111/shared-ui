import type { Meta, StoryObj } from "@storybook/react";
import { Label } from "./Label";

const meta: Meta<typeof Label> = {
  title: "Core/Label",
  tags: ["autodocs"],
  component: Label,
  args: {
    children: "Field label",
  },
};

export default meta;
type Story = StoryObj<typeof Label>;

export const Default: Story = {};
