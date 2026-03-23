import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { Button } from "./core/Button";
import { BugReportModal } from "./BugReportModal";

const meta: Meta<typeof BugReportModal> = {
  title: "Components/BugReportModal",
  tags: ["autodocs"],
  component: BugReportModal,
};

export default meta;
type Story = StoryObj<typeof BugReportModal>;

function Harness() {
  const [open, setOpen] = useState(true);
  return (
    <div>
      <Button size="sm" onClick={() => setOpen(true)}>
        Open bug report
      </Button>
      <BugReportModal
        open={open}
        onClose={() => setOpen(false)}
        title="Report a bug"
        subtitle="Describe what went wrong."
      >
        <p className="text-sm text-muted-foreground">Bug report body placeholder.</p>
      </BugReportModal>
    </div>
  );
}

export const Default: Story = {
  render: () => <Harness />,
};
