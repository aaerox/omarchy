import { Astal, Gtk, Gdk } from "ags/gtk4";
import { showBar } from "./autohide";

// A permanently-present 1px layer-shell window pinned to the top edge. It is the
// hover detector for the auto-hiding bar: pointer-enter opens the bar window.
// Because it is a dedicated fixed 1px surface it never grows/balloons and never
// needs to shrink -- the failure mode that killed the in-bar Revealer approach.
// A near-zero-alpha background keeps it a real input target without being visible.
export const HotEdge = (mon: Gdk.Monitor) => {
    const motion = new Gtk.EventControllerMotion();
    motion.connect("enter", () => showBar());

    return <Astal.Window namespace={"top-hotedge"} layer={Astal.Layer.TOP}
      anchor={Astal.WindowAnchor.TOP | Astal.WindowAnchor.LEFT | Astal.WindowAnchor.RIGHT}
      exclusivity={Astal.Exclusivity.NORMAL} gdkmonitor={mon} canFocus={false}
      $={(self) => { self.set_default_size(-1, 1); self.add_controller(motion); }}>
        <Gtk.Box heightRequest={1} css={"background: rgba(0,0,0,0.01);"} />
    </Astal.Window>
}
