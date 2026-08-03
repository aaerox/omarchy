-- Floating windows
o.window({ tag = "floating-window" }, { float = true })
o.window({ tag = "floating-window" }, { center = true })
o.window({ tag = "floating-window" }, { size = { 875, 600 } })

o.window(
  "(blueberry.py|org.pulseaudio.pavucontrol|org.coolercontrol.CoolerControl|obsbot-gui|com.omarchy.Impala|com.omarchy.Wiremix|com.omarchy.Omarchy|org.gnome.NautilusPreviewer|com.gabm.satty|Omarchy|About|TUI.float)",
  { tag = "+floating-window" }
)
o.window({
  class = "(xdg-desktop-portal-gtk|sublime_text|DesktopEditors|org.gnome.Nautilus)",
  title = "^(Open.*Files?|Open [F|f]older.*|Save.*Files?|Save.*As|Save|All Files|.*wants to [open|save].*|[C|c]hoose.*)",
}, { tag = "+floating-window" })
o.window("org.coolercontrol.CoolerControl", { size = { 1755, 1080 } })
o.window("org.gnome.Calculator", { float = true })

-- Fullscreen screensaver
o.window("Screensaver", { fullscreen = true })

-- No transparency on media windows
o.window("^(zoom|vlc|mpv|org.kde.kdenlive|com.obsproject.Studio|com.github.PintaProject.Pinta|imv|org.gnome.NautilusPreviewer)$", { opacity = "1 1" })

-- Popped window rounding
o.window({ tag = "pop" }, { rounding = 8 })
