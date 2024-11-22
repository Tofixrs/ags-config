{
  inputs',
  inputs,
  self,
}: {pkgs}:
inputs.ags.lib.bundle {
  inherit pkgs;
  src = ../../.;
  name = "ags-config";
  entry = "app.ts";
  extraPackages = self.lib.modules {inherit inputs';};
}
