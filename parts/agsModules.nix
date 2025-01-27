{
  flake.lib.modules = {
    inputs',
    pkgs,
  }:
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
      pkgs.libsoup_3
      pkgs.glib-networking
    ];
}
