import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { SearchField } from "./SearchField";

const meta: Meta<typeof SearchField> = {
  title: "Components/SearchField",
  tags: ["autodocs"],
  component: SearchField,
};

export default meta;
type Story = StoryObj<typeof SearchField>;

function Harness() {
  const [value, setValue] = useState("query");
  return (
    <SearchField
      value={value}
      onValueChange={setValue}
      placeholder="Search…"
      containerClassName="max-w-sm"
    />
  );
}

export const Default: Story = {
  render: () => <Harness />,
};
