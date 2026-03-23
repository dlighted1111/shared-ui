import type { Meta, StoryObj } from "@storybook/react";
import { Link } from "./Link";

const meta: Meta<typeof Link> = {
  title: "Core/Link",
  component: Link,
  args: {
    href: "#",
    children: "View details",
  },
};

export default meta;
type Story = StoryObj<typeof Link>;

export const Default: Story = {};

export const Muted: Story = {
  args: {
    muted: true,
    children: "Muted reference link",
  },
};

export const Dark: Story = {
  parameters: {
    globals: {
      theme: "dark",
    },
  },
};
