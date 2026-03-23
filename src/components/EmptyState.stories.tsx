import type { Meta, StoryObj } from "@storybook/react";
import { Button } from "./core/Button";
import { EmptyState } from "./EmptyState";

function PlaceholderIcon({ size = 48, className }: { size?: number; className?: string }) {
  return (
    <div
      className={className}
      style={{
        width: size,
        height: size,
        borderRadius: 8,
        border: "2px dashed currentColor",
        opacity: 0.35,
      }}
    />
  );
}

const meta: Meta<typeof EmptyState> = {
  title: "Components/EmptyState",
  tags: ["autodocs"],
  component: EmptyState,
};

export default meta;
type Story = StoryObj<typeof EmptyState>;

export const Default: Story = {
  render: () => (
    <EmptyState
      icon={PlaceholderIcon}
      title="Nothing here yet"
      description="Add your first item to get started."
      action={
        <Button size="sm" onClick={() => {}}>
          Create
        </Button>
      }
    />
  ),
};
