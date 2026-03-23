import type { Meta, StoryObj } from "@storybook/react";
import { FilterPillList } from "./FilterPillList";

const meta: Meta<typeof FilterPillList> = {
  title: "Components/FilterPillList",
  tags: ["autodocs"],
  component: FilterPillList,
  args: {
    pills: [
      { key: "status", label: "Status: Open", onRemove: () => {} },
      { key: "pod", label: "Pod: PD1", onRemove: () => {} },
    ],
  },
};

export default meta;
type Story = StoryObj<typeof FilterPillList>;

export const Default: Story = {};
