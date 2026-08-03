-- Copy / Paste
o.bind("SUPER + C", "Universal copy", hl.dsp.send_shortcut({ mods = "CTRL", key = "Insert", window = "activewindow" }))
o.bind("SUPER + V", "Universal paste", hl.dsp.send_shortcut({ mods = "SHIFT", key = "Insert", window = "activewindow" }))
o.bind("SUPER + X", "Universal cut", hl.dsp.send_shortcut({ mods = "CTRL", key = "X", window = "activewindow" }))
o.bind("SUPER + CTRL + V", "Clipboard manager", "omarchy-launch-walker -m clipboard")
