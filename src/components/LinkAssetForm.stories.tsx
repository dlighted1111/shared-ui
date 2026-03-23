import type { Meta, StoryObj } from "@storybook/react";
import { LinkAssetButton } from "./LinkAssetForm";

const meta: Meta<typeof LinkAssetButton> = {
  title: "Components/LinkAssetForm",
  tags: ["autodocs"],
  component: LinkAssetButton,
  args: {
    onSubmit: async () => {},
    loadOptions: async (query: string) =>
      query.length >= 2
        ? [
            {
              id: "1",
              primaryLabel: "123 Main St",
              secondaryLabel: "Unit 4",
              searchValue: "main",
            },
          ]
        : [],
  },
};

export default meta;
type Story = StoryObj<typeof LinkAssetButton>;

export const Default: Story = {};
