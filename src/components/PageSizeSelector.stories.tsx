import type { Meta, StoryObj } from "@storybook/react";
import { PageSizeSelector } from "./PageSizeSelector";

const meta: Meta<typeof PageSizeSelector> = {
  title: "Components/PageSizeSelector",
  tags: ["autodocs"],
  component: PageSizeSelector,
  args: {
    value: 50,
    onChange: () => {},
  },
};

export default meta;
type Story = StoryObj<typeof PageSizeSelector>;

export const Default: Story = {};
