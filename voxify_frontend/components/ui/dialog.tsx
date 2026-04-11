"use client";

import * as React from "react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { X } from "lucide-react";

import { cn } from "@/lib/utils";

const Dialog = DialogPrimitive.Root;
const DialogTrigger = DialogPrimitive.Trigger;
const DialogPortal = DialogPrimitive.Portal;
const DialogClose = DialogPrimitive.Close;

const DialogOverlay = React.forwardRef<
  React.ComponentRef<typeof DialogPrimitive.Overlay>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Overlay>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Overlay
    ref={ref}
    className={cn(
      "fixed inset-0 z-50 bg-black/50 backdrop-blur-[2px] data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:animate-in data-[state=open]:fade-in-0",
      className,
    )}
    {...props}
  />
));
DialogOverlay.displayName = DialogPrimitive.Overlay.displayName;

type DialogContentProps = React.ComponentPropsWithoutRef<typeof DialogPrimitive.Content> & {
  variant?: "default" | "drawer";
};

const DialogContent = React.forwardRef<React.ComponentRef<typeof DialogPrimitive.Content>, DialogContentProps>(
  ({ className, children, variant = "default", ...props }, ref) => (
    <DialogPortal>
      <DialogOverlay className={variant === "drawer" ? "md:hidden" : undefined} />
      <DialogPrimitive.Content
        ref={ref}
        className={cn(
          "fixed z-50 gap-4 border border-border bg-background shadow-lg duration-200 outline-none data-[state=closed]:animate-out data-[state=open]:animate-in",
          variant === "default" &&
            "top-1/2 left-1/2 grid w-[calc(100%-1.5rem)] max-w-lg -translate-x-1/2 -translate-y-1/2 rounded-xl p-6 data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95",
          variant === "drawer" &&
            "inset-y-0 right-0 left-auto flex h-dvh max-h-dvh w-[min(100%-1rem,20rem)] max-w-none translate-x-0 translate-y-0 flex-col rounded-none rounded-l-xl border-r-0 border-t-0 border-b-0 p-0 data-[state=closed]:slide-out-to-right data-[state=closed]:fade-out-0 data-[state=open]:slide-in-from-right data-[state=open]:fade-in-0 md:hidden",
          className,
        )}
        {...props}
      >
        {children}
        <DialogPrimitive.Close
          className="absolute top-4 right-4 rounded-md p-1 opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none"
          aria-label="Fermer"
        >
          <X className="size-4" />
        </DialogPrimitive.Close>
      </DialogPrimitive.Content>
    </DialogPortal>
  ),
);
DialogContent.displayName = DialogPrimitive.Content.displayName;

const DialogHeader = ({ className, ...props }: React.ComponentProps<"div">) => (
  <div className={cn("flex flex-col gap-1.5 text-center sm:text-left", className)} {...props} />
);

const DialogTitle = React.forwardRef<
  React.ComponentRef<typeof DialogPrimitive.Title>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Title>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Title ref={ref} className={cn("text-lg leading-none font-semibold tracking-tight", className)} {...props} />
));
DialogTitle.displayName = DialogPrimitive.Title.displayName;

const DialogDescription = React.forwardRef<
  React.ComponentRef<typeof DialogPrimitive.Description>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Description>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Description ref={ref} className={cn("text-sm text-muted-foreground", className)} {...props} />
));
DialogDescription.displayName = DialogPrimitive.Description.displayName;

export {
  Dialog,
  DialogPortal,
  DialogTrigger,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
};
