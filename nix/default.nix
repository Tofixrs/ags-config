{stdenv}:
stdenv.mkDerivation {
  pname = "ags-config";
  version = "1.0.0";
  src = ../.;
  buildInputs = [];
  buildPhase = ''
    runHook preBuild

    runHook postBuild
  '';
  installPhase = ''
    runHook preInstall

    cp config.js $out/
    cp -r src $out/
    cp -r css $out/

    runHook postInstall
  '';
}
