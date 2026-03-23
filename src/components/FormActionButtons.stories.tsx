import type { Meta, StoryObj } from "@storybook/react";
import { FormActionButtons } from "./FormActionButtons";

const meta: Meta<typeof FormActionButtons> = {
  title: "Components/FormActionButtons",
  tags: ["autodocs"],
  component: FormActionButtons,
  args: {
    onCancel: () => {},
    onSubmit: () => {},
  },
};

export default meta;
type Story = StoryObj<typeof FormActionButtons>;

export const Default: Story = {};

export const Saving: Story = {
  args: {
    saving: true,
  },
};
