import type { Meta, StoryObj } from "@storybook/react";
import { CopyLinkButton } from "./CopyLinkButton";

const meta: Meta<typeof CopyLinkButton> = {
  title: "Components/CopyLinkButton",
  tags: ["autodocs"],
  component: CopyLinkButton,
};

export default meta;
type Story = StoryObj<typeof CopyLinkButton>;

export const Default: Story = {};
