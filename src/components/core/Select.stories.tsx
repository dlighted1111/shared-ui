import type { Meta, StoryObj } from "@storybook/react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./Select";

const meta: Meta = {
  title: "Core/Select",
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component: `
**Owner:** Shared

**What problem does it solve?**  
Provides a consistent, accessible dropdown selector across apps.

**When & how to use it?**  
Use for compact single-value choices in filters and forms. Keep option labels short and deterministic.

**Current usage**  
Used in mothership and crm filters (pod selectors, status selectors, table controls).

**Related components**  
Label, Input, StandardToolbar
        `,
      },
    },
  },
};

export default meta;
type Story = StoryObj;

export const Default: Story = {
  render: () => (
    <Select defaultValue="apple">
      <SelectTrigger className="w-[220px]">
        <SelectValue placeholder="Pick a fruit" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="apple">Apple</SelectItem>
        <SelectItem value="banana">Banana</SelectItem>
        <SelectItem value="orange">Orange</SelectItem>
      </SelectContent>
    </Select>
  ),
};
