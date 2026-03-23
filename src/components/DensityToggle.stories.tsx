import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { DensityToggle } from "./DensityToggle";

const meta: Meta<typeof DensityToggle> = {
  title: "Components/DensityToggle",
  tags: ["autodocs"],
  component: DensityToggle,
};

export default meta;
type Story = StoryObj<typeof DensityToggle>;

function Harness() {
  const [compact, setCompact] = useState(false);
  return <DensityToggle compact={compact} onChange={setCompact} />;
}

export const Default: Story = {
  render: () => <Harness />,
};
