#!/usr/bin/env -S ags run --gtk 4

import { Windows } from "./src/windows";
import AstalHyprland from "gi://AstalHyprland";
import { Gtk, Gdk, Astal } from "ags/gtk4";
import { createRoot, getScope } from "ags";
import { programArgs, programInvocationName } from "system";
import GObject, { register } from "ags/gobject";
import GLib from "gi://GLib";
import Gio from "gi://Gio";
import { Stylesheet } from "./src/modules/stylesheet";

@register({ GTypeName: "OmarchyShell" })
export class OmarchyShell extends Astal.Application {
  private static instance: OmarchyShell;
  #styleProvider = Gtk.CssProvider.new();

  constructor() {
    super({
      applicationId: "io.omarchy.ags",
      flags: Gio.ApplicationFlags.DEFAULT_FLAGS,
    });
  }

  public static getDefault(): OmarchyShell {
    if (!this.instance) {
      this.instance = new OmarchyShell();
    }
    return this.instance;
  }

  public applyStyle(stylesheet: string): void {
    try {
      this.#styleProvider.load_from_string(stylesheet);
      Gtk.StyleContext.add_provider_for_display(
        Gdk.Display.get_default()!,
        this.#styleProvider,
        Gtk.STYLE_PROVIDER_PRIORITY_APPLICATION
      );
    } catch(_e) {
      const e = _e as Error;
      console.error(`Omarchy: Couldn't apply style. Stderr: ${e}`);
    }
  }

  public resetStyle(): void {
    Gtk.StyleContext.remove_provider_for_display(
      Gdk.Display.get_default()!,
      this.#styleProvider
    );
  }

  vfunc_activate(): void {
    super.vfunc_activate();
    this.hold();
    this.main();
  }

  private main(): void {
    Gtk.init();

    // Load simple CSS
    const cssPath = `${GLib.get_user_config_dir()}/ags/style.css`;
    const cssProvider = Gtk.CssProvider.new();
    cssProvider.load_from_path(cssPath);
    Gtk.StyleContext.add_provider_for_display(
      Gdk.Display.get_default()!,
      cssProvider,
      Gtk.STYLE_PROVIDER_PRIORITY_APPLICATION
    );

    // Initialize Windows management system
    createRoot((dispose) => {
      console.log("Omarchy AGS: Initializing");
      this.connect("shutdown", () => dispose());

      // Initialize Windows system and open bar
      const windows = Windows.getDefault();
      windows.open("bar");
    });
  }

  quit(): void {
    this.release();
  }
}

OmarchyShell.getDefault().runAsync([programInvocationName, ...programArgs]);
