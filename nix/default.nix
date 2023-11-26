{
  stdenv,
  pkgs,
}:
stdenv.mkDerivation {
  pname = "ags-config";
  version = "0.0.1";
  src = ../.;
  buildInputs = [
    pkgs.nodejs
    pkgs.nodePackages.typescript
  ];
  buildPhase = ''
    runHook preBuild

    npm run build || echo ""

    runHook postBuild
  '';
  installPhase = ''
    runHook preInstall

    cp -r dist $out/
    cp -r css $out/

    runHook postInstall
  '';
}
