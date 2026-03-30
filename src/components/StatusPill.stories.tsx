import type { Meta, StoryObj } from "@storybook/react";
import { StatusPill } from "./StatusPill";

const meta: Meta<typeof StatusPill> = {
  title: "Components/StatusPill",
  tags: ["autodocs"],
  component: StatusPill,
  parameters: {
    docs: {
      description: {
        component: `
**Owner:** Shared

**What problem does it solve?**  
Standardizes status labeling with color semantics across workflows.

**When & how to use it?**  
Use for compact state indicators in tables, cards, and detail headers. Keep labels short.

**Current usage**  
Used in mothership and crm operational pages for phase/status visibility.

**Related components**  
ValueBadge, ColorBadge, SummaryWidget
        `,
      },
    },
  },
  args: {
    label: "In progress",
    color: "blue",
  },
};

export default meta;
type Story = StoryObj<typeof StatusPill>;

export const Default: Story = {};
