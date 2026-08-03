-- Only display the OSD on the currently focused monitor
local osdclient = [[swayosd-client --monitor "$(hyprctl monitors -j | jq -r '.[] | select(.focused == true).name')"]]

-- Laptop multimedia keys for volume and LCD brightness (with OSD)
o.bind("XF86AudioRaiseVolume", "Volume up", osdclient .. " --output-volume +2", { repeating = true, locked = true })
o.bind("XF86AudioLowerVolume", "Volume down", osdclient .. " --output-volume -2", { repeating = true, locked = true })
o.bind("XF86AudioMute", "Mute", osdclient .. " --output-volume mute-toggle", { repeating = true, locked = true })
o.bind("XF86AudioMicMute", "Mute microphone", osdclient .. " --input-volume mute-toggle", { repeating = true, locked = true })
o.bind("XF86MonBrightnessUp", "Brightness up", osdclient .. " --brightness raise", { repeating = true, locked = true })
o.bind("XF86MonBrightnessDown", "Brightness down", osdclient .. " --brightness lower", { repeating = true, locked = true })

-- Precise 1% multimedia adjustments with Alt modifier
o.bind("ALT + XF86AudioRaiseVolume", "Volume up precise", osdclient .. " --output-volume +1", { repeating = true, locked = true })
o.bind("ALT + XF86AudioLowerVolume", "Volume down precise", osdclient .. " --output-volume -1", { repeating = true, locked = true })
o.bind("ALT + XF86MonBrightnessUp", "Brightness up precise", osdclient .. " --brightness +1", { repeating = true, locked = true })
o.bind("ALT + XF86MonBrightnessDown", "Brightness down precise", osdclient .. " --brightness -1", { repeating = true, locked = true })

-- Requires playerctl
o.bind("XF86AudioNext", "Next track", osdclient .. " --playerctl next", { locked = true })
o.bind("XF86AudioPause", "Pause", osdclient .. " --playerctl play-pause", { locked = true })
o.bind("XF86AudioPlay", "Play", osdclient .. " --playerctl play-pause", { locked = true })
o.bind("XF86AudioPrev", "Previous track", osdclient .. " --playerctl previous", { locked = true })

-- Switch audio output with Super + Mute
o.bind("SUPER + XF86AudioMute", "Switch audio output", "omarchy-cmd-audio-switch", { locked = true })
