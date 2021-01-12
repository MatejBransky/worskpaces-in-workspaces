import { Plugin } from "vite";

export default watchWorkspaces;
declare function watchWorkspaces(...rootPaths: string[]): Plugin;
