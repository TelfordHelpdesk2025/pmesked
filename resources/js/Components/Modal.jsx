import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";

import { Button } from "@/components/ui/button";

export default function Modal({
    title = "Modal Title",
    buttonText = "",
    children,
    buttonClass = "",
    className = "",
    show = false,
    onClose = () => {},
}) {
    return (
        <>
            {buttonText && (
                <Button className={buttonClass} onClick={() => {}}>
                    {buttonText}
                </Button>
            )}

            <Dialog
                open={show}
                onOpenChange={(open) => {
                    if (!open) onClose();
                }}
            >
                <DialogContent className={`sm:max-w-lg ${className}`}>
                    <DialogHeader>
                        <DialogTitle>{title}</DialogTitle>
                    </DialogHeader>

                    {children}
                </DialogContent>
            </Dialog>
        </>
    );
}
