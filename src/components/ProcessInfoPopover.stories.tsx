import type { Meta, StoryObj } from "@storybook/react";
import { ProcessInfoPopover } from "./ProcessInfoPopover";

const meta: Meta<typeof ProcessInfoPopover> = {
  title: "Components/ProcessInfoPopover",
  tags: ["autodocs"],
  component: ProcessInfoPopover,
  args: {
    title: "About this page",
    content: "This popover explains how to use the surrounding workflow.",
  },
};

export default meta;
type Story = StoryObj<typeof ProcessInfoPopover>;

export const Default: Story = {};
