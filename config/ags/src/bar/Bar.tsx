import { Astal, Gtk } from "ags/gtk4";
import { cancelHideBar, scheduleHideBar } from "./autohide";
import { Tray } from "./widgets/Tray";
import { Workspaces } from "./widgets/Workspaces";
import { FocusedClient } from "./widgets/FocusedClient";
import { Clock } from "./widgets/Clock";
import { Status } from "./widgets/Status";
import { Media } from "./widgets/Media";


export const Bar = (mon: number) => {
    const widgetSpacing = 4;

    // Auto-hide: the bar is opened on demand by the HotEdge window (pointer at the
    // top edge) and closes itself when the pointer leaves, after a short grace so
    // moving from the edge into the bar doesn't flicker. It's a normal fixed-size
    // window that is fully opened/closed -- never resized -- and overlays content
    // (NORMAL exclusivity) so hiding it reclaims the space.
    const motion = new Gtk.EventControllerMotion();
    motion.connect("enter", () => cancelHideBar());
    motion.connect("leave", () => scheduleHideBar());

    return <Astal.Window namespace={"top-bar"} layer={Astal.Layer.TOP}
      anchor={Astal.WindowAnchor.TOP | Astal.WindowAnchor.LEFT | Astal.WindowAnchor.RIGHT}
      exclusivity={Astal.Exclusivity.NORMAL} heightRequest={66} monitor={mon}
      canFocus={false}
      $={(self) => self.add_controller(motion)}>

        <Gtk.Box class={"bar-container"}
          css={"background-image: linear-gradient(to bottom, rgba(15,25,35,0.55) 0%, rgba(15,25,35,0.55) 72%, rgba(15,25,35,0) 100%); padding-top: 8px; padding-bottom: 0px;"}>
            <Gtk.CenterBox class={"bar-centerbox"} hexpand valign={Gtk.Align.START}>
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
    </Astal.Window>
}
