import type { Meta, StoryObj } from "@storybook/react";
import { LogActivityButton } from "./LogActivityForm";

const meta: Meta<typeof LogActivityButton> = {
  title: "Components/LogActivityForm",
  tags: ["autodocs"],
  component: LogActivityButton,
  args: {
    activityTypes: [
      { value: "note", label: "Note" },
      { value: "call", label: "Call" },
    ],
    owners: [{ id: "u1", label: "Alex" }],
    onSubmit: async () => {},
  },
};

export default meta;
type Story = StoryObj<typeof LogActivityButton>;

export const Default: Story = {};
