import type { Meta, StoryObj } from "@storybook/react";
import { LinkLookupForm } from "./LinkLookupForm";

const meta: Meta<typeof LinkLookupForm> = {
  title: "Components/LinkLookupForm",
  tags: ["autodocs"],
  component: LinkLookupForm,
  args: {
    triggerLabel: "Link record",
    searchPlaceholder: "Search…",
    rolePlaceholder: "Role",
    roleMode: "text",
    initialRole: "member",
    onSubmit: async () => {},
    loadOptions: async (query: string) =>
      query.length >= 2
        ? [{ id: "x1", primaryLabel: "Result One", secondaryLabel: "Extra" }]
        : [],
  },
};

export default meta;
type Story = StoryObj<typeof LinkLookupForm>;

export const Default: Story = {};
