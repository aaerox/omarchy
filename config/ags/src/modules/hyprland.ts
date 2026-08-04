import AstalHyprland from "gi://AstalHyprland";
import Gio from "gi://Gio";

// Hyprland 0.56+ running a *Lua* config evaluates the payload of a `dispatch`
// IPC message as Lua -- literally `return hl.dispatch(<payload>)`. The legacy
// string form ("exec uwsm-app -- foo", "workspace e+1") is a Lua syntax error,
// so every AstalHyprland `.dispatch(name, args)` call became a silent no-op
// after the Lua migration (it only surfaces in the journal as
// "hyprland.vala:206: dispatch error: ')' expected near ..."). Send the Lua
// dispatcher expression ourselves instead of letting Astal build the old one.
export function dispatchLua(dispatcher: string): void {
    const hyprland = AstalHyprland.get_default();

    hyprland.message_async(`dispatch ${dispatcher}`, (_: unknown, res: Gio.AsyncResult) => {
        try {
            const reply = hyprland.message_finish(res)?.trim();
            if (reply && reply !== "ok")
                console.error(`hyprland dispatch "${dispatcher}": ${reply}`);
        } catch (error) {
            console.error(`hyprland dispatch "${dispatcher}" failed: ${error}`);
        }
    });
}

/** Quote a value as a Lua string literal for embedding in a dispatcher call. */
export function luaString(value: string): string {
    return `"${value.replace(/\\/g, "\\\\").replace(/"/g, "\\\"")}"`;
}
