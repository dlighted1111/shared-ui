import type { Meta, StoryObj } from "@storybook/react";
import { Button } from "./core/Button";
import { FilterPopover } from "./FilterPopover";

const meta: Meta<typeof FilterPopover> = {
  title: "Components/FilterPopover",
  tags: ["autodocs"],
  component: FilterPopover,
};

export default meta;
type Story = StoryObj<typeof FilterPopover>;

export const Default: Story = {
  render: () => (
    <FilterPopover
      activeCount={2}
      pills={[
        { key: "a", label: "Filter A", onRemove: () => {} },
        { key: "b", label: "Filter B", onRemove: () => {} },
      ]}
      onClearAll={() => {}}
      render={({ body, onClearAll, hasActiveFilters }) => (
        <div className="max-w-md rounded-md border border-border p-3">
          <div className="mb-2 flex items-center justify-between">
            <span className="text-sm font-medium">Filters</span>
            {hasActiveFilters ? (
              <Button variant="secondary" size="sm" onClick={onClearAll}>
                Clear all
              </Button>
            ) : null}
          </div>
          {body}
        </div>
      )}
    >
      <p className="text-sm text-muted-foreground">Custom filter body slot.</p>
    </FilterPopover>
  ),
};
