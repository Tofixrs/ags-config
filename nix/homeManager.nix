{
  lib,
  config,
  ...
}:
with lib; {
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
  config.xdgConfig."ags-config/config.json".text = builtins.toJSON config.programs.ags-config;
}
