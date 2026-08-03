local active_border = { colors = { "rgba(00F5D4ee)", "rgba(FF8855ee)" }, angle = 45 }

hl.config({
  general = {
    col = { active_border = active_border },
  },

  group = {
    col = { border_active = active_border },
  },
})
