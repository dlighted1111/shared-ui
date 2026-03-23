import type { Meta, StoryObj } from "@storybook/react";
import { ActivityTimeline } from "./ActivityTimeline";

const meta: Meta<typeof ActivityTimeline> = {
  title: "Components/ActivityTimeline",
  tags: ["autodocs"],
  component: ActivityTimeline,
};

export default meta;
type Story = StoryObj<typeof ActivityTimeline>;

export const WithItems: Story = {
  render: () => (
    <ActivityTimeline
      items={[{ title: "Note added" }, { title: "Status changed" }]}
      renderItem={(item) => (
        <div key={item.title} className="border-b border-border py-2 text-sm">
          {item.title}
        </div>
      )}
    />
  ),
};

export const Empty: Story = {
  render: () => (
    <ActivityTimeline
      items={[]}
      renderItem={() => null}
      emptyTitle="No activity"
      emptyHint="Try adding a note."
    />
  ),
};
