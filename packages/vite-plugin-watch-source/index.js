const path = require("path");
const fs = require("fs");

module.exports = function watchWorkspaces(...rootPaths) {
  return {
    name: "@packages/vite-plugin-watch-source",

    config: (userConfig) => {
      const modifiedConfig = {
        ...userConfig,
        alias: {
          ...Object.fromEntries(
            rootPaths
              .flatMap((rootPath) => getPackages(rootPath))
              .map((pkg) => [pkg.name, path.join(pkg.name, pkg.source)])
          ),
          ...userConfig.alias,
        },
      };

      console.log("Automatic aliases:", modifiedConfig.alias);

      return modifiedConfig;
    },
  };
};

function getPackages(rootPath) {
  const rootPkg = require(path.resolve(
    process.cwd(),
    rootPath,
    "package.json"
  ));

  const folders = rootPkg.workspaces.flatMap((workspace) => {
    if (workspace.includes("/*")) {
      const folderWithWorkspaces = workspace.replace("/*", "");
      const workspacesFolders = fs.readdirSync(
        path.resolve(process.cwd(), rootPath, folderWithWorkspaces)
      );
      return workspacesFolders.map((folderName) =>
        path.join(folderWithWorkspaces, folderName)
      );
    }
    return workspace;
  });

  const folderPaths = folders.map((folder) =>
    path.resolve(process.cwd(), rootPath, folder)
  );

  const packages = folderPaths
    .map((folderPath) => require(path.resolve(folderPath, "package.json")))
    .filter((pkg) => pkg.source);

  return packages;
}
