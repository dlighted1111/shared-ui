import type { Meta, StoryObj } from "@storybook/react";
import { CopyText } from "./CopyText";

const meta: Meta<typeof CopyText> = {
  title: "Components/CopyText",
  tags: ["autodocs"],
  component: CopyText,
  args: {
    value: "https://example.com/resource/123",
    display: "example.com/…/123",
  },
};

export default meta;
type Story = StoryObj<typeof CopyText>;

export const Default: Story = {};
