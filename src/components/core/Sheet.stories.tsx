import type { Meta, StoryObj } from "@storybook/react";
import { Button } from "./Button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "./Sheet";

const meta: Meta = {
  title: "Core/Sheet",
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj;

export const Default: Story = {
  render: () => (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="secondary" size="sm">
          Open sheet
        </Button>
      </SheetTrigger>
      <SheetContent side="right">
        <SheetHeader>
          <SheetTitle>Sheet panel</SheetTitle>
        </SheetHeader>
        <p className="text-sm text-muted-foreground">Sheet content placeholder.</p>
      </SheetContent>
    </Sheet>
  ),
};
