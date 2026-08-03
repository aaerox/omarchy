-- Application bindings
local terminal = "uwsm-app -- xdg-terminal-exec"
local browser = "omarchy-launch-browser"

o.bind("SUPER + Q", "Terminal", terminal .. [[ --dir="$(omarchy-cmd-terminal-cwd)"]])
o.bind("SUPER + RETURN", "Terminal", terminal .. [[ --dir="$(omarchy-cmd-terminal-cwd)"]])
o.bind("SUPER + SHIFT + F", "File manager", "uwsm-app -- nautilus --new-window")
o.bind("SUPER + SHIFT + B", "Browser", browser)
o.bind("SUPER + SHIFT + ALT + B", "Browser (private)", browser .. " --private")
o.bind("SUPER + SHIFT + M", "Music", "omarchy-launch-or-focus feishin")
o.bind("SUPER + SHIFT + N", "Editor", "omarchy-launch-editor")
o.bind("SUPER + SHIFT + T", "Activity", terminal .. " -e btop")
o.bind("SUPER + SHIFT + D", "Docker", terminal .. " -e lazydocker")
o.bind("SUPER + SHIFT + O", "Obsidian", [[omarchy-launch-or-focus "^obsidian$" "uwsm-app -- obsidian -disable-gpu --enable-wayland-ime"]])
o.bind("SUPER + SHIFT + W", "Typora", "uwsm-app -- typora --enable-wayland-ime")

o.bind("SUPER + SHIFT + A", "Claude", [[omarchy-launch-webapp "https://claude.ai"]])
o.bind("SUPER + SHIFT + E", "Email", [[omarchy-launch-webapp "https://app.hey.com"]])
o.bind("SUPER + SHIFT + Y", "YouTube", [[omarchy-launch-webapp "https://youtube.com/"]])
o.bind("SUPER + SHIFT + ALT + G", "WhatsApp", [[omarchy-launch-or-focus-webapp WhatsApp "https://web.whatsapp.com/"]])
o.bind("SUPER + SHIFT + CTRL + G", "Google Messages", [[omarchy-launch-or-focus-webapp "Google Messages" "https://messages.google.com/web/conversations"]])
o.bind("SUPER + SHIFT + P", "Google Photos", [[omarchy-launch-or-focus-webapp "Google Photos" "https://photos.google.com/"]])
o.bind("SUPER + SHIFT + X", "X", [[omarchy-launch-webapp "https://x.com/"]])
o.bind("SUPER + SHIFT + ALT + X", "X Post", [[omarchy-launch-webapp "https://x.com/compose/post"]])
o.bind("SUPER + SHIFT + H", "Home Assistant", [[omarchy-launch-webapp "https://home.jondaly.dev/dashboard-home/0"]])

-- Confine SUPER+TAB workspace cycling to the focused monitor (DP-2), so the
-- audio-only DP-1 workspace never appears in the cycle. The omarchy default uses
-- `e+1`/`e-1` (next/prev EXISTING workspace, across ALL monitors), which always
-- lands on DP-1's held-open workspace. `m+1`/`m-1` cycle only the current
-- monitor's workspaces. DP-1 stays connected for 7.1 audio.
hl.unbind("SUPER + TAB")
hl.unbind("SUPER + SHIFT + TAB")
o.bind("SUPER + TAB", "Next workspace", hl.dsp.focus({ workspace = "m+1" }))
o.bind("SUPER + SHIFT + TAB", "Previous workspace", hl.dsp.focus({ workspace = "m-1" }))

-- Same fix for SUPER + scroll workspace cycling.
hl.unbind("SUPER + mouse_down")
hl.unbind("SUPER + mouse_up")
o.bind("SUPER + mouse_down", "Scroll active workspace forward", hl.dsp.focus({ workspace = "m+1" }))
o.bind("SUPER + mouse_up", "Scroll active workspace backward", hl.dsp.focus({ workspace = "m-1" }))

-- Move between / push windows across monitors. Hyprland's numbered workspaces
-- are global (a workspace lives on whichever monitor it was first opened on), so
-- SUPER+[SHIFT+]number can't target "the focused monitor". These binds are the
-- way to send a window to the projector (or back). Target the two REAL displays
-- BY NAME (not mon:+1/-1) so a window can never be flung onto the audio-only
-- DP-1 Anthem -- directional cycling would include it. (If the projector is off,
-- moving to HDMI-A-1 is a harmless no-op.)
-- Focus main display AND warp the cursor onto it -- doubles as a guaranteed
-- "rescue" if the pointer ever gets stranded on the invisible audio DP-1 (the
-- explicit cursor move works even with cursor:no_warps, which can suppress
-- focus({monitor})'s own warp).
o.bind("SUPER + comma", "Focus main display", function()
  hl.dispatch(hl.dsp.focus({ monitor = "DP-2" }))
  hl.dispatch(hl.dsp.cursor.move({ x = 1600, y = 700 }))
end)
o.bind("SUPER + period", "Focus projector", hl.dsp.focus({ monitor = "HDMI-A-1" }))
o.bind("SUPER + SHIFT + comma", "Move window to main display", hl.dsp.window.move({ monitor = "DP-2" }))
o.bind("SUPER + SHIFT + period", "Move window to projector", hl.dsp.window.move({ monitor = "HDMI-A-1" }))

-- Display toggles
o.bind("SUPER + F5", "Toggle gaming mode", "omarchy-sunsetr-toggle-gaming")
o.bind("SUPER + F7", "Toggle main display", "omarchy-monitor-toggle DP-2")
o.bind("SUPER + F8", "Toggle projector", "omarchy-monitor-toggle HDMI-A-1")

-- Screenshots (no PrintScreen key)
o.bind("SUPER + SHIFT + S", "Screenshot with editing", "omarchy-cmd-screenshot")
o.bind("SUPER + SHIFT + CTRL + S", "Screenshot to clipboard", "omarchy-cmd-screenshot smart clipboard")

-- VDI clipboard tools
o.bind("SUPER + SHIFT + J", "Screen OCR to clipboard", "~/dev/nwg-capture/screen-ocr")
o.bind("SUPER + SHIFT + K", "Type clipboard (VDI paste)", "~/dev/nwg-capture/type-clipboard", { release = true })
