// Placeholder config - simple defaults
export const generalConfig = {
  getProperty: (key: string, type: string) => {
    if (key === "clock.date_format") return "%A %d, %H:%M";
    if (key === "workspaces.always_show_id") return false;
    if (key === "workspaces.enable_helper") return true;
    if (key === "workspaces.hide_if_single") return false;
    return null;
  },
  bindProperty: (key: string, type: string) => {
    return { as: (fn: any) => fn(generalConfig.getProperty(key, type)) };
  }
};
