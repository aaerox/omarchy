local active_border = { colors = { "rgba(33ccffee)", "rgba(00ff99ee)" }, angle = 45 }

hl.config({
  general = {
    col = { active_border = active_border },
  },

  group = {
    col = { border_active = active_border },
  },
})
