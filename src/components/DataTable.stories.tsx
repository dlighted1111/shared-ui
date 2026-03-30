import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { DataTable, type DataTableRowKey } from "./DataTable";

const meta: Meta<typeof DataTable> = {
  title: "Components/DataTable",
  tags: ["autodocs"],
  component: DataTable,
  parameters: {
    docs: {
      description: {
        component: `
**Owner:** Shared

**What problem does it solve?**  
Provides a unified, reusable data grid for large operational lists with sorting, pagination, loading, and empty states.

**When & how to use it?**  
Use for runtime list pages that need consistent table behavior. Prefer this over raw \`<table>\` for app data views.

**Current usage**  
Mothership directory and operational pages, including applications, vacancies, units, tenants, rent roll, owners, and turn candidate views.

**Related components**  
StandardToolbar, Table, EmptyState, TableSkeleton
        `,
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof DataTable>;

type Row = Record<string, unknown> & {
  id: string;
  name: string;
  role: string;
  status: string;
  balance: number;
  updatedAt: string;
  notes: string;
};

type DirectoryRow = Record<string, unknown> & {
  id: string;
  unit: string;
  property: string;
  pod: string;
  phase: string;
  rent: number;
  status: "active" | "pending" | "blocked";
};

type TurnCandidateRow = Record<string, unknown> & {
  id: string;
  address: string;
  property: string;
  pod: string;
  phase: string;
  tenant: string;
  leaseExpires: string;
  daysVacant: number;
};

type DelinquencyRow = Record<string, unknown> & {
  id: string;
  tenant: string;
  property: string;
  pod: string;
  phase: string;
  balance: number;
  daysInPhase: number;
  notices: number;
  notes: string;
};

type MarketListingRow = Record<string, unknown> & {
  id: string;
  source: string;
  address: string;
  city: string;
  beds: number;
  baths: number;
  sqft: number;
  price: number;
  daysOnMarket: number;
  management: string;
};

const columns = [
  { key: "name", header: "Name", sortable: true },
  { key: "role", header: "Role", sortable: true },
  { key: "status", header: "Status", sortable: true },
  {
    key: "balance",
    header: "Balance",
    sortable: true,
    sortValue: (row: Row) => row.balance,
    render: (row: Row) => `$${row.balance.toLocaleString("en-US")}`,
  },
  {
    key: "updatedAt",
    header: "Updated",
    sortable: true,
    sortValue: (row: Row) => new Date(row.updatedAt).getTime(),
  },
];

const data: Row[] = [
  {
    id: "task-1",
    name: "Ada Lovelace",
    role: "Admin",
    status: "Healthy",
    balance: 1200,
    updatedAt: "2026-03-20T12:00:00.000Z",
    notes: "All milestones are on track.",
  },
  {
    id: "task-2",
    name: "Linus Torvalds",
    role: "Manager",
    status: "At Risk",
    balance: 8750,
    updatedAt: "2026-03-18T09:30:00.000Z",
    notes: "Waiting on dependency from vendor integration.",
  },
  {
    id: "task-3",
    name: "Grace Hopper",
    role: "Analyst",
    status: "Healthy",
    balance: 4200,
    updatedAt: "2026-03-22T15:45:00.000Z",
    notes: "Ready for rollout after QA sign-off.",
  },
  {
    id: "task-4",
    name: "Margaret Hamilton",
    role: "Reviewer",
    status: "Blocked",
    balance: 200,
    updatedAt: "2026-03-16T07:10:00.000Z",
    notes: "Blocked until legal review is complete.",
  },
];

const directoryColumns = [
  { key: "unit", header: "Unit", sortable: true, frozen: true, minWidth: 140 },
  { key: "property", header: "Property", sortable: true, minWidth: 220 },
  { key: "pod", header: "Pod", sortable: true, minWidth: 90 },
  { key: "phase", header: "Phase", sortable: true, minWidth: 130 },
  {
    key: "rent",
    header: "Rent",
    sortable: true,
    sortValue: (row: DirectoryRow) => row.rent,
    render: (row: DirectoryRow) => `$${row.rent.toLocaleString("en-US")}`,
    minWidth: 120,
  },
  {
    key: "status",
    header: "Status",
    sortable: true,
    minWidth: 120,
    render: (row: DirectoryRow) => {
      const statusClass =
        row.status === "active"
          ? "bg-emerald-100 text-emerald-700"
          : row.status === "pending"
            ? "bg-amber-100 text-amber-700"
            : "bg-red-100 text-red-700";
      return (
        <span className={`inline-flex rounded px-2 py-0.5 text-xs font-medium capitalize ${statusClass}`}>
          {row.status}
        </span>
      );
    },
  },
];

const directoryData: DirectoryRow[] = [
  { id: "dir-1", unit: "A-101", property: "North Ridge Apartments", pod: "PD1", phase: "Ready", rent: 1895, status: "active" },
  { id: "dir-2", unit: "B-214", property: "Riverfront Lofts", pod: "PD2", phase: "Notice", rent: 1675, status: "pending" },
  { id: "dir-3", unit: "C-008", property: "Lakeview Flats", pod: "PD3", phase: "Turn", rent: 2120, status: "blocked" },
  { id: "dir-4", unit: "D-303", property: "Hillside Terrace", pod: "PD1", phase: "Leasing", rent: 1780, status: "active" },
];

const turnCandidateColumns = [
  {
    key: "address",
    header: "Unit Address",
    sortable: true,
    frozen: true,
    minWidth: 210,
    render: (row: TurnCandidateRow) => <span className="font-medium">{row.address}</span>,
  },
  {
    key: "actions",
    header: "Actions",
    minWidth: 220,
    render: () => (
      <div className="flex gap-1.5">
        <button type="button" className="rounded border border-emerald-500 px-2 py-1 text-[11px] text-emerald-600">
          Accept
        </button>
        <button type="button" className="rounded border border-amber-500 px-2 py-1 text-[11px] text-amber-600">
          Decline
        </button>
        <button type="button" className="rounded px-2 py-1 text-[11px] text-muted-foreground underline">
          Exclude
        </button>
      </div>
    ),
  },
  { key: "property", header: "Property", sortable: true, minWidth: 180 },
  { key: "pod", header: "Pod", sortable: true, minWidth: 90 },
  { key: "phase", header: "Phase", sortable: true, minWidth: 130 },
  { key: "tenant", header: "Tenant", sortable: true, minWidth: 150 },
  { key: "leaseExpires", header: "Lease Expires", sortable: true, minWidth: 130 },
  { key: "daysVacant", header: "Days Vacant", sortable: true, minWidth: 100 },
];

const turnCandidateData: TurnCandidateRow[] = [
  { id: "turn-1", address: "1120 Pine St #4", property: "Riverfront Lofts", pod: "PD2", phase: "make_ready", tenant: "Alex Mason", leaseExpires: "04/03/2026", daysVacant: 3 },
  { id: "turn-2", address: "3902 Sunset Ave #12", property: "North Ridge Apartments", pod: "PD1", phase: "leads", tenant: "Jordan Lee", leaseExpires: "04/11/2026", daysVacant: 0 },
  { id: "turn-3", address: "811 Maple Dr #7", property: "Lakeview Flats", pod: "PD3", phase: "approved", tenant: "Taylor Kim", leaseExpires: "03/30/2026", daysVacant: 8 },
];

const delinquencyColumns = [
  { key: "tenant", header: "Tenant", sortable: true, frozen: true, minWidth: 180 },
  { key: "property", header: "Property", sortable: true, minWidth: 200 },
  { key: "pod", header: "Pod", sortable: true, minWidth: 90 },
  { key: "phase", header: "Phase", sortable: true, minWidth: 120 },
  {
    key: "balance",
    header: "Balance",
    sortable: true,
    sortValue: (row: DelinquencyRow) => row.balance,
    render: (row: DelinquencyRow) => <span className="font-medium">${row.balance.toLocaleString("en-US")}</span>,
    minWidth: 120,
  },
  { key: "daysInPhase", header: "Days", sortable: true, minWidth: 90 },
  { key: "notices", header: "Notices", sortable: true, minWidth: 90 },
];

const delinquencyData: DelinquencyRow[] = [
  { id: "dl-1", tenant: "Morgan Diaz", property: "Hillside Terrace", pod: "PD1", phase: "monitoring", balance: 950, daysInPhase: 4, notices: 1, notes: "Follow-up call scheduled for Friday." },
  { id: "dl-2", tenant: "Samir Patel", property: "Riverfront Lofts", pod: "PD2", phase: "escalated", balance: 3600, daysInPhase: 16, notices: 2, notes: "Legal review requested by PM." },
  { id: "dl-3", tenant: "Chris Nolan", property: "North Ridge Apartments", pod: "PD3", phase: "legal", balance: 5100, daysInPhase: 22, notices: 3, notes: "Awaiting court filing confirmation." },
];

const marketListingColumns = [
  { key: "source", header: "Source", sortable: true, minWidth: 100 },
  { key: "address", header: "Address", sortable: true, minWidth: 240 },
  { key: "city", header: "City", sortable: true, minWidth: 120 },
  { key: "beds", header: "Beds", sortable: true, minWidth: 80 },
  { key: "baths", header: "Baths", sortable: true, minWidth: 80 },
  { key: "sqft", header: "Sqft", sortable: true, minWidth: 90 },
  {
    key: "price",
    header: "Price",
    sortable: true,
    sortValue: (row: MarketListingRow) => row.price,
    render: (row: MarketListingRow) => `$${row.price.toLocaleString("en-US")}`,
    minWidth: 120,
  },
  { key: "daysOnMarket", header: "Days", sortable: true, minWidth: 90 },
  { key: "management", header: "Management", sortable: true, minWidth: 180 },
];

const marketListingData: MarketListingRow[] = [
  { id: "mk-1", source: "LT", address: "932 River St", city: "Spokane", beds: 2, baths: 2, sqft: 980, price: 1895, daysOnMarket: 7, management: "LT PM Team" },
  { id: "mk-2", source: "Zillow", address: "1705 Hillcrest Ave", city: "Spokane Valley", beds: 3, baths: 2, sqft: 1260, price: 2190, daysOnMarket: 3, management: "Northwest Realty" },
  { id: "mk-3", source: "Apartments", address: "410 Cedar Ln", city: "Spokane", beds: 1, baths: 1, sqft: 720, price: 1420, daysOnMarket: 11, management: "Lakefront Group" },
];

export const Default: Story = {
  render: () => <DataTable<Row> columns={columns} data={data} getRowKey={(row) => row.id} />,
};

export const Loading: Story = {
  render: () => <DataTable<Row> columns={columns} data={[]} loading />,
};

export const SelectableAndExpandable: Story = {
  render: () => {
    const [selectedRowKeys, setSelectedRowKeys] = useState<DataTableRowKey[]>([]);
    return (
      <div className="space-y-2">
        <DataTable<Row>
          columns={columns}
          data={data}
          getRowKey={(row) => row.id}
          enableRowSelection
          selectedRowKeys={selectedRowKeys}
          onSelectedRowKeysChange={setSelectedRowKeys}
          renderExpandedRow={(row) => (
            <div className="text-xs text-muted-foreground">{row.notes}</div>
          )}
          rowAccentColor={(row) => {
            if (row.status === "Blocked") return "#EF4444";
            if (row.status === "At Risk") return "#F59E0B";
            return undefined;
          }}
        />
        <p className="text-xs text-muted-foreground">
          Selected: {selectedRowKeys.length > 0 ? selectedRowKeys.join(", ") : "none"}
        </p>
      </div>
    );
  },
};

export const DirectoryPageVariant: Story = {
  render: () => (
    <DataTable<DirectoryRow>
      columns={directoryColumns}
      data={directoryData}
      getRowKey={(row) => row.id}
      frozenColumns={1}
      emptyMessage="No directory rows found."
    />
  ),
};

export const TurnCandidatesPageVariant: Story = {
  render: () => (
    <DataTable<TurnCandidateRow>
      columns={turnCandidateColumns}
      data={turnCandidateData}
      getRowKey={(row) => row.id}
      frozenColumns={2}
      emptyMessage="No turn candidates."
    />
  ),
};

export const DelinquencyPageVariant: Story = {
  render: () => {
    const [selectedRowKeys, setSelectedRowKeys] = useState<DataTableRowKey[]>([]);
    return (
      <DataTable<DelinquencyRow>
        columns={delinquencyColumns}
        data={delinquencyData}
        getRowKey={(row) => row.id}
        enableRowSelection
        selectedRowKeys={selectedRowKeys}
        onSelectedRowKeysChange={setSelectedRowKeys}
        rowAccentColor={(row) => {
          if (row.daysInPhase >= 20) return "#EF4444";
          if (row.daysInPhase >= 10) return "#F59E0B";
          return undefined;
        }}
        renderExpandedRow={(row) => (
          <div className="text-xs text-muted-foreground">{row.notes}</div>
        )}
      />
    );
  },
};

export const WideMarketListingsVariant: Story = {
  render: () => (
    <DataTable<MarketListingRow>
      columns={marketListingColumns}
      data={marketListingData}
      getRowKey={(row) => row.id}
      density="compact"
      emptyMessage="No listings found."
    />
  ),
};

export const BiDirectionalScrollVariant: Story = {
  render: () => (
    <DataTable<MarketListingRow>
      columns={marketListingColumns}
      data={[...marketListingData, ...marketListingData, ...marketListingData, ...marketListingData]}
      getRowKey={(row, index) => `${row.id}-${index}`}
      density="compact"
      scrollMaxHeight={260}
      emptyMessage="No listings found."
    />
  ),
};

export const MobileCards: Story = {
  render: () => (
    <div style={{ maxWidth: 420 }}>
      <DataTable<Row>
        columns={columns}
        data={data}
        getRowKey={(row) => row.id}
        mobileMode="cards"
        mobilePrimaryColumnKey="name"
        mobileSecondaryColumnKeys={["role", "status", "balance"]}
        renderMobileCard={(row) => (
          <div className="space-y-1">
            <div className="text-sm font-semibold">{row.name}</div>
            <div className="text-xs text-muted-foreground">
              {row.role} - {row.status}
            </div>
            <div className="text-xs">Balance: ${row.balance.toLocaleString("en-US")}</div>
          </div>
        )}
      />
    </div>
  ),
};
