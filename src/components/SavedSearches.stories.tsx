import type { Meta, StoryObj } from "@storybook/react";
import { SavedSearches } from "./SavedSearches";

const meta: Meta<typeof SavedSearches> = {
  title: "Components/SavedSearches",
  tags: ["autodocs"],
  component: SavedSearches,
  args: {
    module: "story",
    currentFilters: { status: "open" },
    defaultFilters: { status: "all" },
    onApply: () => {},
    fetchSearches: async () => [],
    createSearch: async (input) => ({
      id: "new",
      name: input.name,
      filter_state: input.filter_state,
    }),
    deleteSearch: async () => {},
  },
};

export default meta;
type Story = StoryObj<typeof SavedSearches>;

export const Default: Story = {};
