-- Learn how to configure Hyprland: https://wiki.hypr.land/Configuring/Start/

-- Omarchy's bootstrap sets up the Lua module path (default.hypr.* from
-- ~/.local/share/omarchy, hypr.* from ~/.config).
dofile((os.getenv("OMARCHY_PATH") or (os.getenv("HOME") .. "/.local/share/omarchy")) .. "/default/hypr/bootstrap.lua")

-- Use Omarchy defaults (but don't edit those directly!)
require("default.hypr.omarchy")

-- Change your own setup in these files (and overwrite any settings from defaults!)
require("hypr.monitors")
require("hypr.input")
require("hypr.bindings")
require("hypr.envs")
require("hypr.looknfeel")
require("hypr.autostart")

-- Add any other personal Hyprland configuration below
-- o.window("qemu", { workspace = "5" })

-- Keep Citrix virtual desktop fully opaque (overrides default 0.97/0.9)
o.window("^(Wfica)$", { opacity = "1.0 override 1.0 override" })

-- Float Zoom modal popups; keep the main meeting window tiled
o.window("^(zoom)$", { float = true })
o.window({ class = "^(zoom)$", title = "^(Zoom Meeting)$" }, { tile = true })

-- gamescope (Steam games): force the nested window fullscreen instead of a tiny
-- tiled window
o.window("^(gamescope)$", { fullscreen = true })
