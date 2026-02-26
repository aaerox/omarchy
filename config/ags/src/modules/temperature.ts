import GLib from "gi://GLib";
import GObject from "ags/gobject";

const SENSOR_PATH = "/sys/class/hwmon/hwmon2/temp4_input";
const POLL_INTERVAL_MS = 5000;

export class Temperature extends GObject.Object {
  static {
    GObject.registerClass(
      {
        Properties: {
          temperature: GObject.ParamSpec.double(
            "temperature",
            "",
            "",
            GObject.ParamFlags.READWRITE,
            -273,
            200,
            0
          ),
        },
      },
      this
    );
  }

  private static instance: Temperature;

  #temperature: number = 0;
  #timeoutId: number | null = null;

  get temperature(): number {
    return this.#temperature;
  }

  set temperature(value: number) {
    if (this.#temperature !== value) {
      this.#temperature = value;
      this.notify("temperature");
    }
  }

  constructor() {
    super();
    this.#poll();
    this.#startPolling();
  }

  public static getDefault(): Temperature {
    if (!this.instance) {
      this.instance = new Temperature();
    }
    return this.instance;
  }

  #poll(): void {
    try {
      const [ok, contents] = GLib.file_get_contents(SENSOR_PATH);
      if (ok && contents) {
        const millidegrees = parseInt(
          new TextDecoder().decode(contents).trim(),
          10
        );
        this.temperature = Math.round(millidegrees / 1000);
      }
    } catch (e) {
      console.error("Failed to read temperature sensor:", e);
    }
  }

  #startPolling(): void {
    this.#timeoutId = GLib.timeout_add(GLib.PRIORITY_DEFAULT, POLL_INTERVAL_MS, () => {
      this.#poll();
      return GLib.SOURCE_CONTINUE;
    });
  }
}
