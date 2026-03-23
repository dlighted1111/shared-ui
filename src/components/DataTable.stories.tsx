import type { Meta, StoryObj } from "@storybook/react";
import { DataTable } from "./DataTable";

const meta: Meta<typeof DataTable> = {
  title: "Components/DataTable",
  tags: ["autodocs"],
  component: DataTable,
};

export default meta;
type Story = StoryObj<typeof DataTable>;

type Row = Record<string, unknown> & { name: string; role: string };

const columns = [
  { key: "name", header: "Name" },
  { key: "role", header: "Role" },
];

const data: Row[] = [
  { name: "Ada", role: "Admin" },
  { name: "Lin", role: "Member" },
];

export const Default: Story = {
  render: () => <DataTable<Row> columns={columns} data={data} />,
};

export const Loading: Story = {
  render: () => <DataTable<Row> columns={columns} data={[]} loading />,
};
