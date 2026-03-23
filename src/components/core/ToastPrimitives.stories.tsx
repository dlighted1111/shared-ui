import * as ToastPrimitive from "@radix-ui/react-toast";
import type { Meta, StoryObj } from "@storybook/react";
import { Toast, ToastDescription, ToastTitle } from "./ToastPrimitives";

const meta: Meta = {
  title: "Core/ToastPrimitives",
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj;

export const Static: Story = {
  render: () => (
    <ToastPrimitive.Provider swipeDirection="right">
      <ToastPrimitive.Viewport className="fixed bottom-0 right-0 flex max-h-screen w-full flex-col-reverse gap-2 p-4 sm:bottom-4 sm:right-4 sm:top-auto sm:flex-col md:max-w-[420px]" />
      <Toast defaultOpen duration={1_000_000}>
        <div className="grid gap-1">
          <ToastTitle>Toast title</ToastTitle>
          <ToastDescription>Low-level Radix toast primitives (long duration for Storybook).</ToastDescription>
        </div>
      </Toast>
    </ToastPrimitive.Provider>
  ),
};
