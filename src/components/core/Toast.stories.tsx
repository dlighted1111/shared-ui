import type { Meta, StoryObj } from "@storybook/react";
import { Button } from "./Button";
import { ToastProvider, useToast } from "./Toast";

const meta: Meta = {
  title: "Core/Toast",
};

export default meta;
type Story = StoryObj;

function ToastHarness() {
  const { pushToast } = useToast();

  return (
    <div style={{ display: "flex", gap: "12px" }}>
      <Button
        onClick={() =>
          pushToast({
            title: "Saved",
            description: "Changes were synced successfully.",
            variant: "success",
          })
        }
      >
        Show success toast
      </Button>
      <Button
        variant="danger"
        onClick={() =>
          pushToast({
            title: "Request failed",
            description: "Try again in a few minutes.",
            variant: "error",
          })
        }
      >
        Show error toast
      </Button>
    </div>
  );
}

export const Default: Story = {
  render: () => (
    <ToastProvider>
      <ToastHarness />
    </ToastProvider>
  ),
};

export const Dark: Story = {
  render: () => (
    <ToastProvider>
      <ToastHarness />
    </ToastProvider>
  ),
  parameters: {
    globals: {
      theme: "dark",
    },
  },
};
