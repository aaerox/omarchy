import { Astal, Gtk } from "ags/gtk4";
import { createState } from "ags";
import GLib from "gi://GLib";
import { Tray } from "./widgets/Tray";
import { Workspaces } from "./widgets/Workspaces";
import { FocusedClient } from "./widgets/FocusedClient";
import { Clock } from "./widgets/Clock";
import { Status } from "./widgets/Status";
import { Media } from "./widgets/Media";


export const Bar = (mon: number) => {
    const widgetSpacing = 4;

    // Auto-hide: the bar is collapsed by default and revealed when the pointer
    // reaches the top edge of the screen. Reduces OLED burn-in from the static
    // bar. A 1px "hot edge" stays present as the hover target while collapsed.
    const [revealed, setRevealed] = createState(false);
    // Separate state for the hot edge, driven directly (not via a derived .as()
    // accessor, which doesn't react here). The edge is the always-present hover
    // target while collapsed; hide it once revealed so it doesn't show as a
    // strip below the bar. The revealed bar itself keeps the surface sized.
    const [edgeVisible, setEdgeVisible] = createState(true);
    const revealMs = 200;
    let edgeTimer = 0;
    const motion = new Gtk.EventControllerMotion();
    motion.connect("enter", () => {
        if (edgeTimer) { GLib.source_remove(edgeTimer); edgeTimer = 0; }
        setRevealed(true);
        setEdgeVisible(false);   // hide edge immediately as the bar slides in
    });
    motion.connect("leave", () => {
        setRevealed(false);
        // Defer re-showing the edge until the bar has finished sliding up, so it
        // doesn't visibly pop back in mid-collapse. Cancelled if we re-enter.
        if (edgeTimer) GLib.source_remove(edgeTimer);
        edgeTimer = GLib.timeout_add(GLib.PRIORITY_DEFAULT, revealMs + 40, () => {
            setEdgeVisible(true);
            edgeTimer = 0;
            return GLib.SOURCE_REMOVE;
        });
    });

    return <Astal.Window namespace={"top-bar"} layer={Astal.Layer.TOP}
      anchor={Astal.WindowAnchor.TOP | Astal.WindowAnchor.LEFT | Astal.WindowAnchor.RIGHT}
      exclusivity={Astal.Exclusivity.NORMAL} monitor={mon}
      canFocus={false}
      $={(self) => self.add_controller(motion)}>

        <Gtk.Box class={"bar-autohide"} orientation={Gtk.Orientation.VERTICAL}>
            <Gtk.Revealer revealChild={revealed}
              transitionType={Gtk.RevealerTransitionType.SLIDE_DOWN}
              transitionDuration={200}>
                <Gtk.Box class={"bar-container"} heightRequest={46}>
                    <Gtk.CenterBox class={"bar-centerbox"} hexpand>
                        <Gtk.Box class={"widgets-left"} homogeneous={false}
                          halign={Gtk.Align.START} spacing={widgetSpacing}
                          $type="start">

                            <Workspaces />
                            <FocusedClient />
                        </Gtk.Box>
                        <Gtk.Box class={"widgets-center"} homogeneous={false}
                          spacing={widgetSpacing} halign={Gtk.Align.CENTER}
                          $type="center">

                            <Clock />
                            <Media />
                        </Gtk.Box>
                        <Gtk.Box class={"widgets-right"} homogeneous={false}
                          spacing={widgetSpacing} halign={Gtk.Align.END}
                          $type="end">
                            <Tray />
                            <Status />
                        </Gtk.Box>
                    </Gtk.CenterBox>
                </Gtk.Box>
            </Gtk.Revealer>
            <Gtk.Box class={"bar-hotedge"} heightRequest={6}
              visible={edgeVisible}
              css={"background: rgba(0,0,0,0.1);"} />
        </Gtk.Box>
    </Astal.Window>
}
