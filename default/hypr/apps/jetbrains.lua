-- JetBrains windows default size
o.window({ class = "(.*jetbrains.*)$", title = "^$" }, { size = { "(monitor_w*0.5)", "(monitor_h*0.5)" } })

-- Fix tab dragging (tab titles are just one space)
o.window({ class = "^(.*jetbrains.*)$", title = [[^\s$]] }, { no_initial_focus = true })
