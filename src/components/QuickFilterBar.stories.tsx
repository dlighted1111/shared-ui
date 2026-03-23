import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { QuickFilterBar } from "./QuickFilterBar";

const items = [
  { key: "all", label: "All" },
  { key: "active", label: "Active" },
  { key: "archived", label: "Archived" },
];

const meta: Meta<typeof QuickFilterBar> = {
  title: "Components/QuickFilterBar",
  tags: ["autodocs"],
  component: QuickFilterBar,
};

export default meta;
type Story = StoryObj<typeof QuickFilterBar>;

function Harness() {
  const [activeKey, setActiveKey] = useState<string | null>("active");
  return <QuickFilterBar items={items} activeKey={activeKey} onToggle={setActiveKey} />;
}

export const Default: Story = {
  render: () => <Harness />,
};
