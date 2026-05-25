"use client";

import * as React from "react";
import * as AlertDialogPrimitive from "@radix-ui/react-alert-dialog";

function AlertDialog(props) {
  return <AlertDialogPrimitive.Root data-slot="alert-dialog" {...props} />;
}

function AlertDialogTrigger(props) {
  return (
    <AlertDialogPrimitive.Trigger data-slot="alert-dialog-trigger" {...props} />
  );
}

function AlertDialogPortal(props) {
  return (
    <AlertDialogPrimitive.Portal data-slot="alert-dialog-portal" {...props} />
  );
}

function AlertDialogOverlay(props) {
  return (
    <AlertDialogPrimitive.Overlay
      data-slot="alert-dialog-overlay"
      className="fixed inset-0 z-50 bg-black/50 
                 data-[state=open]:animate-in 
                 data-[state=closed]:animate-out 
                 data-[state=closed]:fade-out-0 
                 data-[state=open]:fade-in-0"
      {...props}
    />
  );
}

function AlertDialogContent(props) {
  return (
    <AlertDialogPortal>
      <AlertDialogOverlay />
      <AlertDialogPrimitive.Content
        data-slot="alert-dialog-content"
        className="fixed top-[50%] left-[50%] z-50 grid w-full 
                   max-w-[calc(100%-2rem)] translate-x-[-50%] 
                   translate-y-[-50%] gap-4 rounded-lg border 
                   bg-white p-6 shadow-lg duration-200 sm:max-w-lg
                   data-[state=open]:animate-in 
                   data-[state=closed]:animate-out 
                   data-[state=closed]:fade-out-0 
                   data-[state=open]:fade-in-0 
                   data-[state=closed]:zoom-out-95 
                   data-[state=open]:zoom-in-95"
        {...props}
      />
    </AlertDialogPortal>
  );
}

function AlertDialogHeader(props) {
  return (
    <div
      data-slot="alert-dialog-header"
      className="flex flex-col gap-2 text-center sm:text-left"
      {...props}
    />
  );
}

function AlertDialogFooter(props) {
  return (
    <div
      data-slot="alert-dialog-footer"
      className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end"
      {...props}
    />
  );
}

function AlertDialogTitle(props) {
  return (
    <AlertDialogPrimitive.Title
      data-slot="alert-dialog-title"
      className="text-lg font-semibold"
      {...props}
    />
  );
}

function AlertDialogDescription(props) {
  return (
    <AlertDialogPrimitive.Description
      data-slot="alert-dialog-description"
      className="text-sm text-gray-500"
      {...props}
    />
  );
}

function AlertDialogAction(props) {
  return (
    <AlertDialogPrimitive.Action
      className="inline-flex items-center justify-center rounded-md 
                 bg-blue-600 px-4 py-2 text-sm font-medium text-white 
                 hover:bg-blue-700 focus:outline-none focus:ring-2 
                 focus:ring-blue-600 focus:ring-offset-2"
      {...props}
    />
  );
}

function AlertDialogCancel(props) {
  return (
    <AlertDialogPrimitive.Cancel
      className="inline-flex items-center justify-center rounded-md 
                 border border-gray-300 bg-white px-4 py-2 text-sm 
                 font-medium text-gray-700 hover:bg-gray-100 
                 focus:outline-none focus:ring-2 focus:ring-gray-400 
                 focus:ring-offset-2"
      {...props}
    />
  );
}

export {
  AlertDialog,
  AlertDialogPortal,
  AlertDialogOverlay,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogFooter,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogAction,
  AlertDialogCancel,
};
