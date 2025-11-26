# AGS Configuration for Omarchy

This is a minimal AGS (Aylur's GTK Shell) setup based on colorshell, customized for Omarchy.

## Structure

```
config/ags/
├── config.js           # AGS entry point
├── style.css           # Styling for the bar
├── src/
│   ├── app.ts          # Main application logic
│   ├── bar/
│   │   ├── Bar.tsx     # Bar component (modify to rearrange widgets)
│   │   └── widgets/    # Individual widgets
│   │       ├── Clock.tsx
│   │       ├── Workspaces.tsx
│   │       ├── Status.tsx
│   │       └── Tray.tsx
│   └── lib/
│       └── utils.ts    # Utility functions
```

## Customization

### Adding Widgets

1. Create a new widget file in `src/bar/widgets/`, e.g., `MyWidget.tsx`:

```tsx
import { Gtk } from "ags/gtk4";

export const MyWidget = () => (
  <Gtk.Box class="my-widget">
    <Gtk.Label label="Hello!" />
  </Gtk.Box>
);
```

2. Import and add it to `Bar.tsx`:

```tsx
import { MyWidget } from "./widgets/MyWidget";

// Add to widgets-left, widgets-center, or widgets-right:
<Gtk.Box class="widgets-left" ...>
  <Workspaces />
  <MyWidget />  {/* Add here */}
</Gtk.Box>
```

### Styling

Edit `style.css` to customize colors, spacing, fonts, etc. The theme is based on Catppuccin Mocha.

### Reloading

After making changes, reload AGS:
```bash
ags quit && ags --config ~/.local/share/omarchy/config/ags/config.js
```

Or restart Hyprland.

## Dependencies

- AGS (Aylur's GTK Shell)
- Astal libraries (included with AGS)
- AstalHyprland (for workspace management)
- AstalBattery (for battery widget)
- AstalWp (for volume widget)
- AstalNetwork (for network widget)
- AstalTray (for system tray)

## Installing AGS

```bash
# Arch Linux
paru -S ags

# Or build from source
# See: https://github.com/aylur/ags
```

## Disabling Waybar

To prevent conflicts, you can kill any running waybar instance:
```bash
killall waybar
```

The AGS bar will automatically start on Hyprland launch.
