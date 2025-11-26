import { Gtk } from "ags/gtk4";

// Stub for AskPopup
export interface AskPopupProps {
  title?: string;
  message?: string;
  onAccept?: () => void;
  onCancel?: () => void;
}

export function AskPopup(props: AskPopupProps): Gtk.Widget {
  return <Gtk.Box /> as Gtk.Widget;
}
