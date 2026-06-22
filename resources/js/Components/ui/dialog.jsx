import * as React from "react";
import * as DialogPrimitive from "@radix-ui/react-dialog";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { XIcon } from "lucide-react";


/* ================= ROOT ================= */
function Dialog(props) {
    return <DialogPrimitive.Root data-slot="dialog" {...props} />;
}

function DialogTrigger(props) {
    return <DialogPrimitive.Trigger data-slot="dialog-trigger" {...props} />;
}

function DialogPortal(props) {
    return <DialogPrimitive.Portal data-slot="dialog-portal" {...props} />;
}

function DialogClose(props) {
    return <DialogPrimitive.Close data-slot="dialog-close" {...props} />;
}

/* ================= OVERLAY (FIXED) ================= */
const DialogOverlay = React.forwardRef((props, ref) => {
    const { className, ...rest } = props;

    return (
        <DialogPrimitive.Overlay
            ref={ref}
            data-slot="dialog-overlay"
            className={cn(
                // was bg-black/10 — practically invisible. Bumped to /50 so
                // the page behind the dialog is actually dimmed.
                "fixed inset-0 isolate z-50 bg-black/50 duration-100 supports-backdrop-filter:backdrop-blur-xs data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=closed]:animate-out data-[state=closed]:fade-out-0",
                className,
            )}
            {...rest}
        />
    );
});

DialogOverlay.displayName = "DialogOverlay";

/* ================= CONTENT (FIXED) ================= */
const DialogContent = React.forwardRef((props, ref) => {
    const { className, children, showCloseButton = true, ...rest } = props;

    return (
        <DialogPortal>
            <DialogOverlay />
            <DialogPrimitive.Content
                ref={ref}
                data-slot="dialog-content"
                className={cn(
                    // Default size lives at the SAME breakpoint (sm:max-w-sm)
                    // you need to match when overriding. If a parent passes
                    // a plain `max-w-5xl` (no breakpoint prefix), this
                    // sm:max-w-sm still wins on screens >= 640px, because
                    // Tailwind emits breakpoint utilities after base
                    // utilities in the compiled CSS — same specificity,
                    // later rule wins regardless of class string order.
                    //
                    // When overriding from a parent, match (or exceed) this
                    // breakpoint, e.g. pass `sm:max-w-5xl` instead of
                    // `max-w-5xl`.
                    "fixed top-1/2 left-1/2 z-50 grid w-full max-w-[calc(100%-2rem)] -translate-x-1/2 -translate-y-1/2 gap-4 rounded-xl bg-popover p-4 text-sm text-popover-foreground ring-1 ring-foreground/10 duration-100 outline-none sm:max-w-sm data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95",
                    className,
                )}
                {...rest}
            >
                {children}

                {showCloseButton && (
                    <DialogPrimitive.Close data-slot="dialog-close" asChild>
                        <Button
                            variant="ghost"
                            className="absolute top-2 right-2"
                            size="icon-sm"
                        >
                            <XIcon />
                            <span className="sr-only">Close</span>
                        </Button>
                    </DialogPrimitive.Close>
                )}
            </DialogPrimitive.Content>
        </DialogPortal>
    );
});

DialogContent.displayName = "DialogContent";

/* ================= HEADER ================= */
function DialogHeader({ className, ...props }) {
    return (
        <div
            data-slot="dialog-header"
            className={cn("flex flex-col gap-2", className)}
            {...props}
        />
    );
}

/* ================= FOOTER ================= */
function DialogFooter({
    className,
    showCloseButton = false,
    children,
    ...props
}) {
    return (
        <div
            data-slot="dialog-footer"
            className={cn(
                "-mx-4 -mb-4 flex flex-col-reverse gap-2 rounded-b-xl border-t bg-muted/50 p-4 sm:flex-row sm:justify-end",
                className,
            )}
            {...props}
        >
            {children}

            {showCloseButton && (
                <DialogPrimitive.Close asChild>
                    <Button variant="outline">Close</Button>
                </DialogPrimitive.Close>
            )}
        </div>
    );
}

/* ================= TITLE (FIXED) ================= */
const DialogTitle = React.forwardRef((props, ref) => {
    const { className, ...rest } = props;

    return (
        <DialogPrimitive.Title
            ref={ref}
            data-slot="dialog-title"
            className={cn("text-base leading-none font-medium", className)}
            {...rest}
        />
    );
});

DialogTitle.displayName = "DialogTitle";

/* ================= DESCRIPTION (FIXED) ================= */
const DialogDescription = React.forwardRef((props, ref) => {
    const { className, ...rest } = props;

    return (
        <DialogPrimitive.Description
            ref={ref}
            data-slot="dialog-description"
            className={cn(
                "text-sm text-muted-foreground *:[a]:underline *:[a]:underline-offset-3 *:[a]:hover:text-foreground",
                className,
            )}
            {...rest}
        />
    );
});

DialogDescription.displayName = "DialogDescription";

/* ================= EXPORTS ================= */
export {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogOverlay,
    DialogPortal,
    DialogTitle,
    DialogTrigger,
};
