import type { Meta, StoryObj } from "@storybook/react";
import { DismissButton } from "./DismissButton";

const meta: Meta<typeof DismissButton> = {
  title: "Components/DismissButton",
  tags: ["autodocs"],
  component: DismissButton,
  args: {
    onClick: () => {},
  },
};

export default meta;
type Story = StoryObj<typeof DismissButton>;

export const Default: Story = {};
