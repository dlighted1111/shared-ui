import type { Meta, StoryObj } from "@storybook/react";
import { SummaryWidget } from "./SummaryWidget";

const meta: Meta<typeof SummaryWidget> = {
  title: "Components/SummaryWidget",
  tags: ["autodocs"],
  component: SummaryWidget,
  args: {
    metrics: [
      { label: "Total", value: 128, filterKey: "total" },
      { label: "Active", value: 42, filterKey: "active" },
      { label: "Draft", value: 7 },
    ],
    chips: [
      { label: "Phase A", value: "a", count: 12, color: "#DDEDEA" },
      { label: "Phase B", value: "b", count: 8, color: "#DDEBF1" },
    ],
    activeMetricFilter: null,
    activeChipFilter: null,
    onMetricClick: () => {},
    onChipClick: () => {},
  },
};

export default meta;
type Story = StoryObj<typeof SummaryWidget>;

export const Default: Story = {};
