-- See https://wiki.hypr.land/Configuring/Basics/Window-Rules/ for more
o.window(".*", { suppress_event = "maximize" })

-- Just dash of opacity by default
o.window(".*", { opacity = "0.97 0.9" })

-- Fix some dragging issues with XWayland
o.window(
  {
    class = "^$",
    title = "^$",
    xwayland = true,
    float = true,
    fullscreen = false,
    pin = false,
  },
  { no_focus = true }
)

-- App-specific tweaks
require("default.hypr.apps")
