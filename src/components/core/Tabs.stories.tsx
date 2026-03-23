import type { Meta, StoryObj } from "@storybook/react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./Tabs";

const meta: Meta = {
  title: "Core/Tabs",
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj;

export const Default: Story = {
  render: () => (
    <Tabs defaultValue="one" className="w-full max-w-sm">
      <TabsList>
        <TabsTrigger value="one">One</TabsTrigger>
        <TabsTrigger value="two">Two</TabsTrigger>
      </TabsList>
      <TabsContent value="one" className="mt-2 text-sm text-muted-foreground">
        First panel content.
      </TabsContent>
      <TabsContent value="two" className="mt-2 text-sm text-muted-foreground">
        Second panel content.
      </TabsContent>
    </Tabs>
  ),
};
