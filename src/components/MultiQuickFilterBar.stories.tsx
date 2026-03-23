import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { MultiQuickFilterBar } from "./MultiQuickFilterBar";

const items = [
  { key: "open", label: "Open" },
  { key: "closed", label: "Closed" },
] as const;

const meta: Meta<typeof MultiQuickFilterBar> = {
  title: "Components/MultiQuickFilterBar",
  tags: ["autodocs"],
  component: MultiQuickFilterBar,
};

export default meta;
type Story = StoryObj<typeof MultiQuickFilterBar>;

function Harness() {
  const [activeKeys, setActiveKeys] = useState<string[]>(["open"]);
  return <MultiQuickFilterBar items={items} activeKeys={activeKeys} onChange={setActiveKeys} />;
}

export const Default: Story = {
  render: () => <Harness />,
};
