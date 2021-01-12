import path from "path";
import reactRefresh from "@vitejs/plugin-react-refresh";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [reactRefresh()],
  alias: Object.fromEntries(
    [...getPackages("../"), ...getPackages("../../../")].map((pkg) => [
      pkg.name,
      path.join(pkg.name, pkg.source),
    ])
  ),
});

function getPackages<P extends RootPackageJson>(rootPath: string) {
  const path = require("path") as typeof import("path");
  const fs = require("fs") as typeof import("fs");
  const rootPkg = require(path.resolve(rootPath, "package.json")) as P;
  const folders = rootPkg.workspaces.flatMap((workspace) => {
    if (workspace.includes("/*")) {
      const folderWithWorkspaces = workspace.replace("/*", "");
      const workspacesFolders = fs.readdirSync(
        path.resolve(rootPath, folderWithWorkspaces)
      );
      return workspacesFolders.map((folderName) =>
        path.join(folderWithWorkspaces, folderName)
      );
    }
    return workspace;
  });
  console.log("folders", folders);
  const paths = folders.map((folder) => path.resolve(rootPath, folder));
  const packages = paths
    .map((folderPath) => require(path.resolve(folderPath, "package.json")))
    .filter((pkg) => pkg.source);

  return packages;
}

type RootPackageJson = {
  workspaces: string[];
};
