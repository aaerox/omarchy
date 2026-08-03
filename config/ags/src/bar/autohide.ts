import { Windows } from "../windows";
import GLib from "gi://GLib";

// Shared show/hide coordination for the auto-hiding bar. The bar is a single
// persistent fixed-size window that is hidden/shown (NOT created/destroyed) --
// create/destroy-per-hover leaked layer surfaces whose 66px input regions
// captured the pointer (see Windows.setVisible). The 1px HotEdge window shows
// it on hover; the bar hides itself on pointer-leave with a short grace so
// moving edge -> bar doesn't flicker.

const GRACE_MS = 200;
let closeTimer = 0;

function cancelClose(): void {
    if (closeTimer) { GLib.source_remove(closeTimer); closeTimer = 0; }
}

export function showBar(): void {
    cancelClose();
    Windows.getDefault().setVisible("bar", true);
}

export function cancelHideBar(): void {
    cancelClose();
}

export function scheduleHideBar(): void {
    cancelClose();
    closeTimer = GLib.timeout_add(GLib.PRIORITY_DEFAULT, GRACE_MS, () => {
        Windows.getDefault().setVisible("bar", false);
        closeTimer = 0;
        return GLib.SOURCE_REMOVE;
    });
}
