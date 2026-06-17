import { Windows } from "../windows";
import GLib from "gi://GLib";

// Shared show/hide coordination for the auto-hiding bar. The bar is a normal
// fixed-size window that is fully opened/closed (not resized in place) -- this
// sidesteps gtk4-layer-shell's inability to shrink a grown surface. The 1px
// HotEdge window opens it on hover; the bar closes itself on pointer-leave with
// a short grace so moving edge -> bar doesn't flicker.

const GRACE_MS = 200;
let closeTimer = 0;

function cancelClose(): void {
    if (closeTimer) { GLib.source_remove(closeTimer); closeTimer = 0; }
}

export function showBar(): void {
    cancelClose();
    if (!Windows.getDefault().isOpen("bar"))
        Windows.getDefault().open("bar");
}

export function cancelHideBar(): void {
    cancelClose();
}

export function scheduleHideBar(): void {
    cancelClose();
    closeTimer = GLib.timeout_add(GLib.PRIORITY_DEFAULT, GRACE_MS, () => {
        Windows.getDefault().close("bar");
        closeTimer = 0;
        return GLib.SOURCE_REMOVE;
    });
}
