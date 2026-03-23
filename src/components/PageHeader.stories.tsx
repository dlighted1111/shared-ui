import type { Meta, StoryObj } from "@storybook/react";
import { Button } from "./core/Button";
import { PageHeader } from "./PageHeader";

const meta: Meta<typeof PageHeader> = {
  title: "Components/PageHeader",
  tags: ["autodocs"],
  component: PageHeader,
  args: {
    title: "Page title",
    subtitle: "Supporting subtitle for the page.",
  },
};

export default meta;
type Story = StoryObj<typeof PageHeader>;

export const Default: Story = {};

export const WithActions: Story = {
  args: {
    actions: (
      <Button size="sm" onClick={() => {}}>
        Primary action
      </Button>
    ),
  },
};
