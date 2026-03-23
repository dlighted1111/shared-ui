import type { Meta, StoryObj } from "@storybook/react";
import { GlobalPanels } from "./GlobalPanels";

const meta: Meta<typeof GlobalPanels> = {
  title: "Components/GlobalPanels",
  tags: ["autodocs"],
  component: GlobalPanels,
};

export default meta;
type Story = StoryObj<typeof GlobalPanels>;

export const Default: Story = {
  render: () => (
    <GlobalPanels
      current={{ type: "demo", id: "42" }}
      previous={null}
      onClose={() => {}}
      onBack={() => {}}
      renderers={{
        demo: ({ id, onClose }) => (
          <div className="fixed inset-y-0 right-0 z-50 w-80 border-l border-border bg-background p-4 shadow-lg">
            <p className="text-sm font-medium">Panel {id}</p>
            <button type="button" className="mt-4 text-sm text-muted-foreground underline" onClick={onClose}>
              Close
            </button>
          </div>
        ),
      }}
    />
  ),
};
