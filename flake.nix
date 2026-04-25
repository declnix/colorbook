{
  description = "Colorbook";

  inputs.nixpkgs.url = "github:NixOS/nixpkgs/nixos-unstable";

  outputs = { nixpkgs, ... }: let
    system = "x86_64-linux";
    pkgs = nixpkgs.legacyPackages.${system};
  in {
    packages.${system}.default = pkgs.buildNpmPackage {
      pname = "colorbook";
      version = "0.0.1";

      src = ./.;

      npmDepsHash = "sha256-JAcedma6mKBMBocZBJWHd6k8zJD30N1sqmuuEP+bDUM=";

      buildPhase = ''
        npm run build
      '';

      installPhase = ''
        cp -r dist $out
      '';
    };
  };
}
