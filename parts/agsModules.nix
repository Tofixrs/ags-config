{
  flake.lib.modules = {inputs'}:
    with inputs'.ags.packages; [
      hyprland
      network
      mpris
      bluetooth
      battery
      wireplumber
      tray
      notifd
      apps
    ];
}
