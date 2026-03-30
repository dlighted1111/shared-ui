import type { Meta, StoryObj } from "@storybook/react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./Table";

const meta: Meta = {
  title: "Core/Table",
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component: `
**Owner:** Shared

**What problem does it solve?**  
Provides lightweight semantic table primitives for simple tabular layouts.

**When & how to use it?**  
Use when you only need table structure and custom composition. For sortable/paginated business grids, use DataTable.

**Current usage**  
Used by selected mothership pages such as monitoring and price book style list layouts.

**Related components**  
DataTable, TableSkeleton, EmptyState
        `,
      },
    },
  },
};

export default meta;
type Story = StoryObj;

export const Default: Story = {
  render: () => (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead>Role</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        <TableRow>
          <TableCell>Ada</TableCell>
          <TableCell>Admin</TableCell>
        </TableRow>
        <TableRow>
          <TableCell>Lin</TableCell>
          <TableCell>Member</TableCell>
        </TableRow>
      </TableBody>
    </Table>
  ),
};
