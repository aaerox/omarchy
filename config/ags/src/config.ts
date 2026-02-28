import { Config } from "./modules/config";
import GLib from "gi://GLib?version=2.0";

const generalConfigDefaults = {
    notifications: {
        timeout_low: 4000,
        timeout_normal: 6000,
        timeout_critical: 0,
        position_h: "right",
        position_v: "top",
        dismiss_on_unhover: false
    },
    night_light: {
        save_on_shutdown: true
    },
    wallpaper: {
        positioning: "cover",
        color_mode: "darken"
    },
    workspaces: {
        always_show_id: false,
        enable_helper: true,
        hide_if_single: false
    },
    clock: {
        date_format: "%A %d, %H:%M"
    },
    misc: {
        play_bell_on_volume_change: true
    },
    homeassistant: {
        url: "http://192.168.8.40:8123",
        token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJlMzI2NzJjYTAxYTE0NzJmODkyNzQxOTJiYTVlZWZlMCIsImlhdCI6MTc3MjI3OTgxOCwiZXhwIjoyMDg3NjM5ODE4fQ.yiMnvrp5Y8eXLYcpW-meXpxgB2CkbX0Myf5fvcDCDT0",
        amplifier_entity: "media_player.amplifier"
    }
};

const userDataDefaults = {
    bluetooth_default_adapter: undefined as unknown as string,
    night_light: {
        temperature: 6000,
        gamma: 100,
        identity: true
    }
};

export const userData = new Config<
    keyof typeof userDataDefaults,
    (typeof userDataDefaults)[keyof typeof userDataDefaults]
>(
    `${GLib.get_user_data_dir()}/omarchy-ags/data.json`,
    userDataDefaults
);

export const generalConfig = new Config<keyof typeof generalConfigDefaults,
    typeof generalConfigDefaults[keyof typeof generalConfigDefaults]>(
        `${GLib.get_user_config_dir()}/omarchy-ags/config.json`,
        generalConfigDefaults
);
