-- Browser types
o.window("((google-)?[cC]hrom(e|ium)|[bB]rave-browser|Microsoft-edge|Vivaldi-stable|helium)", { tag = "+chromium-based-browser" })
o.window("([fF]irefox|zen|librewolf)", { tag = "+firefox-based-browser" })

-- TODO: This makes webapps float as well, which is undesirable
-- -- Float Chrome extension popups (class pattern: chrome-[extension-id]-Default)
-- o.window("^chrome-.*-Default$", { float = true })
-- o.window("^chrome-.*-Default$", { center = true })

-- Force chromium-based browsers into a tile to deal with --app bug
o.window({ tag = "chromium-based-browser" }, { tile = true })

-- Only a subtle opacity change, but not for video sites
o.window({ tag = "chromium-based-browser" }, { opacity = "1 0.97" })
o.window({ tag = "firefox-based-browser" }, { opacity = "1 0.97" })

-- Some video sites should never have opacity applied to them
o.window({ initial_title = [[((?i)(?:[a-z0-9-]+\.)*youtube\.com_/|app\.zoom\.us_/wc/home)]] }, { opacity = "1.0 1.0" })
