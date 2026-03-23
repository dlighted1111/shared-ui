import type { Meta, StoryObj } from "@storybook/react";
import { KpiCard } from "./KpiCard";

function ChartIcon({ size = 24, className }: { size?: number; className?: string }) {
  return (
    <svg width={size} height={size} className={className} viewBox="0 0 24 24" aria-hidden>
      <path
        fill="currentColor"
        d="M4 19h16v2H4zm3-4h2v3H7zm4-6h2v9h-2zm4-4h2v13h-2z"
      />
    </svg>
  );
}

const meta: Meta<typeof KpiCard> = {
  title: "Components/KpiCard",
  tags: ["autodocs"],
  component: KpiCard,
  args: {
    label: "Occupancy",
    value: "94%",
    icon: ChartIcon,
    trend: { direction: "up", value: "2%" },
  },
};

export default meta;
type Story = StoryObj<typeof KpiCard>;

export const Default: Story = {};

export const Loading: Story = {
  args: {
    loading: true,
  },
};
