// English translations inlined from colorshell
const translations: Record<string, string> = {
    "apps": "Applications",
    "media.no_title": "No title",
    "media.no_artist": "No artist",
    "media.play": "Play",
    "media.pause": "Pause",
    "media.next": "Next",
    "media.previous": "Previous",
    "copy_to_clipboard": "Copy to clipboard",
    "control_center.tiles.network.network": "Network",
    "control_center.tiles.network.wireless": "Wi-Fi",
    "control_center.tiles.network.wired": "Wired",
    "control_center.pages.sound.title": "Sound",
    "control_center.pages.microphone.title": "Microphone",
    "control_center.pages.backlight.title": "Backlight",
    "control_center.pages.backlight.refresh": "Refresh backlights",
    "control_center.pages.network.title": "Network",
    "control_center.pages.network.interface": "Interface",
    "control_center.pages.bluetooth.title": "Bluetooth",
    "control_center.pages.bluetooth.start_discovering": "Start discovering",
    "control_center.pages.bluetooth.stop_discovering": "Stop discovering",
    "control_center.pages.bluetooth.paired_devices": "Paired Devices",
    "control_center.pages.bluetooth.new_devices": "New devices",
    "connect": "Connect",
    "disconnect": "Disconnect",
    "connected": "Connected",
    "disconnected": "Disconnected",
};

export function tr(key: string): string {
    return translations[key] || key;
}
