import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { StandardToolbar } from "./StandardToolbar";

const meta: Meta<typeof StandardToolbar> = {
  title: "Components/StandardToolbar",
  tags: ["autodocs"],
  component: StandardToolbar,
  parameters: {
    docs: {
      description: {
        component: `
**Owner:** Shared

**What problem does it solve?**  
Centralizes common list controls (search, pod filter, attention toggle, density, export, columns) into one consistent toolbar.

**When & how to use it?**  
Use above DataTable-based list pages where the same control contract is needed across modules.

**Current usage**  
Used in operational list flows that need filter/search parity and reduced duplication.

**Related components**  
DataTable, ColumnPicker, DensityToggle, SearchField
        `,
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof StandardToolbar>;

function Harness() {
  const [searchTerm, setSearchTerm] = useState("");
  const [pod, setPod] = useState("All");
  const [attentionActive, setAttentionActive] = useState(false);
  const [density, setDensity] = useState<"comfortable" | "compact">("comfortable");
  const [visible, setVisible] = useState<string[]>(["name", "status"]);

  return (
    <StandardToolbar
      searchTerm={searchTerm}
      onSearchChange={setSearchTerm}
      podFilter={pod}
      onPodChange={setPod}
      podFilterOptions={["All", "PD1", "PD2"]}
      attentionCount={2}
      attentionActive={attentionActive}
      onAttentionToggle={() => setAttentionActive((v) => !v)}
      onExport={() => {}}
      density={density}
      onDensityChange={setDensity}
      allColumns={[
        { key: "name", header: "Name" },
        { key: "status", header: "Status" },
      ]}
      visibleColumns={visible}
      onVisibleColumnsChange={setVisible}
    />
  );
}

export const Default: Story = {
  render: () => <Harness />,
};
