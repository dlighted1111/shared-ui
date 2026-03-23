import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { StandardToolbar } from "./StandardToolbar";

const meta: Meta<typeof StandardToolbar> = {
  title: "Components/StandardToolbar",
  tags: ["autodocs"],
  component: StandardToolbar,
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
