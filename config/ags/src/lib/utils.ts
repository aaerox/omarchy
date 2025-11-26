import { createPoll } from "ags/time";
import { Accessor } from "ags";
import GLib from "gi://GLib?version=2.0";

export const encoder = new TextEncoder();
export const decoder = new TextDecoder("utf-8");

// Creates a time binding that updates every 500ms
export const time = createPoll(
  GLib.DateTime.new_now_local(),
  500,
  () => GLib.DateTime.new_now_local()
);

export function variableToBoolean<T>(variable: Accessor<T>): Accessor<boolean> {
  return variable.as((v) => Boolean(v));
}
