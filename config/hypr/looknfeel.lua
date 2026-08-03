-- Change the default Omarchy look'n'feel

hl.config({
  -- https://wiki.hypr.land/Configuring/Basics/Variables/#general
  general = {
    -- No gaps between windows or borders
    -- gaps_in = 0,
    -- gaps_out = 0,
    -- border_size = 0,

    -- Use master layout instead of dwindle
    -- layout = "master",
  },

  -- https://wiki.hypr.land/Configuring/Basics/Variables/#decoration
  decoration = {
    -- Use round window corners
    rounding = 8,
  },

  -- https://wiki.hypr.land/Configuring/Basics/Variables/#layout
  layout = {
    -- Avoid overly wide single-window layouts on wide screens
    single_window_aspect_ratio = { 1.2, 1 },
  },

  -- Stop the cursor teleporting away to another monitor. By default Hyprland WARPS
  -- the cursor onto whatever window grabs focus -- so when Steam (XWayland, a known
  -- focus-stealer) raises a window/notification, the pointer jumps to it and is
  -- "lost" on the audio output or projector. no_warps keeps the cursor where it is
  -- on focus changes; focus_on_activate=false stops apps stealing focus to begin
  -- with. Overrides default/hypr/looknfeel.lua (loaded earlier).
  cursor = {
    no_warps = true,
    -- Place the cursor on DP-2 (main display) at startup. Without this Hyprland
    -- puts it on whatever monitor it focuses first -- often the audio-only DP-1,
    -- which sits behind a coordinate gap, so the cursor gets stranded there with
    -- no way to mouse it back. This is the fix for "cursor on the audio screen
    -- every time Hyprland loads".
    default_monitor = "DP-2",
  },

  misc = {
    focus_on_activate = false,

    -- Open windows on the CURRENTLY focused workspace, not the one that was
    -- active when the app's process started. Hyprland's default (1) "remembers"
    -- the launch-time workspace, so apps autostarted at login -- or any
    -- long-lived launcher whose process began while workspace 1 (DP-2's default,
    -- lowest-numbered) was focused -- drop their new windows back onto
    -- workspace 1 instead of where you are now. 0 = always use focused workspace.
    initial_workspace_tracking = 0,
  },
})

-- Auto-hiding AGS top bar (namespace "top-bar"): slide in/out on open/close, and
-- a frosted blur backdrop behind it (bar CSS bg is semi-transparent so it shows).
hl.layer_rule({
  match = { namespace = "top-bar" },
  animation = "slide",
  blur = true,
  ignore_alpha = 0.2,
})
