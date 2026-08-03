-- Omarchy Hyprland setup: helpers, defaults, and current theme overrides.
-- Load order mirrors the old hyprland.conf source order.

require("default.hypr.helpers")
local require_optional = require("default.hypr.require_optional")

-- Use Omarchy defaults, but don't edit these directly.
require("default.hypr.autostart")
require("default.hypr.bindings.media")
require("default.hypr.bindings.clipboard")
require("default.hypr.bindings.tiling-v2")
require("default.hypr.bindings.utilities")
require("default.hypr.envs")
require("default.hypr.looknfeel")
require("default.hypr.input")
require("default.hypr.windows")

-- Current theme overrides.
require_optional.module("omarchy.current.theme.hyprland")
