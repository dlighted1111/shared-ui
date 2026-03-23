import type { Meta, StoryObj } from "@storybook/react";
import { LinkContactButton } from "./LinkContactForm";

const meta: Meta<typeof LinkContactButton> = {
  title: "Components/LinkContactForm",
  tags: ["autodocs"],
  component: LinkContactButton,
  args: {
    roles: [
      { value: "primary", label: "Primary" },
      { value: "billing", label: "Billing" },
    ],
    onSubmit: async () => {},
    loadOptions: async (query: string) =>
      query.length >= 2
        ? [
            {
              id: "c1",
              primaryLabel: "Jane Doe",
              secondaryLabel: "jane@example.com",
            },
          ]
        : [],
  },
};

export default meta;
type Story = StoryObj<typeof LinkContactButton>;

export const Default: Story = {};
