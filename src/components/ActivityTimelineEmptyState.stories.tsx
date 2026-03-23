import type { Meta, StoryObj } from "@storybook/react";
import { ActivityTimelineEmptyState } from "./ActivityTimelineEmptyState";

const meta: Meta<typeof ActivityTimelineEmptyState> = {
  title: "Components/ActivityTimelineEmptyState",
  tags: ["autodocs"],
  component: ActivityTimelineEmptyState,
  args: {
    title: "No activity yet",
    hint: "Events will show up here.",
  },
};

export default meta;
type Story = StoryObj<typeof ActivityTimelineEmptyState>;

export const Default: Story = {};
