{
  inputs,
  self,
  ...
}: {
  perSystem = {
    pkgs,
    inputs',
    self',
    ...
  }: {
    packages = {
      config = pkgs.callPackage (import ./config.nix {inherit inputs' inputs self;}) {};
      default = self'.packages.config;
    };
  };
}
