import type { Meta, StoryObj } from "@storybook/react";
import { Button } from "./Button";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "./Collapsible";

const meta: Meta = {
  title: "Core/Collapsible",
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj;

export const Default: Story = {
  render: () => (
    <Collapsible defaultOpen={false}>
      <CollapsibleTrigger asChild>
        <Button variant="secondary" size="sm">
          Toggle section
        </Button>
      </CollapsibleTrigger>
      <CollapsibleContent>
        <p className="mt-2 text-sm text-muted-foreground">Additional details appear here.</p>
      </CollapsibleContent>
    </Collapsible>
  ),
};
