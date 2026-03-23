import type { Meta, StoryObj } from "@storybook/react";
import { EntityLink } from "./EntityLink";

const meta: Meta<typeof EntityLink> = {
  title: "Components/EntityLink",
  tags: ["autodocs"],
  component: EntityLink,
  args: {
    children: "Open related record",
    onActivate: () => {},
  },
};

export default meta;
type Story = StoryObj<typeof EntityLink>;

export const Default: Story = {};
