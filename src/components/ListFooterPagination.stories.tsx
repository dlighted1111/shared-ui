import type { Meta, StoryObj } from "@storybook/react";
import { ListFooterPagination } from "./ListFooterPagination";

const meta: Meta<typeof ListFooterPagination> = {
  title: "Components/ListFooterPagination",
  tags: ["autodocs"],
  component: ListFooterPagination,
  args: {
    from: 1,
    to: 25,
    total: 120,
    page: 0,
    pageSize: 25,
    onPageSizeChange: () => {},
    onPrevious: () => {},
    onNext: () => {},
  },
};

export default meta;
type Story = StoryObj<typeof ListFooterPagination>;

export const Default: Story = {};
