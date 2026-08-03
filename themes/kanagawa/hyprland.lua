local active_border = "rgb(dcd7ba)"

hl.config({
  general = {
    col = { active_border = active_border },
  },

  group = {
    col = { border_active = active_border },
  },
})

-- Kanagawa backdrop is too strong for default opacity
hl.window_rule({ match = { tag = "terminal" }, opacity = "0.98 0.95" })
