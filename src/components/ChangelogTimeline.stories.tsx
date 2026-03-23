import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { ChangelogTimeline } from "./ChangelogTimeline";

const meta: Meta<typeof ChangelogTimeline> = {
  title: "Components/ChangelogTimeline",
  tags: ["autodocs"],
  component: ChangelogTimeline,
};

export default meta;
type Story = StoryObj<typeof ChangelogTimeline>;

type Row = { id: string; label: string };

function Harness() {
  const [open, setOpen] = useState(true);
  const items: Row[] = [
    { id: "1", label: "Record created" },
    { id: "2", label: "Field updated" },
  ];
  return (
    <ChangelogTimeline<Row>
      open={open}
      onOpenChange={setOpen}
      items={items}
      getItemKey={(item) => item.id}
      renderItem={(item) => <div className="py-2 text-sm">{item.label}</div>}
    />
  );
}

export const Default: Story = {
  render: () => <Harness />,
};
