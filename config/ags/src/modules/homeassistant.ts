import GLib from "gi://GLib";
import GObject from "ags/gobject";
import { exec, execAsync } from "ags/process";
import { generalConfig } from "../config";

const POLL_INTERVAL_MS = 10000;

export class HomeAssistant extends GObject.Object {
  static {
    GObject.registerClass(
      {
        Properties: {
          amplifierOn: GObject.ParamSpec.boolean(
            "amplifierOn",
            "",
            "",
            GObject.ParamFlags.READWRITE,
            false
          ),
        },
      },
      this
    );
  }

  private static instance: HomeAssistant;

  #amplifierOn: boolean = false;
  #timeoutId: number | null = null;

  get amplifierOn(): boolean {
    return this.#amplifierOn;
  }

  set amplifierOn(value: boolean) {
    if (this.#amplifierOn !== value) {
      this.#amplifierOn = value;
      this.notify("amplifierOn");
    }
  }

  constructor() {
    super();
    this.#pollSync();
    this.#startPolling();
  }

  public static getDefault(): HomeAssistant {
    if (!this.instance) {
      this.instance = new HomeAssistant();
    }
    return this.instance;
  }

  #getConfig(): { url: string; token: string; entity: string } | null {
    const url = generalConfig.getProperty("homeassistant.url", "string") as string | undefined;
    const token = generalConfig.getProperty("homeassistant.token", "string") as string | undefined;
    const entity = generalConfig.getProperty("homeassistant.amplifier_entity", "string") as string | undefined;

    if (!url || !token || !entity) return null;

    return {
      url: url.replace(/\/$/, ""),
      token,
      entity,
    };
  }

  #pollSync(): void {
    const config = this.#getConfig();
    if (!config) return;

    try {
      const result = exec([
        "curl", "-s", "-m", "5",
        "-H", `Authorization: Bearer ${config.token}`,
        "-H", "Content-Type: application/json",
        `${config.url}/api/states/${config.entity}`,
      ]);

      const state = JSON.parse(result);
      this.amplifierOn = state.state !== "off" && state.state !== "unavailable" && state.state !== "unknown";
    } catch (e) {
      // Silently fail on poll errors
    }
  }

  async #pollAsync(): Promise<void> {
    const config = this.#getConfig();
    if (!config) return;

    try {
      const result = await execAsync([
        "curl", "-s", "-m", "5",
        "-H", `Authorization: Bearer ${config.token}`,
        "-H", "Content-Type: application/json",
        `${config.url}/api/states/${config.entity}`,
      ]);

      const state = JSON.parse(result);
      this.amplifierOn = state.state !== "off" && state.state !== "unavailable" && state.state !== "unknown";
    } catch (e) {
      // Silently fail on poll errors
    }
  }

  async toggle(): Promise<void> {
    const config = this.#getConfig();
    if (!config) return;

    try {
      await execAsync([
        "curl", "-s", "-m", "5",
        "-X", "POST",
        "-H", `Authorization: Bearer ${config.token}`,
        "-H", "Content-Type: application/json",
        "-d", JSON.stringify({ entity_id: config.entity }),
        `${config.url}/api/services/media_player/toggle`,
      ]);

      // Optimistically update state
      this.amplifierOn = !this.#amplifierOn;

      // Re-poll to confirm actual state
      this.#pollAsync();
    } catch (e) {
      console.error("HomeAssistant: failed to toggle amplifier:", e);
    }
  }

  #startPolling(): void {
    this.#timeoutId = GLib.timeout_add(GLib.PRIORITY_DEFAULT, POLL_INTERVAL_MS, () => {
      this.#pollAsync();
      return GLib.SOURCE_CONTINUE;
    });
  }
}
