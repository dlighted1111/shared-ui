import type { Meta, StoryObj } from "@storybook/react";
import { SummaryWidget } from "./SummaryWidget";

const meta: Meta<typeof SummaryWidget> = {
  title: "Components/SummaryWidget",
  tags: ["autodocs"],
  component: SummaryWidget,
  parameters: {
    docs: {
      description: {
        component: `
**Owner:** Shared

**What problem does it solve?**  
Provides a shared summary header with key metrics and phase chips for list-centric pages.

**When & how to use it?**  
Use at the top of dashboards/lists where metric filtering and quick distribution context are required.

**Current usage**  
Used on multiple mothership list pages and related crm summary views.

**Related components**  
StatusPill, KpiCard, StandardToolbar, DataTable
        `,
      },
    },
  },
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
