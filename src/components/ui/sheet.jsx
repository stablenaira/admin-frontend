import * as React from "react";
import * as SheetPrimitive from "@radix-ui/react-dialog";
import { XIcon } from "lucide-react";

function Sheet({ ...props }) {
  return <SheetPrimitive.Root data-slot="sheet" {...props} />;
}

function SheetTrigger({
  ...props
}) {
  return <SheetPrimitive.Trigger data-slot="sheet-trigger" {...props} />;
}

function SheetClose({
  ...props
}) {
  return <SheetPrimitive.Close data-slot="sheet-close" {...props} />;
}

function SheetPortal({
  ...props
}) {
  return <SheetPrimitive.Portal data-slot="sheet-portal" {...props} />;
}

function SheetOverlay({
  className,
  ...props
}) {
  return (
    <SheetPrimitive.Overlay
      data-slot="sheet-overlay"
      className={`data-[state=open]:animate-in data-[state=closed]:animate-out 
        data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 
        fixed inset-0 z-50 bg-black/50 backdrop-blur-sm
        data-[state=closed]:duration-300 data-[state=open]:duration-300
        ${className || ""}`}
      {...props}
    />
  );
}

function SheetContent({
  className,
  children,
  side = "right",
  ...props
}) {
  return (
    <SheetPortal>
      <SheetOverlay />
      <SheetPrimitive.Content
        data-slot="sheet-content"
        className={`bg-background data-[state=open]:animate-in data-[state=closed]:animate-out 
          fixed z-50 flex flex-col gap-4 shadow-xl border
          transition-all duration-300 ease-in-out
          data-[state=closed]:duration-300 data-[state=open]:duration-300
          p-6
          ${
            side === "right"
              ? `data-[state=closed]:slide-out-to-right data-[state=open]:slide-in-from-right 
                 inset-y-0 right-0 h-full w-1/2 border-l
                 data-[state=closed]:translate-x-full data-[state=open]:translate-x-0`
              : ""
          }
          ${
            side === "left"
              ? `data-[state=closed]:slide-out-to-left data-[state=open]:slide-in-from-left 
                 inset-y-0 left-0 h-full w-1/2 border-r
                 data-[state=closed]:-translate-x-full data-[state=open]:translate-x-0`
              : ""
          }
          ${
            side === "top"
              ? `data-[state=closed]:slide-out-to-top data-[state=open]:slide-in-from-top 
                 inset-x-0 top-0 h-auto border-b max-h-[90vh]
                 data-[state=closed]:-translate-y-full data-[state=open]:translate-y-0`
              : ""
          }
          ${
            side === "bottom"
              ? `data-[state=closed]:slide-out-to-bottom data-[state=open]:slide-in-from-bottom 
                 inset-x-0 bottom-0 h-auto border-t max-h-[90vh]
                 data-[state=closed]:translate-y-full data-[state=open]:translate-y-0`
              : ""
          }
          ${className || ""}`}
        {...props}
      >
        {children}
        <SheetPrimitive.Close className="ring-offset-background focus:ring-ring 
          absolute top-4 right-4 rounded-sm opacity-70 
          transition-all duration-200 hover:opacity-100 hover:scale-110
          focus:ring-2 focus:ring-offset-2 focus:outline-none 
          disabled:pointer-events-none bg-secondary/80 hover:bg-secondary
          p-1.5 border border-border/50">
          <XIcon className="size-4" />
          <span className="sr-only">Close</span>
        </SheetPrimitive.Close>
      </SheetPrimitive.Content>
    </SheetPortal>
  );
}

function SheetHeader({
  className,
  ...props
}) {
  return (
    <div
      data-slot="sheet-header"
      className={`flex flex-col gap-2 pb-4 border-b border-border/10 ${className || ""}`}
      {...props}
    />
  );
}

function SheetFooter({
  className,
  ...props
}) {
  return (
    <div
      data-slot="sheet-footer"
      className={`mt-auto flex flex-col gap-2 pt-4 border-t border-border/10 ${className || ""}`}
      {...props}
    />
  );
}

function SheetTitle({
  className,
  ...props
}) {
  return (
    <SheetPrimitive.Title
      data-slot="sheet-title"
      className={`text-foreground font-semibold text-lg ${className || ""}`}
      {...props}
    />
  );
}

function SheetDescription({
  className,
  ...props
}) {
  return (
    <SheetPrimitive.Description
      data-slot="sheet-description"
      className={`text-muted-foreground text-sm leading-relaxed ${className || ""}`}
      {...props}
    />
  );
}

export {
  Sheet,
  SheetTrigger,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetFooter,
  SheetTitle,
  SheetDescription,
};