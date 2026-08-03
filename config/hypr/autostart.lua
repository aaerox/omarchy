-- Extra autostart processes
hl.on("hyprland.start", function()
  -- hl.exec_cmd("uwsm-app -- my-service")
  hl.exec_cmd("uwsm-app -- plex-mpv-shim")
end)
