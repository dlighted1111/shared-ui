import type { Meta, StoryObj } from "@storybook/react";
import { Checkbox } from "./Checkbox";

const meta: Meta<typeof Checkbox> = {
  title: "Core/Checkbox",
  tags: ["autodocs"],
  component: Checkbox,
  parameters: {
    docs: {
      description: {
        component: `
**Owner:** Shared

**What problem does it solve?**  
Provides a standard boolean input with description and validation support.

**When & how to use it?**  
Use for opt-in settings, bulk table selection, and checklist interactions where users can explicitly toggle a state.

**Current usage**  
Used in mothership and crm settings, filters, and operational table actions.

**Related components**  
Switch, RadioGroup, DataTable
        `,
      },
    },
  },
  args: {
    label: "Send weekly digest",
  },
};

export default meta;
type Story = StoryObj<typeof Checkbox>;

export const Default: Story = {
  args: {
    description: "Receive weekly product and billing updates.",
  },
};

export const Disabled: Story = {
  args: {
    checked: true,
    disabled: true,
    description: "Preference is locked by policy.",
  },
};

export const Error: Story = {
  args: {
    error: "You must accept this option before continuing.",
  },
};

export const Dark: Story = {
  args: {
    description: "Dark mode surface validation.",
  },
  parameters: {
    globals: {
      theme: "dark",
    },
  },
};
