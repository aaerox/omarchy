import { Astal, Gdk } from "ags/gtk4";
import GObject, { getter, register, signal } from "ags/gobject";
import { variableToBoolean } from "./modules/utils";
import { createRoot, getScope, onCleanup } from "ags";
import { exec } from "ags/process";
import { Bar } from "./bar/Bar";
import { HotEdge } from "./bar/HotEdge";

import AstalHyprland from "gi://AstalHyprland";
import GLib from "gi://GLib";

function getActiveMonitorNames(): Set<string> | null {
    try {
        const json = exec("hyprctl monitors all -j");
        const monitors: Array<{ name: string; mirrorOf: string; description: string }> = JSON.parse(json);
        return new Set(
            monitors
                // Skip mirrors, and skip the Anthem MRX 540 AV receiver: it's an
                // audio-only output (kept alive for 7.1 surround) with no real
                // display, so it must not get its own bar.
                .filter(m => (m.mirrorOf === "" || m.mirrorOf === "none")
                    && !/MRX 540/i.test(m.description ?? ""))
                .map(m => m.name)
        );
    } catch (_) {
        return null;
    }
}


// Enumerate GDK monitors. The Gio.ListModel has no JS iterator helper, so walk
// it by index until get_item returns null.
function getGdkMonitors(): Array<Gdk.Monitor> {
    const display = Gdk.Display.get_default();
    if (!display) return [];
    const model = display.get_monitors();
    const out: Array<Gdk.Monitor> = [];
    for (let i = 0; ; i++) {
        const m = model.get_item(i) as Gdk.Monitor | null;
        if (!m) break;
        out.push(m);
    }
    return out;
}


export type WindowInstance = { instance?: Astal.Window, connections: Array<number> };
export type WindowData = {
    create: () => (Astal.Window | Array<Astal.Window>);
    instance?: WindowInstance | Array<WindowInstance>;
    status?: "open" | "closed";
};


@register({ GTypeName: "Windows" })
export class Windows extends GObject.Object {
    private static instance: (Windows | null);

    declare $signals: GObject.Object.SignalSignatures & {
        "window-open": (name: string) => void;
        "window-closed": (name: string) => void;
    };

    #scope!: ReturnType<typeof getScope>;
    #reopenTimeout: number = 0;
    #pendingReopen: Array<string> | null = null;
    #windows: Record<string, WindowData> = {
        "bar": { create: this.createWindowForMonitors(Bar) },
        "hot-edge": { create: this.createWindowForMonitors(HotEdge) },
    };

    @signal(String) windowOpen(_name: string) {}
    @signal(String) windowClosed(_name: string) {}

    @getter(Object)
    get windows(): object { return this.#windows; }

    @getter(Array)
    get openWindows(): Array<string> {
        return Object.keys(this.#windows).filter((key) =>
            this.#windows[key].status === "open");
    }

    constructor() {
        super();

        createRoot((dispose) => {
            this.#scope = getScope();

            const hyprConnections = [
                AstalHyprland.get_default().connect("monitor-added", () =>
                    this.debouncedReopen()),
                AstalHyprland.get_default().connect("monitor-removed", (_: any, id: number) =>
                    this.debouncedReopen(id))
            ];

            onCleanup(() => {
                hyprConnections.forEach(id => AstalHyprland.get_default().disconnect(id));
                this.openWindows.forEach(name => this.disconnectWindow(name));
            });

        });
    }

    private disconnectWindow(name: string) {
        if(!variableToBoolean(this.#windows[name]?.instance) || !this.#windows[name]) {
            return;
        }

        const window = this.#windows[name].instance!;

        if(Array.isArray(window)) {
            window.forEach(win => {
                this._disconnectAllFromInstance(win.instance!, win.connections!)
                win.connections = [];
            });
            return;
        }

        this._disconnectAllFromInstance(window.instance!, window.connections!);
        window.connections = [];
    }

    private _disconnectAllFromInstance(instance: GObject.Object, connections: Array<number>): void {
        connections.forEach(id =>
            GObject.signal_handler_is_connected(instance, id) &&
                instance.disconnect(id));
    }

    private hasConnections(name: string): boolean {
        if(!this.openWindows.includes(name))
            return false;

        const window = this.#windows[name].instance;
        if(!window) return false;

        if(Array.isArray(window)) {
            for(const win of window) {
                if(win.connections?.length > 0)
                    return true;
            }
            return false;
        }

        return window.connections?.length > 0;
    }

    private connectWindow(name: string) {
        if(this.hasConnections(name)) {
            return;
        }

        if(!this.openWindows.includes(name)) {
            return;
        }

        const window = this.#windows[name as keyof typeof this.windows];
        if(!window || !window.instance) {
            return;
        }

        if(Array.isArray(window.instance)) {
            window.instance.forEach(inst => inst.connections = [
                inst.instance!.connect("close-request", () => {
                    this.disconnectWindow(name);
                    delete window.instance;
                    window.status = "closed";
                    this.notify("open-windows");
                })
            ]);
            return;
        }

        window.instance.connections = [
            window.instance.instance!.connect("close-request", () => {
                this.disconnectWindow(name);
                delete window.instance;
                window.status = "closed";
                this.notify("open-windows");
            })
        ];
    }

    public static getDefault(): Windows {
        if(!this.instance)
            this.instance = new Windows();

        return this.instance;
    }

    public createWindowForMonitors(create: (mon: Gdk.Monitor) => GObject.Object|Astal.Window): (() => Array<Astal.Window>) {
        return () => {
            const hyprMonitors = AstalHyprland.get_default().get_monitors();

            if(hyprMonitors.length < 1)
                throw new Error("Couldn't create window for monitors");

            // Resolve each Hyprland monitor to its GDK monitor by connector name
            // and target the window via the `gdkmonitor` prop. The integer
            // `monitor` prop is a GDK monitor *index*, but GDK orders monitors
            // differently from Hyprland and reshuffles that order on every
            // hotplug -- so passing a Hyprland id put the bar on the wrong
            // output (e.g. the audio-only DP-1) after toggling the projector.
            const gdkByConnector = new Map<string, Gdk.Monitor>();
            for (const gm of getGdkMonitors())
                gdkByConnector.set(gm.connector ?? "", gm);

            const active = getActiveMonitorNames();
            return hyprMonitors
                .filter(mon => mon && (!active || active.has(mon.name)))
                .map(mon => {
                    const gm = gdkByConnector.get(mon.name);
                    if (!gm) {
                        console.error(`Windows: no GDK monitor for ${mon.name}; skipping`);
                        return null;
                    }
                    return createRoot(() => {
                        const scope = getScope();
                        const instance = create(gm) as Astal.Window;
                        const connection: number = instance.connect("close-request", () =>
                            scope.dispose());

                        this.#scope.onMount(scope.dispose);

                        scope.onCleanup(() =>
                            GObject.signal_handler_is_connected(instance, connection) &&
                                instance.disconnect(connection)
                        );

                        return instance;
                    });
                })
                .filter((w): w is Astal.Window => w != null);
        }
    }

    public createWindowForFocusedMonitor(create: (mon: number) => GObject.Object|Astal.Window): (() => Astal.Window) {
        const focusedMonitor = this.getFocusedMonitorId();

        if(focusedMonitor == null)
            throw new Error("Couldn't create window for focused monitor");

        return () => {
            return createRoot((dispose) => {
                const scope = getScope();
                const instance = create(focusedMonitor) as Astal.Window;
                const connection = instance.connect("close-request", () => dispose());

                this.#scope.onMount(dispose)
                scope.onCleanup(() =>
                    GObject.signal_handler_is_connected(instance, connection) &&
                        instance.disconnect(connection)
                );

                return instance;
            });
        }
    }

    public getFocusedMonitorId(): (number|null) {
        return AstalHyprland.get_default().get_monitors().filter(mon => mon?.focused)?.[0]?.id ?? null;
    }

    public isOpen(name: string): boolean {
        return this.openWindows.includes(name);
    }

    public open(name: string, ignoreOpenStatus: boolean = false): void {
        if(this.isOpen(name) && !ignoreOpenStatus) return;

        const window = this.#windows[name];
        if(!window) {
            console.error(`Windows: cannot open window: ${name}`);
            return;
        }

        this.#windows[name].status = "open";
        const windowInstance = window.create();

        if(Array.isArray(windowInstance)) {
            window.instance = windowInstance.map(wi => {
                wi.show();
                return { instance: wi, connections: [] };
            });
        } else {
            window.instance = { instance: windowInstance, connections: [] };
            windowInstance.show();
        }

        this.connectWindow(name);

        this.emit("window-open", name);
        this.notify("open-windows");
    }

    public close(name: string): void {
        if(!this.isOpen(name)) return;

        this.disconnectWindow(name);
        const window = this.#windows[name];

        if(Array.isArray(window.instance))
            window.instance.map(inst => inst.instance!.close());
        else
            window.instance!.instance!.close();

        this.#windows[name].status = "closed";

        this.emit("window-closed", name);
        this.notify("open-windows");
    }

    public toggle(name: string): void {
        this.isOpen(name) ? this.close(name) : this.open(name);
    }

    // Show/hide an already-open window's surfaces WITHOUT destroying them. The
    // auto-hiding bar uses this instead of open/close-per-hover: creating and
    // destroying a layer-shell window on every hover leaked surfaces (the GTK
    // destroy is blocked when it lands during GC -- "Attempting to run a JS
    // callback during garbage collection"), and each leaked 66px bar kept a
    // full-width input region at the top that captured the pointer. A single
    // persistent window toggled via hide()/show() never leaks.
    public setVisible(name: string, visible: boolean): void {
        const window = this.#windows[name];
        if(!window?.instance) return;

        const instances = Array.isArray(window.instance) ? window.instance : [window.instance];
        instances.forEach(inst => {
            if(!inst.instance) return;
            visible ? inst.instance.show() : inst.instance.hide();
        });
    }

    public closeAll(): void {
        this.openWindows.forEach(name => this.close(name));
    }

    private closeWindowsForMonitor(monitorId: number): void {
        for (const name of this.openWindows) {
            const window = this.#windows[name];
            if (!window?.instance || !Array.isArray(window.instance)) continue;

            const remaining = window.instance.filter(inst => {
                const win = inst.instance as Astal.Window;
                if (win?.monitor === monitorId) {
                    this._disconnectAllFromInstance(win, inst.connections);
                    win.close();
                    return false;
                }
                return true;
            });

            window.instance = remaining;
        }
    }

    private debouncedReopen(removedMonitorId?: number): void {
        if (this.openWindows.length > 0)
            this.#pendingReopen = [...this.openWindows];

        if (removedMonitorId != null)
            this.closeWindowsForMonitor(removedMonitorId);

        if (this.#reopenTimeout)
            GLib.source_remove(this.#reopenTimeout);

        this.#reopenTimeout = GLib.timeout_add(GLib.PRIORITY_DEFAULT, 1000, () => {
            this.#reopenTimeout = 0;
            const wins = this.#pendingReopen ?? [];
            this.#pendingReopen = null;
            if (AstalHyprland.get_default().get_monitors().length > 0) {
                this.closeAll();
                wins.forEach(name => this.open(name));
                // The bar is persistent-but-hidden; after a hotplug reopen it
                // would come back shown, so re-hide it (the hot-edge reveals it
                // on hover, as at startup).
                this.setVisible("bar", false);
            }
            return GLib.SOURCE_REMOVE;
        });
    }

    public reopen(): void {
        const openWins = [ ...this.openWindows ];
        this.closeAll();
        openWins.forEach(name => this.open(name));
    }
}
