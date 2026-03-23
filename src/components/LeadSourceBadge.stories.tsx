import type { Meta, StoryObj } from "@storybook/react";
import { LeadSourceBadge } from "./LeadSourceBadge";

const meta: Meta<typeof LeadSourceBadge> = {
  title: "Components/LeadSourceBadge",
  tags: ["autodocs"],
  component: LeadSourceBadge,
  args: {
    label: "Website",
    backgroundColor: "#DDEBF1",
    textColor: "#0B6E99",
  },
};

export default meta;
type Story = StoryObj<typeof LeadSourceBadge>;

export const Default: Story = {};
