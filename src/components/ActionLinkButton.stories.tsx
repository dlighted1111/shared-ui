import type { Meta, StoryObj } from "@storybook/react";
import { ActionLinkButton } from "./ActionLinkButton";

const meta: Meta<typeof ActionLinkButton> = {
  title: "Components/ActionLinkButton",
  tags: ["autodocs"],
  component: ActionLinkButton,
  args: {
    children: "Open record",
    onActivate: () => {},
  },
};

export default meta;
type Story = StoryObj<typeof ActionLinkButton>;

export const Default: Story = {};

export const WithHref: Story = {
  args: {
    href: "/records/123",
    onActivate: undefined,
    children: "Open record (link mode)",
  },
};
