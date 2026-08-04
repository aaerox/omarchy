-- Menus
o.bind("SUPER + SPACE", "Launch apps", "omarchy-launch-walker")
o.bind("SUPER + CTRL + E", "Emoji picker", "omarchy-launch-walker -m symbols")
o.bind("SUPER + ALT + SPACE", "Omarchy menu", "omarchy-menu")
o.bind("SUPER + ESCAPE", "System menu", "omarchy-menu system")
o.bind("XF86PowerOff", "Power menu", "omarchy-menu system", { locked = true })
o.bind("SUPER + K", "Show key bindings", "omarchy-menu-keybindings")
o.bind("XF86Calculator", "Calculator", "gnome-calculator")

-- Aesthetics
o.bind("SUPER + SHIFT + SPACE", "Restart top bar", "omarchy-restart-bar")
o.bind("SUPER + CTRL + SPACE", "Next background in theme", "omarchy-theme-bg-next")
o.bind("SUPER + SHIFT + CTRL + SPACE", "Theme menu", "omarchy-menu theme")
o.bind("SUPER + BACKSPACE", "Toggle window transparency", [[hyprctl dispatch "hl.dsp.window.set_prop({ window = 'address:$(hyprctl activewindow -j | jq -r .address)', prop = 'opaque', value = 'toggle' })"]])
o.bind("SUPER + SHIFT + BACKSPACE", "Toggle workspace gaps", "omarchy-hyprland-workspace-toggle-gaps")

-- Notifications
o.bind("SUPER + comma", "Dismiss last notification", "makoctl dismiss")
o.bind("SUPER + SHIFT + comma", "Dismiss all notifications", "makoctl dismiss --all")
o.bind("SUPER + CTRL + comma", "Toggle silencing notifications", [[makoctl mode -t do-not-disturb && makoctl mode | grep -q 'do-not-disturb' && notify-send "Silenced notifications" || notify-send "Enabled notifications"]])

-- Toggle idling
o.bind("SUPER + CTRL + I", "Toggle locking on idle", "omarchy-toggle-idle")

-- Toggle nightlight
o.bind("SUPER + CTRL + N", "Toggle nightlight", "omarchy-toggle-nightlight")

-- Control Apple Display brightness
o.bind("CTRL + F1", "Apple Display brightness down", "omarchy-cmd-apple-display-brightness -5000")
o.bind("CTRL + F2", "Apple Display brightness up", "omarchy-cmd-apple-display-brightness +5000")
o.bind("SHIFT + CTRL + F2", "Apple Display full brightness", "omarchy-cmd-apple-display-brightness +60000")

-- Captures
o.bind("PRINT", "Screenshot with editing", "omarchy-cmd-screenshot")
o.bind("SHIFT + PRINT", "Screenshot to clipboard", "omarchy-cmd-screenshot smart clipboard")
o.bind("ALT + PRINT", "Screenrecording", "omarchy-menu screenrecord")
o.bind("SUPER + PRINT", "Color picker", "pkill hyprpicker || hyprpicker -a")

-- File sharing
o.bind("SUPER + CTRL + S", "Share", "omarchy-menu share")

-- Waybar-less information
o.bind("SUPER + CTRL + T", "Show time", [[notify-send "    $(date +"%A %H:%M  —  %d %B W%V %Y")"]])
o.bind("SUPER + CTRL + B", "Show battery remaining", [[notify-send "󰁹    Battery is at $(omarchy-battery-remaining)%"]])
