{
  description = "portfolio";

  inputs.nixpkgs.url = "github:nixos/nixpkgs/nixos-unstable";

  outputs = { nixpkgs, ... }:
    let
      system = "x86_64-linux";
      pkgs = nixpkgs.legacyPackages.${system};
      bunScript = name: {
        type = "app";
        program = pkgs.lib.getExe (pkgs.writeShellApplication {
          name = "portfolio-${name}";
          runtimeInputs = [ pkgs.bun ];
          text = ''
            bun install --frozen-lockfile
            bun run ${name} -- "$@"
          '';
        });
      };
    in {
      devShells.${system}.default = pkgs.mkShell { packages = [ pkgs.bun ]; };

      apps.${system} = {
        default = bunScript "dev";
        dev = bunScript "dev";
        build = bunScript "build";
        preview = bunScript "preview";
      };
    };
}
