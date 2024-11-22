{self, ...}: {
  perSystem = {
    pkgs,
    inputs',
    ...
  }: {
    devShells.default = pkgs.mkShellNoCC {
      name = "dev";
      buildInputs = [
        (inputs'.ags.packages.default.override {
          extraPackages = self.lib.modules {inherit inputs';};
        })
      ];
    };
  };
}
