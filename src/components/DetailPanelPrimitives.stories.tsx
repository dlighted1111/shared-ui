import type { Meta, StoryObj } from "@storybook/react";
import { DetailEditField, DetailEmptyBlock, DetailField, DetailSection } from "./DetailPanelPrimitives";

const meta: Meta = {
  title: "Components/DetailPanelPrimitives",
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj;

export const Overview: Story = {
  render: () => (
    <div className="max-w-md space-y-6">
      <DetailSection title="Summary" count={2}>
        <DetailField label="Name" value="Sample record" />
        <DetailField label="Status" value="Active" />
      </DetailSection>
      <DetailEditField label="Notes">
        <input className="w-full rounded-md border border-input bg-background px-2 py-1 text-sm" defaultValue="" />
      </DetailEditField>
      <DetailEmptyBlock text="No related items" />
    </div>
  ),
};
