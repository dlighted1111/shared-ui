import type { Meta, StoryObj } from "@storybook/react";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "./Command";

const meta: Meta = {
  title: "Core/Command",
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj;

export const Default: Story = {
  render: () => (
    <Command className="max-w-md rounded-lg border shadow-md">
      <CommandInput placeholder="Type a command..." />
      <CommandList>
        <CommandEmpty>No results.</CommandEmpty>
        <CommandGroup>
          <div className="px-2 py-1.5 text-xs font-medium text-muted-foreground">Suggestions</div>
          <CommandItem value="calendar">Calendar</CommandItem>
          <CommandItem value="search">Search</CommandItem>
        </CommandGroup>
      </CommandList>
    </Command>
  ),
};
