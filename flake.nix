{
  outputs = inputs @ {
    self,
    nixpkgs,
    flake-utils,
    systems,
    ...
  }:
    flake-utils.lib.eachSystem (import systems)
    (system: let
      pkgs = import nixpkgs {
        inherit system;
      };
    in {
      devShells.default = pkgs.mkShell {
        buildInputs = [
          pkgs.typescript
          pkgs.sass
          pkgs.nodejs_22
        ];
      };
      packages = {
        default = pkgs.callPackage ./nix {inherit inputs;};
      };
      homeManagerModules.default = import ./nix/homeManager.nix inputs;
    });

  inputs = {
    nixpkgs.url = "github:NixOS/nixpkgs/master";
    flake-utils = {
      url = "github:numtide/flake-utils";
      inputs.systems.follows = "systems";
    };
    ags = {
      url = "github:Aylur/ags";
      inputs.nixpkgs.follows = "nixpkgs";
    };
    systems.url = "github:nix-systems/x86_64-linux";
  };
}
