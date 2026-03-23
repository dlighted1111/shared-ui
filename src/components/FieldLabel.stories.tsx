import type { Meta, StoryObj } from "@storybook/react";
import { FieldLabel } from "./FieldLabel";

const meta: Meta<typeof FieldLabel> = {
  title: "Components/FieldLabel",
  tags: ["autodocs"],
  component: FieldLabel,
  args: {
    label: "Field name",
  },
};

export default meta;
type Story = StoryObj<typeof FieldLabel>;

export const Default: Story = {};

export const WithTooltip: Story = {
  args: {
    icon: <span aria-hidden>ⓘ</span>,
    tooltip: "Extra context for this field.",
  },
};
