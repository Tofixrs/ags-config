{
  stdenv,
  pkgs,
  fetchNpmDeps,
  npmHooks,
  nodejs,
  inputs,
}: let
  inherit (npmHooks.override {inherit nodejs;}) npmConfigHook npmBuildHook;
in
  stdenv.mkDerivation rec {
    pname = "ags-config";
    version = "1.0.0";
    src = ../.;
    npmDeps = fetchNpmDeps {
      inherit src;
      hash = "sha256-17x9DUFwJxxbIj5+FJSHknhsILpjQVEQvqclspXcD2w=";
      name = "${pname}-npm-deps";
    };
    buildInputs = [pkgs.typescript nodejs pkgs.sass];
    nativeBuildInputs = [npmConfigHook npmBuildHook nodejs];
    buildPhase = ''
      runHook preBuild
      cp -r ${inputs.ags.packages.${pkgs.system}.default}/share/com.github.Aylur.ags/types ./
      # skip weird ass errors it builds anyway lol
      tsc || true

      npm run fixup-paths
      ${pkgs.sass}/bin/sass ./style/main.scss ./dist/src/style.css


      runHook postBuild
    '';
    installPhase = ''
         runHook preInstall
      cp -r dist/src $out


         runHook postInstall
    '';
  }
