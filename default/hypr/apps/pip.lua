-- Picture-in-picture overlays
o.window({ title = "(Picture.?in.?[Pp]icture)" }, { tag = "+pip" })
o.window({ tag = "pip" }, { float = true })
o.window({ tag = "pip" }, { pin = true })
o.window({ tag = "pip" }, { size = { 600, 338 } })
o.window({ tag = "pip" }, { keep_aspect_ratio = true })
o.window({ tag = "pip" }, { decorate = false })
o.window({ tag = "pip" }, { opacity = "1 1" })
o.window({ tag = "pip" }, { move = { "(monitor_w-window_w-40)", "(monitor_h*0.04)" } })
