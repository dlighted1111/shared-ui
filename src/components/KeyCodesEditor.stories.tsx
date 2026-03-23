import type { Meta, StoryObj } from "@storybook/react";
import { KeyCodesEditor } from "./KeyCodesEditor";

const meta: Meta<typeof KeyCodesEditor> = {
  title: "Components/KeyCodesEditor",
  tags: ["autodocs"],
  component: KeyCodesEditor,
  args: {
    keyCodes: [],
    codeTypes: [
      { value: "gate", label: "Gate" },
      { value: "fob", label: "Fob" },
    ],
    onSave: () => {},
    onDelete: () => {},
  },
};

export default meta;
type Story = StoryObj<typeof KeyCodesEditor>;

export const Default: Story = {};
