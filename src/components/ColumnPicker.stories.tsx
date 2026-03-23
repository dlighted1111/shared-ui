import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { ColumnPicker } from "./ColumnPicker";

const meta: Meta<typeof ColumnPicker> = {
  title: "Components/ColumnPicker",
  tags: ["autodocs"],
  component: ColumnPicker,
};

export default meta;
type Story = StoryObj<typeof ColumnPicker>;

const columns = [
  { key: "name", label: "Name" },
  { key: "status", label: "Status" },
  { key: "owner", label: "Owner", alwaysVisible: true },
];

function Harness() {
  const [visible, setVisible] = useState(() => new Set(["name", "status", "owner"]));
  return (
    <ColumnPicker columns={columns} visible={visible} onChange={setVisible}>
      {(api) => (
        <ul className="space-y-1 text-sm">
          {api.columns.map((col) => (
            <li key={col.key}>
              <label className="flex cursor-pointer items-center gap-2">
                <input
                  type="checkbox"
                  checked={api.isVisible(col.key)}
                  disabled={col.alwaysVisible}
                  onChange={() => api.toggle(col.key)}
                />
                {col.label}
              </label>
            </li>
          ))}
        </ul>
      )}
    </ColumnPicker>
  );
}

export const Default: Story = {
  render: () => <Harness />,
};
