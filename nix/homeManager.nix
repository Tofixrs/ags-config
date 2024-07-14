inputs: {
  lib,
  config,
  ...
}:
with lib; {
  options.programs.ags-config.enabled = mkEnableOption "ags" // {default = false;};
  options.programs.ags-config.weather = {
    apiKey = mkOption {
      type = types.nonEmptyStr;
      default = "";
    };
    cities = mkOption {
      description = "List of openwheater city ids";
      type = types.listOf types.int;
    };
  };
  config = mkIf config.programs.ags-config.enabled {
    xdgConfig."ags-config/config.json".text = builtins.toJSON config.programs.ags-config;
    home.packages = [
      inputs.self.packages.default
    ];
  };
}
